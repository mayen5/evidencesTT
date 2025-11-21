// Export all types
export type { ApiResponse, PaginatedResponse, ErrorResponse, BaseEntity } from './api.types';
export type { User, LoginRequest, RegisterRequest, AuthResponse, RefreshTokenRequest, RefreshTokenResponse, Role as AuthRole } from './auth.types';
export { UserRole } from './auth.types';
export type { CaseFile, CreateCaseFileDTO, UpdateCaseFileDTO, CaseFileFilters, Status, CaseFileStatusValue } from './caseFile.types';
export { CaseFileStatus } from './caseFile.types';
export type { TraceEvidence, AllTraceEvidence, PaginatedTraceEvidenceResponse, AddTraceEvidenceDTO, UpdateTraceEvidenceDTO } from './traceEvidence.types';
export type { Attachment } from './attachment.types';
export type { CaseFileHistory } from './history.types';
export type { CaseFileStatus as CaseFileStatusCatalog, EvidenceType as TraceEvidenceTypeCatalog, Role } from './catalog.types';
