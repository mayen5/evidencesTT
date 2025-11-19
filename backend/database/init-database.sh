#!/bin/bash

# Script de Inicialización de Base de Datos (Linux/Mac)
# Este script ejecuta todos los scripts SQL en orden para configurar la base de datos

# Configuración por defecto
SERVER_NAME="localhost"
USERNAME="sa"
PASSWORD="Db@dm1n2025"
DATABASE_NAME="EvidenceManagementDB"
USE_DOCKER=true

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}=================================${NC}"
echo -e "${CYAN}Database Initialization Script${NC}"
echo -e "${CYAN}=================================${NC}"
echo ""

# Función para ejecutar scripts SQL
execute_sql_script() {
    local script_path=$1
    local description=$2
    local use_database=${3:-true}
    
    echo -e "${YELLOW}Executing: $description${NC}"
    
    if [ "$USE_DOCKER" = true ]; then
        if [ "$use_database" = true ]; then
            cat "$script_path" | docker exec -i evidence-sqlserver /opt/mssql-tools18/bin/sqlcmd -S "$SERVER_NAME" -U "$USERNAME" -P "$PASSWORD" -d "$DATABASE_NAME" -C
        else
            cat "$script_path" | docker exec -i evidence-sqlserver /opt/mssql-tools18/bin/sqlcmd -S "$SERVER_NAME" -U "$USERNAME" -P "$PASSWORD" -C
        fi
    else
        if [ "$use_database" = true ]; then
            sqlcmd -S "$SERVER_NAME" -U "$USERNAME" -P "$PASSWORD" -d "$DATABASE_NAME" -i "$script_path"
        else
            sqlcmd -S "$SERVER_NAME" -U "$USERNAME" -P "$PASSWORD" -i "$script_path"
        fi
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Success: $description${NC}"
        echo ""
        return 0
    else
        echo -e "${RED}✗ Failed: $description${NC}"
        echo ""
        return 1
    fi
}

# Verificar si el contenedor Docker está corriendo
if [ "$USE_DOCKER" = true ]; then
    echo -e "${CYAN}Checking Docker container status...${NC}"
    container_status=$(docker ps --filter "name=evidence-sqlserver" --format "{{.Status}}")
    
    if [ -z "$container_status" ]; then
        echo -e "${RED}✗ Docker container 'evidence-sqlserver' is not running!${NC}"
        echo -e "${YELLOW}Please start it with: docker-compose up -d sqlserver${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✓ Docker container is running${NC}"
    echo ""
    
    # Esperar a que SQL Server esté listo
    echo -e "${CYAN}Waiting for SQL Server to be ready...${NC}"
    sleep 5
fi

# Obtener el directorio del script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Paso 1: Crear base de datos
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}STEP 1: Creating Database${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

create_db_query="IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = '$DATABASE_NAME') CREATE DATABASE $DATABASE_NAME;"

if [ "$USE_DOCKER" = true ]; then
    echo "$create_db_query" | docker exec -i evidence-sqlserver /opt/mssql-tools18/bin/sqlcmd -S "$SERVER_NAME" -U "$USERNAME" -P "$PASSWORD" -C
else
    sqlcmd -S "$SERVER_NAME" -U "$USERNAME" -P "$PASSWORD" -Q "$create_db_query"
fi

echo -e "${GREEN}✓ Database '$DATABASE_NAME' is ready${NC}"
echo ""

# Paso 2: Ejecutar scripts DDL
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}STEP 2: Executing DDL Scripts${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

execute_sql_script "$SCRIPT_DIR/01-DDL/01-create-tables.sql" "Creating tables"
execute_sql_script "$SCRIPT_DIR/01-DDL/02-create-indexes.sql" "Creating indexes"
execute_sql_script "$SCRIPT_DIR/01-DDL/03-create-triggers.sql" "Creating triggers"

# Paso 3: Ejecutar scripts DML
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}STEP 3: Executing DML Scripts (Seed Data)${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

execute_sql_script "$SCRIPT_DIR/02-DML/01-seed-roles.sql" "Seeding roles"
execute_sql_script "$SCRIPT_DIR/02-DML/02-seed-status.sql" "Seeding case file statuses"
execute_sql_script "$SCRIPT_DIR/02-DML/03-seed-evidence-types.sql" "Seeding evidence types"
execute_sql_script "$SCRIPT_DIR/02-DML/04-seed-admin-user.sql" "Creating admin user"

# Paso 4: Ejecutar Stored Procedures
echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}STEP 4: Creating Stored Procedures${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# Auth SPs
echo -e "${CYAN}Creating Auth stored procedures...${NC}"
for script in "$SCRIPT_DIR/03-StoredProcedures/auth"/*.sql; do
    [ -f "$script" ] && execute_sql_script "$script" "SP: $(basename $script)"
done

# CaseFiles SPs
echo -e "${CYAN}Creating CaseFiles stored procedures...${NC}"
for script in "$SCRIPT_DIR/03-StoredProcedures/caseFiles"/*.sql; do
    [ -f "$script" ] && execute_sql_script "$script" "SP: $(basename $script)"
done

# Evidence SPs
echo -e "${CYAN}Creating Evidence stored procedures...${NC}"
for script in "$SCRIPT_DIR/03-StoredProcedures/evidence"/*.sql; do
    [ -f "$script" ] && execute_sql_script "$script" "SP: $(basename $script)"
done

# Users SPs (si existen)
if [ -d "$SCRIPT_DIR/03-StoredProcedures/users" ]; then
    echo -e "${CYAN}Creating Users stored procedures...${NC}"
    for script in "$SCRIPT_DIR/03-StoredProcedures/users"/*.sql; do
        [ -f "$script" ] && execute_sql_script "$script" "SP: $(basename $script)"
    done
fi

# Reports SPs (si existen)
if [ -d "$SCRIPT_DIR/03-StoredProcedures/reports" ]; then
    echo -e "${CYAN}Creating Reports stored procedures...${NC}"
    for script in "$SCRIPT_DIR/03-StoredProcedures/reports"/*.sql; do
        [ -f "$script" ] && execute_sql_script "$script" "SP: $(basename $script)"
    done
fi

# Resumen final
echo ""
echo -e "${CYAN}========================================${NC}"
echo -e "${GREEN}Database Initialization Complete!${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "Database Name: ${DATABASE_NAME}"
echo -e "Server: ${SERVER_NAME}"
echo ""
echo -e "${YELLOW}Default Admin Credentials:${NC}"
echo -e "  Username: admin"
echo -e "  Email: admin@evidence.com"
echo -e "  Password: Admin@123"
echo ""
echo -e "${YELLOW}⚠ Remember to change the admin password after first login!${NC}"
echo ""
echo -e "${CYAN}Next steps:${NC}"
echo -e "  1. Start backend: cd backend && npm run dev"
echo -e "  2. Access API: http://localhost:3000/api/v1"
echo -e "  3. View docs: http://localhost:3000/api-docs"
echo ""
