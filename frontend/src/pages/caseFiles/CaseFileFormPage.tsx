import React from 'react';
import { Box, Typography } from '@mui/material';
import { MainLayout } from '../../components/layout';

const CaseFileFormPage: React.FC = () => {
    return (
        <MainLayout>
            <Box>
                <Typography variant="h4">Crear/Editar Expediente</Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                    Formulario de expediente (Pendiente de implementación)
                </Typography>
            </Box>
        </MainLayout>
    );
};

export default CaseFileFormPage;
