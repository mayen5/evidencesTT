import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Divider,
    alpha,
} from '@mui/material';
import {
    Lock as LockIcon,
    Person as PersonIcon,
    Gavel as GavelIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Email inválido')
        .required('El email es requerido'),
    password: Yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('La contraseña es requerida'),
});

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated, isLoading, user } = useAuth();

    // Redirect if already authenticated
    useEffect(() => {
        console.log('useEffect triggered:', { isAuthenticated, isLoading, user });
        if (isAuthenticated && !isLoading) {
            console.log('Redirecting to dashboard via useEffect');
            navigate('/dashboard', { replace: true });
        }
    }, [ isAuthenticated, isLoading, user, navigate ]);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                console.log('Starting login...');
                await login(values);
                console.log('Login successful, navigating directly...');
                // Direct navigation after successful login
                window.location.href = '/dashboard';
            } catch (error) {
                // Error is handled by AuthContext (toast)
                console.error('Login error:', error);
            }
        },
    });

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                sx={{
                    background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                }}
            >
                <CircularProgress sx={{ color: 'white' }} />
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                position: 'relative',
                overflow: 'hidden',
                p: 0,
                m: 0,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                },
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                    maxWidth: 550,
                    px: 3,
                }}
            >
                <Paper
                    elevation={24}
                    sx={{
                        p: { xs: 4, sm: 6 },
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.98)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <Box sx={{ textAlign: 'center', mb: 5 }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 100,
                                height: 100,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                                mb: 3,
                                boxShadow: '0 12px 32px rgba(30, 60, 114, 0.4)',
                            }}
                        >
                            <GavelIcon sx={{ fontSize: 50, color: 'white' }} />
                        </Box>
                        <Typography
                            component="h1"
                            variant="h3"
                            sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}
                        >
                            Sistema de Gestión
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: 400, mb: 3, color: 'text.secondary' }}
                        >
                            de Evidencias
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Ingresa tus credenciales para continuar
                        </Typography>
                    </Box>

                    <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Correo Electrónico"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            InputProps={{
                                sx: { borderRadius: 2, fontSize: '1.1rem', py: 1 },
                            }}
                            InputLabelProps={{
                                sx: { fontSize: '1.1rem' },
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            InputProps={{
                                sx: { borderRadius: 2, fontSize: '1.1rem', py: 1 },
                            }}
                            InputLabelProps={{
                                sx: { fontSize: '1.1rem' },
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={formik.isSubmitting}
                            sx={{
                                mt: 4,
                                mb: 2,
                                py: 2,
                                borderRadius: 2,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                textTransform: 'none',
                                background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #1a3460 0%, #245085 100%)',
                                    boxShadow: '0 8px 16px rgba(30, 60, 114, 0.3)',
                                },
                            }}
                        >
                            {formik.isSubmitting ? (
                                <CircularProgress size={28} color="inherit" />
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </Button>

                        <Divider sx={{ my: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                                Credenciales de Prueba
                            </Typography>
                        </Divider>

                        <Box
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                                border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                <PersonIcon sx={{ fontSize: 20, mr: 1.5, color: 'primary.main' }} />
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    admin@evidence.com
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <LockIcon sx={{ fontSize: 20, mr: 1.5, color: 'primary.main' }} />
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    Admin@123
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default LoginPage;
