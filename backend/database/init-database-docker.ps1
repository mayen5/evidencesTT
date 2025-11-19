<#
.SYNOPSIS
    Inicializa la base de datos EvidenceManagementDB en el contenedor de SQL Server Docker.
    
.DESCRIPTION
    Este script espera a que SQL Server esté listo y luego ejecuta todos los scripts de inicialización
    (DDL, DML y Stored Procedures) en el contenedor Docker.
    
.PARAMETER ContainerName
    Nombre del contenedor Docker de SQL Server (por defecto: evidence-sqlserver)
    
.PARAMETER DatabaseName
    Nombre de la base de datos a crear (por defecto: EvidenceManagementDB)
    
.PARAMETER Password
    Contraseña del usuario SA (por defecto: Db@dm1n2025)
    
.EXAMPLE
    .\init-database-docker.ps1
    
.EXAMPLE
    .\init-database-docker.ps1 -ContainerName "mi-sqlserver" -Password "MiPassword123"
#>

[CmdletBinding()]
param(
    [string]$ContainerName = "evidence-sqlserver",
    [string]$DatabaseName = "EvidenceManagementDB",
    [SecureString]$Password,
    [switch]$Force
)

$ErrorActionPreference = "Stop"

# Convertir SecureString a texto plano para usar con Docker
if (-not $Password) {
    $Password = ConvertTo-SecureString "Db@dm1n2025" -AsPlainText -Force
}
$PlainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($Password)
)

# Colores para la salida
function Write-ColorOutput {
    param(
        [Parameter(Mandatory=$true)]
        [string]$Message,
        [Parameter(Mandatory=$false)]
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Test-Container {
    param([string]$Name)
    $container = docker ps --filter "name=$Name" --format "{{.Names}}" 2>$null
    return $container -eq $Name
}

function Wait-ForSqlServer {
    [Diagnostics.CodeAnalysis.SuppressMessageAttribute('PSAvoidUsingPlainTextForPassword', '')]
    param([string]$Container, [string]$SqlPassword, [int]$MaxAttempts = 30)
    
    Write-ColorOutput "[*] Esperando a que SQL Server este listo..." "Yellow"
    
    for ($i = 1; $i -le $MaxAttempts; $i++) {
        $null = docker exec $Container /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $SqlPassword -C -Q "SELECT 1" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "[OK] SQL Server esta listo!" "Green"
            return $true
        }
        Write-Host "." -NoNewline
        Start-Sleep -Seconds 2
    }
    
    Write-ColorOutput "`n[ERROR] Timeout esperando a SQL Server" "Red"
    return $false
}

function Test-DatabaseExists {
    [Diagnostics.CodeAnalysis.SuppressMessageAttribute('PSAvoidUsingPlainTextForPassword', '')]
    param([string]$Container, [string]$DbName, [string]$SqlPassword)
    
    $query = "SELECT COUNT(*) FROM sys.databases WHERE name = '$DbName'"
    $queryResult = docker exec $Container /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $SqlPassword -C -Q $query -h -1 2>$null
    
    return $queryResult.Trim() -eq "1"
}

function Invoke-SqlScriptInContainer {
    [Diagnostics.CodeAnalysis.SuppressMessageAttribute('PSAvoidUsingPlainTextForPassword', '')]
    param(
        [string]$Container,
        [string]$ScriptPath,
        [string]$DbName,
        [string]$SqlPassword
    )
    
    $scriptName = Split-Path $ScriptPath -Leaf
    
    # Copiar el script al contenedor
    docker cp $ScriptPath "${Container}:/tmp/${scriptName}" | Out-Null
    
    if ($LASTEXITCODE -ne 0) {
        throw "Error copiando script al contenedor"
    }
    
    # Ejecutar el script
    $scriptResult = docker exec $Container /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $SqlPassword -C -d $DbName -i "/tmp/${scriptName}" 2>&1
    
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput "[ERROR] Error ejecutando: $scriptName" "Red"
        Write-ColorOutput $scriptResult "Red"
        throw "Error en script: $scriptName"
    }
    
    # Limpiar el script temporal
    docker exec $Container rm "/tmp/${scriptName}" | Out-Null
    
    return $true
}

# ==================== MAIN ====================

Write-ColorOutput "`n=========================================================" "Cyan"
Write-ColorOutput "   INICIALIZADOR DE BASE DE DATOS - DOCKER" "Cyan"
Write-ColorOutput "   Sistema de Gestion de Evidencias" "Cyan"
Write-ColorOutput "=========================================================`n" "Cyan"

# 1. Verificar que el contenedor existe y está corriendo
Write-ColorOutput "[*] Verificando contenedor..." "Yellow"
if (-not (Test-Container -Name $ContainerName)) {
    Write-ColorOutput "[ERROR] El contenedor '$ContainerName' no esta corriendo" "Red"
    Write-ColorOutput "[INFO] Ejecuta: docker-compose up -d sqlserver" "Yellow"
    exit 1
}
Write-ColorOutput "[OK] Contenedor encontrado" "Green"

# 2. Esperar a que SQL Server esté listo
if (-not (Wait-ForSqlServer -Container $ContainerName -SqlPassword $PlainPassword)) {
    exit 1
}

# 3. Verificar si la base de datos ya existe
Write-ColorOutput "`n[*] Verificando si la base de datos existe..." "Yellow"
if (Test-DatabaseExists -Container $ContainerName -DbName $DatabaseName -SqlPassword $PlainPassword) {
    Write-ColorOutput "[WARNING] La base de datos '$DatabaseName' ya existe" "Yellow"
    
    if (-not $Force) {
        $response = Read-Host "Deseas eliminarla y recrearla? (S/N)"
        if ($response -ne "S" -and $response -ne "s") {
            Write-ColorOutput "[INFO] Operacion cancelada" "Yellow"
            Write-ColorOutput "[INFO] Usa el parametro -Force para sobrescribir automaticamente" "Cyan"
            exit 0
        }
    } else {
        Write-ColorOutput "[INFO] Modo Force activado - recreando base de datos..." "Yellow"
    }
    
    # Eliminar base de datos existente
    Write-ColorOutput "[*] Eliminando base de datos existente..." "Yellow"
    $dropQuery = "DROP DATABASE IF EXISTS $DatabaseName"
    docker exec $ContainerName /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $PlainPassword -C -Q $dropQuery | Out-Null
    Write-ColorOutput "[OK] Base de datos eliminada" "Green"
}

# 4. Crear la base de datos
Write-ColorOutput "`n[*] Creando base de datos '$DatabaseName'..." "Yellow"
$createDbQuery = "CREATE DATABASE $DatabaseName"
docker exec $ContainerName /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $PlainPassword -C -Q $createDbQuery | Out-Null

if ($LASTEXITCODE -eq 0) {
    Write-ColorOutput "[OK] Base de datos creada exitosamente" "Green"
} else {
    Write-ColorOutput "[ERROR] Error creando la base de datos" "Red"
    exit 1
}

# 5. Ejecutar scripts DDL
Write-ColorOutput "`n[*] Ejecutando scripts DDL..." "Yellow"
$ddlPath = Join-Path $PSScriptRoot "01-DDL"
$ddlScripts = Get-ChildItem -Path $ddlPath -Filter "*.sql" | Sort-Object Name

foreach ($script in $ddlScripts) {
    Write-ColorOutput "   -> Ejecutando: $($script.Name)" "Cyan"
    try {
        Invoke-SqlScriptInContainer -Container $ContainerName -ScriptPath $script.FullName -DbName $DatabaseName -SqlPassword $PlainPassword
        Write-ColorOutput "   [OK] $($script.Name)" "Green"
    } catch {
        Write-ColorOutput "   [ERROR] Error en $($script.Name): $_" "Red"
        exit 1
    }
}

# 6. Ejecutar scripts DML
Write-ColorOutput "`n[*] Ejecutando scripts DML (datos iniciales)..." "Yellow"
$dmlPath = Join-Path $PSScriptRoot "02-DML"
$dmlScripts = Get-ChildItem -Path $dmlPath -Filter "*.sql" | Sort-Object Name

foreach ($script in $dmlScripts) {
    Write-ColorOutput "   -> Ejecutando: $($script.Name)" "Cyan"
    try {
        Invoke-SqlScriptInContainer -Container $ContainerName -ScriptPath $script.FullName -DbName $DatabaseName -SqlPassword $PlainPassword
        Write-ColorOutput "   [OK] $($script.Name)" "Green"
    } catch {
        Write-ColorOutput "   [ERROR] Error en $($script.Name): $_" "Red"
        exit 1
    }
}

# 7. Ejecutar Stored Procedures
Write-ColorOutput "`n[*] Creando Stored Procedures..." "Yellow"
$spPath = Join-Path $PSScriptRoot "03-StoredProcedures"
$spDirectories = @("auth", "caseFiles", "evidence", "users", "reports")

foreach ($dir in $spDirectories) {
    $dirPath = Join-Path $spPath $dir
    if (Test-Path $dirPath) {
        Write-ColorOutput "`n   [*] Procesando: $dir/" "Cyan"
        $spScripts = Get-ChildItem -Path $dirPath -Filter "*.sql" | Sort-Object Name
        
        foreach ($script in $spScripts) {
            Write-ColorOutput "      -> $($script.Name)" "Cyan"
            try {
                Invoke-SqlScriptInContainer -Container $ContainerName -ScriptPath $script.FullName -DbName $DatabaseName -SqlPassword $PlainPassword
                Write-ColorOutput "      [OK] $($script.Name)" "Green"
            } catch {
                Write-ColorOutput "      [ERROR] Error en $($script.Name): $_" "Red"
                exit 1
            }
        }
    }
}

# 8. Resumen final
Write-ColorOutput "`n=========================================================" "Green"
Write-ColorOutput "            [OK] INICIALIZACION COMPLETADA" "Green"
Write-ColorOutput "=========================================================`n" "Green"
Write-ColorOutput "Detalles de conexion:" "Cyan"
Write-ColorOutput "   - Servidor: localhost,1433" "White"
Write-ColorOutput "   - Base de datos: $DatabaseName" "White"
Write-ColorOutput "   - Usuario: sa" "White"
Write-ColorOutput "   - Contraseña: $PlainPassword" "White"
Write-ColorOutput "`nCredenciales de administrador:" "Cyan"
Write-ColorOutput "   - Email: admin@evidence.com" "White"
Write-ColorOutput "   - Contraseña: Admin@123`n" "White"
