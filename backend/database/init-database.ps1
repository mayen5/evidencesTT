# Script de Inicialización de Base de Datos
# Este script ejecuta todos los scripts SQL en orden para configurar la base de datos

param(
    [string]$ServerName = "localhost",
    [string]$Username = "sa",
    [string]$Password = "Db@dm1n2025",
    [string]$DatabaseName = "EvidenceManagementDB",
    [switch]$UseDocker = $true
)

$ErrorActionPreference = "Stop"

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Database Initialization Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Función para ejecutar scripts SQL
function Invoke-SqlScript {
    param(
        [string]$ScriptPath,
        [string]$Description,
        [bool]$UseDatabase = $true
    )
    
    Write-Host "Executing: $Description" -ForegroundColor Yellow
    
    try {
        if ($UseDocker) {
            if ($UseDatabase) {
                Get-Content $ScriptPath | docker exec -i evidence-sqlserver /opt/mssql-tools18/bin/sqlcmd -S $ServerName -U $Username -P $Password -d $DatabaseName -C
            } else {
                Get-Content $ScriptPath | docker exec -i evidence-sqlserver /opt/mssql-tools18/bin/sqlcmd -S $ServerName -U $Username -P $Password -C
            }
        } else {
            if ($UseDatabase) {
                sqlcmd -S $ServerName -U $Username -P $Password -d $DatabaseName -i $ScriptPath
            } else {
                sqlcmd -S $ServerName -U $Username -P $Password -i $ScriptPath
            }
        }
        
        Write-Host "✓ Success: $Description" -ForegroundColor Green
        Write-Host ""
        return $true
    }
    catch {
        Write-Host "✗ Failed: $Description" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        Write-Host ""
        return $false
    }
}

# Verificar si el contenedor Docker está corriendo (si se usa Docker)
if ($UseDocker) {
    Write-Host "Checking Docker container status..." -ForegroundColor Cyan
    $containerStatus = docker ps --filter "name=evidence-sqlserver" --format "{{.Status}}"
    
    if (-not $containerStatus) {
        Write-Host "✗ Docker container 'evidence-sqlserver' is not running!" -ForegroundColor Red
        Write-Host "Please start it with: docker-compose up -d sqlserver" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "✓ Docker container is running" -ForegroundColor Green
    Write-Host ""
    
    # Esperar a que SQL Server esté listo
    Write-Host "Waiting for SQL Server to be ready..." -ForegroundColor Cyan
    Start-Sleep -Seconds 5
}

# Paso 1: Crear base de datos
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 1: Creating Database" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$createDbQuery = "IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = '$DatabaseName') CREATE DATABASE $DatabaseName;"

if ($UseDocker) {
    $createDbQuery | docker exec -i evidence-sqlserver /opt/mssql-tools18/bin/sqlcmd -S $ServerName -U $Username -P $Password -C
} else {
    sqlcmd -S $ServerName -U $Username -P $Password -Q $createDbQuery
}

Write-Host "✓ Database '$DatabaseName' is ready" -ForegroundColor Green
Write-Host ""

# Paso 2: Ejecutar scripts DDL (Data Definition Language)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 2: Executing DDL Scripts" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$ddlScripts = @(
    @{ Path = "01-DDL\01-create-tables.sql"; Description = "Creating tables" },
    @{ Path = "01-DDL\02-create-indexes.sql"; Description = "Creating indexes" },
    @{ Path = "01-DDL\03-create-triggers.sql"; Description = "Creating triggers" }
)

foreach ($script in $ddlScripts) {
    $scriptPath = Join-Path $PSScriptRoot $script.Path
    if (Test-Path $scriptPath) {
        Invoke-SqlScript -ScriptPath $scriptPath -Description $script.Description
    } else {
        Write-Host "⚠ Warning: Script not found - $($script.Path)" -ForegroundColor Yellow
    }
}

# Paso 3: Ejecutar scripts DML (Data Manipulation Language - Seed Data)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 3: Executing DML Scripts (Seed Data)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$dmlScripts = @(
    @{ Path = "02-DML\01-seed-roles.sql"; Description = "Seeding roles" },
    @{ Path = "02-DML\02-seed-status.sql"; Description = "Seeding case file statuses" },
    @{ Path = "02-DML\03-seed-evidence-types.sql"; Description = "Seeding evidence types" },
    @{ Path = "02-DML\04-seed-admin-user.sql"; Description = "Creating admin user" }
)

foreach ($script in $dmlScripts) {
    $scriptPath = Join-Path $PSScriptRoot $script.Path
    if (Test-Path $scriptPath) {
        Invoke-SqlScript -ScriptPath $scriptPath -Description $script.Description
    } else {
        Write-Host "⚠ Warning: Script not found - $($script.Path)" -ForegroundColor Yellow
    }
}

# Paso 4: Ejecutar Stored Procedures
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "STEP 4: Creating Stored Procedures" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Stored Procedures de Auth
Write-Host "Creating Auth stored procedures..." -ForegroundColor Cyan
$authSpScripts = Get-ChildItem -Path (Join-Path $PSScriptRoot "03-StoredProcedures\auth") -Filter "*.sql" -ErrorAction SilentlyContinue

foreach ($script in $authSpScripts) {
    Invoke-SqlScript -ScriptPath $script.FullName -Description "SP: $($script.Name)"
}

# Stored Procedures de CaseFiles
Write-Host "Creating CaseFiles stored procedures..." -ForegroundColor Cyan
$caseFilesSpScripts = Get-ChildItem -Path (Join-Path $PSScriptRoot "03-StoredProcedures\caseFiles") -Filter "*.sql" -ErrorAction SilentlyContinue

foreach ($script in $caseFilesSpScripts) {
    Invoke-SqlScript -ScriptPath $script.FullName -Description "SP: $($script.Name)"
}

# Stored Procedures de Evidence
Write-Host "Creating Evidence stored procedures..." -ForegroundColor Cyan
$evidenceSpScripts = Get-ChildItem -Path (Join-Path $PSScriptRoot "03-StoredProcedures\evidence") -Filter "*.sql" -ErrorAction SilentlyContinue

foreach ($script in $evidenceSpScripts) {
    Invoke-SqlScript -ScriptPath $script.FullName -Description "SP: $($script.Name)"
}

# Stored Procedures de Users (si existen)
$usersSpPath = Join-Path $PSScriptRoot "03-StoredProcedures\users"
if (Test-Path $usersSpPath) {
    Write-Host "Creating Users stored procedures..." -ForegroundColor Cyan
    $usersSpScripts = Get-ChildItem -Path $usersSpPath -Filter "*.sql" -ErrorAction SilentlyContinue
    
    foreach ($script in $usersSpScripts) {
        Invoke-SqlScript -ScriptPath $script.FullName -Description "SP: $($script.Name)"
    }
}

# Stored Procedures de Reports (si existen)
$reportsSpPath = Join-Path $PSScriptRoot "03-StoredProcedures\reports"
if (Test-Path $reportsSpPath) {
    Write-Host "Creating Reports stored procedures..." -ForegroundColor Cyan
    $reportsSpScripts = Get-ChildItem -Path $reportsSpPath -Filter "*.sql" -ErrorAction SilentlyContinue
    
    foreach ($script in $reportsSpScripts) {
        Invoke-SqlScript -ScriptPath $script.FullName -Description "SP: $($script.Name)"
    }
}

# Resumen final
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Database Initialization Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Database Name: $DatabaseName" -ForegroundColor White
Write-Host "Server: $ServerName" -ForegroundColor White
Write-Host ""
Write-Host "Default Admin Credentials:" -ForegroundColor Yellow
Write-Host "  Username: admin" -ForegroundColor White
Write-Host "  Email: admin@evidence.com" -ForegroundColor White
Write-Host "  Password: Admin@123" -ForegroundColor White
Write-Host ""
Write-Host "⚠ Remember to change the admin password after first login!" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Start backend: cd backend && npm run dev" -ForegroundColor White
Write-Host "  2. Access API: http://localhost:3000/api/v1" -ForegroundColor White
Write-Host "  3. View docs: http://localhost:3000/api-docs" -ForegroundColor White
Write-Host ""
