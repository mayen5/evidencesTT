import React from 'react';
import { Box, Typography } from '@mui/material';
import { MainLayout } from '../../components/layout';

const UsersListPage: React.FC = () => {
    return (
        <MainLayout>
            <Box>
                <Typography variant="h4">Gestión de Usuarios</Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                    Administración de usuarios (Pendiente de implementación)
                </Typography>
            </Box>
        </MainLayout>
    );
};

export default UsersListPage;
