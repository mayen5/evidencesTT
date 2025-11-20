import React from 'react';
import { Box, Typography } from '@mui/material';
import { MainLayout } from '../../components/layout';

const CaseFileDetailPage: React.FC = () => {
    return (
        <MainLayout>
            <Box>
                <Typography variant="h4">Detalle del Expediente</Typography>
                <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                    Información detallada del expediente (Pendiente de implementación)
                </Typography>
            </Box>
        </MainLayout>
    );
};

export default CaseFileDetailPage;
