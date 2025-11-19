export enum UserRole {
    Admin = 1,
    Coordinador = 2,
    Tecnico = 3,
    Visualizador = 4,
}

export enum CaseFileStatus {
    Borrador = 1,
    EnRevision = 2,
    Aprobado = 3,
    Rechazado = 4,
}

export const UserRoleNames: Record<UserRole, string> = {
    [ UserRole.Admin ]: 'Admin',
    [ UserRole.Coordinador ]: 'Coordinador',
    [ UserRole.Tecnico ]: 'Tecnico',
    [ UserRole.Visualizador ]: 'Visualizador',
};

export const CaseFileStatusNames: Record<CaseFileStatus, string> = {
    [ CaseFileStatus.Borrador ]: 'Borrador',
    [ CaseFileStatus.EnRevision ]: 'En Revisión',
    [ CaseFileStatus.Aprobado ]: 'Aprobado',
    [ CaseFileStatus.Rechazado ]: 'Rechazado',
};
