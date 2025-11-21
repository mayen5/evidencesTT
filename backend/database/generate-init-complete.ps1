#!/usr/bin/env pwsh
# =============================================
# Script: Generate init-complete.sql
# Description: Consolidates all DDL, DML and SP scripts into one file
# Author: Carmelo Mayén
# Date: 2025-11-20
# =============================================

$ErrorActionPreference = "Stop"

Write-Host "`n=============================================" -ForegroundColor Cyan
Write-Host "  Generating init-complete.sql" -ForegroundColor Cyan
Write-Host "=============================================`n" -ForegroundColor Cyan

$content = @"
-- =============================================
-- Sistema de Gestión de Evidencias - Script Completo de Inicialización
-- Author: Carmelo Mayén
-- Date: 2025-11-20
-- Description: Crea la base de datos, tablas, datos iniciales y stored procedures
-- =============================================

-- Create Database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'EvidenceManagementDB')
BEGIN
    CREATE DATABASE EvidenceManagementDB;
    PRINT 'Database EvidenceManagementDB created';
END
GO

USE EvidenceManagementDB;
GO


"@

# Add DDL Scripts
Write-Host "[1/3] Adding DDL scripts..." -ForegroundColor Yellow
$ddlFiles = Get-ChildItem "01-DDL\*.sql" | Sort-Object Name
foreach ($file in $ddlFiles) {
    Write-Host "      -> $($file.Name)" -ForegroundColor Gray
    $fileContent = Get-Content $file.FullName -Raw -Encoding UTF8
    $fileContent = $fileContent -replace "USE EvidenceManagementDB;[\r\n]+GO[\r\n]+", ""
    $content += "-- ========== DDL: $($file.Name) ==========`r`n"
    $content += $fileContent
    $content += "`r`n`r`n"
}

# Add DML Scripts
Write-Host "[2/3] Adding DML scripts..." -ForegroundColor Yellow
$dmlFiles = Get-ChildItem "02-DML\*.sql" | Sort-Object Name
foreach ($file in $dmlFiles) {
    Write-Host "      -> $($file.Name)" -ForegroundColor Gray
    $fileContent = Get-Content $file.FullName -Raw -Encoding UTF8
    $fileContent = $fileContent -replace "USE EvidenceManagementDB;[\r\n]+GO[\r\n]+", ""
    $content += "-- ========== DML: $($file.Name) ==========`r`n"
    $content += $fileContent
    $content += "`r`n`r`n"
}

# Add Stored Procedures
Write-Host "[3/3] Adding Stored Procedures..." -ForegroundColor Yellow
$spDirs = @("auth", "caseFiles", "traceEvidence")
foreach ($dir in $spDirs) {
    $spPath = Join-Path "03-StoredProcedures" $dir
    if (Test-Path $spPath) {
        $spFiles = Get-ChildItem "$spPath\*.sql" | Sort-Object Name
        foreach ($file in $spFiles) {
            Write-Host "      -> $dir\$($file.Name)" -ForegroundColor Gray
            $fileContent = Get-Content $file.FullName -Raw -Encoding UTF8
            $fileContent = $fileContent -replace "USE EvidenceManagementDB;[\r\n]+GO[\r\n]+", ""
            $content += "-- ========== SP: $dir\$($file.Name) ==========`r`n"
            $content += $fileContent
            $content += "`r`n`r`n"
        }
    }
}

# Add footer
$content += @"
-- =============================================
-- INITIALIZATION COMPLETE
-- =============================================
PRINT '';
PRINT '============================================='
PRINT '  Database Initialization Complete';
PRINT '============================================='
PRINT 'Database: EvidenceManagementDB';
PRINT 'Admin Email: admin@evidence.com';
PRINT 'Admin Password: Admin@123';
PRINT '============================================='
GO
"@

# Save file
$outputPath = Join-Path $PSScriptRoot "init-complete.sql"
[System.IO.File]::WriteAllText($outputPath, $content, [System.Text.Encoding]::UTF8)

Write-Host "`n[OK] File '$outputPath' created successfully!" -ForegroundColor Green
if (Test-Path $outputPath) {
    Write-Host "     Size: $([math]::Round((Get-Item $outputPath).Length / 1KB, 2)) KB`n" -ForegroundColor Green
}
