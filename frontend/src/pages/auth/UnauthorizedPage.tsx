import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            gap={2}
        >
            <Typography variant="h3">403 - No Autorizado</Typography>
            <Typography variant="body1">
                No tienes permisos para acceder a esta página
            </Typography>
            <Button variant="contained" onClick={() => navigate('/dashboard')}>
                Volver al Dashboard
            </Button>
        </Box>
    );
};

export default UnauthorizedPage;
