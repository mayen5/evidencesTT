#!/bin/bash

# Esperar a que SQL Server esté completamente iniciado
echo "Waiting for SQL Server to start..."
sleep 30s

# Ejecutar scripts de inicialización
echo "Starting database initialization..."

# Crear base de datos
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P ${SA_PASSWORD} -C -Q "IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'EvidenceManagementDB') CREATE DATABASE EvidenceManagementDB;"

echo "Database created. Running DDL scripts..."

# Ejecutar DDL
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P ${SA_PASSWORD} -d EvidenceManagementDB -C -i /docker-entrypoint-initdb.d/01-DDL/01-create-tables.sql
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P ${SA_PASSWORD} -d EvidenceManagementDB -C -i /docker-entrypoint-initdb.d/01-DDL/02-create-indexes.sql
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P ${SA_PASSWORD} -d EvidenceManagementDB -C -i /docker-entrypoint-initdb.d/01-DDL/03-create-triggers.sql

echo "DDL complete. Running DML scripts..."

# Ejecutar DML
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P ${SA_PASSWORD} -d EvidenceManagementDB -C -i /docker-entrypoint-initdb.d/02-DML/01-seed-roles.sql
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P ${SA_PASSWORD} -d EvidenceManagementDB -C -i /docker-entrypoint-initdb.d/02-DML/02-seed-status.sql
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P ${SA_PASSWORD} -d EvidenceManagementDB -C -i /docker-entrypoint-initdb.d/02-DML/03-seed-evidence-types.sql
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P ${SA_PASSWORD} -d EvidenceManagementDB -C -i /docker-entrypoint-initdb.d/02-DML/04-seed-admin-user.sql

echo "DML complete. Creating stored procedures..."

# Ejecutar Stored Procedures - Auth
for file in /docker-entrypoint-initdb.d/03-StoredProcedures/auth/*.sql; do
    echo "Executing: $file"
    /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P ${SA_PASSWORD} -d EvidenceManagementDB -C -i "$file"
done

# Ejecutar Stored Procedures - CaseFiles
for file in /docker-entrypoint-initdb.d/03-StoredProcedures/caseFiles/*.sql; do
    echo "Executing: $file"
    /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P ${SA_PASSWORD} -d EvidenceManagementDB -C -i "$file"
done

# Ejecutar Stored Procedures - Evidence
for file in /docker-entrypoint-initdb.d/03-StoredProcedures/evidence/*.sql; do
    echo "Executing: $file"
    /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P ${SA_PASSWORD} -d EvidenceManagementDB -C -i "$file"
done

# Ejecutar Stored Procedures - Users (si existen)
if [ -d "/docker-entrypoint-initdb.d/03-StoredProcedures/users" ]; then
    for file in /docker-entrypoint-initdb.d/03-StoredProcedures/users/*.sql; do
        echo "Executing: $file"
        /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P ${SA_PASSWORD} -d EvidenceManagementDB -C -i "$file"
    done
fi

# Ejecutar Stored Procedures - Reports (si existen)
if [ -d "/docker-entrypoint-initdb.d/03-StoredProcedures/reports" ]; then
    for file in /docker-entrypoint-initdb.d/03-StoredProcedures/reports/*.sql; do
        echo "Executing: $file"
        /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P ${SA_PASSWORD} -d EvidenceManagementDB -C -i "$file"
    done
fi

echo "Database initialization completed successfully!"
echo "Admin credentials: admin@evidence.com / Admin@123"
