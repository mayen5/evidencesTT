import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { UserRole } from '../types';

// Lazy load pages
const LoginPage = React.lazy(() => import('../pages/auth/LoginPage.tsx'));
const DashboardPage = React.lazy(() => import('../pages/dashboard/DashboardPage.tsx'));
const CaseFilesListPage = React.lazy(() => import('../pages/caseFiles/CaseFilesListPage.tsx'));
const CaseFileDetailPage = React.lazy(() => import('../pages/caseFiles/CaseFileDetailPage.tsx'));
const CaseFileFormPage = React.lazy(() => import('../pages/caseFiles/CaseFileFormPage.tsx'));
const EvidenceListPage = React.lazy(() => import('../pages/evidence/EvidenceListPage.tsx'));
const UsersListPage = React.lazy(() => import('../pages/users/UsersListPage.tsx'));
const UnauthorizedPage = React.lazy(() => import('../pages/auth/UnauthorizedPage.tsx'));

export const AppRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <React.Suspense
                fallback={
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        Cargando...
                    </div>
                }
            >
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />

                    {/* Protected Routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Navigate to="/dashboard" replace />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Case Files Routes */}
                    <Route
                        path="/case-files"
                        element={
                            <ProtectedRoute>
                                <CaseFilesListPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/case-files/new"
                        element={
                            <ProtectedRoute allowedRoles={[ UserRole.ADMIN, UserRole.TECHNICIAN ]}>
                                <CaseFileFormPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/case-files/:id"
                        element={
                            <ProtectedRoute>
                                <CaseFileDetailPage />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/case-files/:id/edit"
                        element={
                            <ProtectedRoute allowedRoles={[ UserRole.ADMIN, UserRole.TECHNICIAN ]}>
                                <CaseFileFormPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Evidence Routes */}
                    <Route
                        path="/evidence"
                        element={
                            <ProtectedRoute>
                                <EvidenceListPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Users Routes - Admin only */}
                    <Route
                        path="/users"
                        element={
                            <ProtectedRoute allowedRoles={[ UserRole.ADMIN ]}>
                                <UsersListPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* 404 - Not Found */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </React.Suspense>
        </BrowserRouter>
    );
};

export default AppRoutes;
