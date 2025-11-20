import React from 'react';
import {
    Box,
    Typography,
    Paper,
    Card,
    CardContent,
    CircularProgress,
} from '@mui/material';
import {
    FolderOpen as FolderOpenIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    HourglassEmpty as HourglassEmptyIcon,
} from '@mui/icons-material';
import { MainLayout } from '../../components/layout';
import { useCaseFileStatistics } from '../../hooks/useCaseFiles';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactElement;
    color: string;
    isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, isLoading }) => {
    const iconWithProps = React.cloneElement(icon as React.ReactElement<any>, {
        sx: { color: 'white', fontSize: 32 }
    });

    return (
        <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography color="textSecondary" variant="caption" gutterBottom>
                            {title}
                        </Typography>
                        {isLoading ? (
                            <CircularProgress size={24} />
                        ) : (
                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                {value}
                            </Typography>
                        )}
                    </Box>
                    <Box
                        sx={{
                            backgroundColor: color,
                            borderRadius: '50%',
                            width: 56,
                            height: 56,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {iconWithProps}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

const DashboardPage: React.FC = () => {
    const { data: stats, isLoading } = useCaseFileStatistics();

    return (
        <MainLayout>
            <Box>
                <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
                    Dashboard
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: '200px' }}>
                            <StatCard
                                title="Total de Expedientes"
                                value={stats?.total ?? 0}
                                icon={<FolderOpenIcon />}
                                color="#1976d2"
                                isLoading={isLoading}
                            />
                        </Box>

                        <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: '200px' }}>
                            <StatCard
                                title="Aprobados"
                                value={stats?.approved ?? 0}
                                icon={<CheckCircleIcon />}
                                color="#2e7d32"
                                isLoading={isLoading}
                            />
                        </Box>

                        <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: '200px' }}>
                            <StatCard
                                title="Rechazados"
                                value={stats?.rejected ?? 0}
                                icon={<CancelIcon />}
                                color="#d32f2f"
                                isLoading={isLoading}
                            />
                        </Box>

                        <Box sx={{ flex: '1 1 calc(25% - 18px)', minWidth: '200px' }}>
                            <StatCard
                                title="Pendientes"
                                value={stats?.pending ?? 0}
                                icon={<HourglassEmptyIcon />}
                                color="#ed6c02"
                                isLoading={isLoading}
                            />
                        </Box>
                    </Box>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Actividad Reciente
                        </Typography>
                        <Typography color="textSecondary">
                            No hay actividad reciente para mostrar.
                        </Typography>
                    </Paper>
                </Box>
            </Box>
        </MainLayout>
    );
};

export default DashboardPage;
