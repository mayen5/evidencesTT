import React from 'react';
import { Box, Typography } from '@mui/material';
import { MainLayout } from '../../components/layout';

const CaseFilesListPage: React.FC = () => {
    return (
        <MainLayout>
            <Box>
                <Typography variant="h4">Expedientes</Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                    Lista de expedientes (Pendiente de implementación)
                </Typography>
            </Box>
        </MainLayout>
    );
};

export default CaseFilesListPage;
