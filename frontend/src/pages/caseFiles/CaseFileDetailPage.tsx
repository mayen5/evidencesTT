import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Button,
    Chip,
    Grid,
    CircularProgress,
    Tabs,
    Tab,
    Card,
    CardContent,
    Divider,
    Alert,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Send as SendIcon,
    Check as CheckIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import MainLayout from '../../components/layout/MainLayout.tsx';
import TraceEvidenceTab from '../../components/caseFile/TraceEvidenceTab.tsx';
import HistoryTab from '../../components/caseFile/HistoryTab.tsx';
import ParticipantsTab from '../../components/caseFile/ParticipantsTab.tsx';
import {
    useCaseFile,
    useDeleteCaseFile,
    useSubmitCaseFile,
    useApproveCaseFile,
    useRejectCaseFile,
} from '../../hooks/useCaseFiles';
import { useAuth } from '../../hooks/useAuth';
import { CaseFileStatus } from '../../types/caseFile.types';
import { UserRole } from '../../types/auth.types';
import dayjs from 'dayjs';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`casefile-tabpanel-${index}`}
            aria-labelledby={`casefile-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
        </div>
    );
}

const statusColors: Record<number, 'default' | 'primary' | 'success' | 'error'> = {
    [ CaseFileStatus.DRAFT ]: 'default',
    [ CaseFileStatus.UNDER_REVIEW ]: 'primary',
    [ CaseFileStatus.APPROVED ]: 'success',
    [ CaseFileStatus.REJECTED ]: 'error',
};

const statusLabels: Record<number, string> = {
    [ CaseFileStatus.DRAFT ]: 'Borrador',
    [ CaseFileStatus.UNDER_REVIEW ]: 'En Revisión',
    [ CaseFileStatus.APPROVED ]: 'Aprobado',
    [ CaseFileStatus.REJECTED ]: 'Rechazado',
};

const CaseFileDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [ currentTab, setCurrentTab ] = useState(0);

    // Hooks
    const { data: caseFile, isLoading, error } = useCaseFile(Number(id));
    const deleteMutation = useDeleteCaseFile();
    const submitMutation = useSubmitCaseFile();
    const approveMutation = useApproveCaseFile();
    const rejectMutation = useRejectCaseFile();

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    const handleEdit = () => {
        navigate(`/expedientes/${id}/editar`);
    };

    const handleDelete = async () => {
        if (window.confirm('¿Está seguro de eliminar este expediente?')) {
            await deleteMutation.mutateAsync(Number(id));
            navigate('/expedientes');
        }
    };

    const handleSubmit = async () => {
        if (window.confirm('¿Enviar este expediente a revisión?')) {
            await submitMutation.mutateAsync(Number(id));
        }
    };

    const handleApprove = async () => {
        if (window.confirm('¿Aprobar este expediente?') && user) {
            await approveMutation.mutateAsync({
                id: Number(id),
                approvedBy: user.id,
            });
        }
    };

    const handleReject = async () => {
        const reason = window.prompt('Indique la razón del rechazo:');
        if (reason && user) {
            await rejectMutation.mutateAsync({
                id: Number(id),
                rejectedBy: user.id,
                rejectionReason: reason,
            });
        }
    };

    const handleBack = () => {
        navigate('/expedientes');
    };

    if (isLoading) {
        return (
            <MainLayout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <CircularProgress />
                </Box>
            </MainLayout>
        );
    }

    if (error || !caseFile) {
        return (
            <MainLayout>
                <Box sx={{ p: 3 }}>
                    <Alert severity="error">Error al cargar el expediente</Alert>
                    <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }}>
                        Volver a expedientes
                    </Button>
                </Box>
            </MainLayout>
        );
    }

    const isDraft = caseFile.statusId === CaseFileStatus.DRAFT;
    const isUnderReview = caseFile.statusId === CaseFileStatus.UNDER_REVIEW;
    const isCoordinator = user?.roleId === UserRole.COORDINATOR;
    const isTechnician = user?.roleId === UserRole.TECHNICIAN;
    const isCreator = user?.id === caseFile.createdBy;

    return (
        <MainLayout>
            <Box sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} variant="outlined">
                            Volver
                        </Button>
                        <Typography variant="h4" sx={{ fontWeight: 600 }}>
                            Expediente: {caseFile.caseNumber}
                        </Typography>
                        <Chip
                            label={caseFile.statusName || statusLabels[ caseFile.statusId ]}
                            color={statusColors[ caseFile.statusId ]}
                            sx={{ fontWeight: 600 }}
                        />
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {isDraft && isCreator && (
                            <>
                                <Button startIcon={<EditIcon />} onClick={handleEdit} variant="outlined">
                                    Editar
                                </Button>
                                <Button
                                    startIcon={<SendIcon />}
                                    onClick={handleSubmit}
                                    variant="contained"
                                    disabled={submitMutation.isPending}
                                    sx={{
                                        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                                    }}
                                >
                                    Enviar a Revisión
                                </Button>
                                <Button
                                    startIcon={<DeleteIcon />}
                                    onClick={handleDelete}
                                    color="error"
                                    disabled={deleteMutation.isPending}
                                >
                                    Eliminar
                                </Button>
                            </>
                        )}

                        {isUnderReview && isCoordinator && (
                            <>
                                <Button
                                    startIcon={<CheckIcon />}
                                    onClick={handleApprove}
                                    variant="contained"
                                    color="success"
                                    disabled={approveMutation.isPending}
                                >
                                    Aprobar
                                </Button>
                                <Button
                                    startIcon={<CloseIcon />}
                                    onClick={handleReject}
                                    variant="contained"
                                    color="error"
                                    disabled={rejectMutation.isPending}
                                >
                                    Rechazar
                                </Button>
                            </>
                        )}
                    </Box>
                </Box>

                {/* Tabs */}
                <Paper
                    elevation={3}
                    sx={{
                        background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
                    }}
                >
                    <Tabs
                        value={currentTab}
                        onChange={handleTabChange}
                        sx={{
                            borderBottom: 1,
                            borderColor: 'divider',
                            px: 2,
                        }}
                    >
                        <Tab label="Información General" />
                        <Tab label={`Indicios (${caseFile.evidenceCount || 0})`} />
                        <Tab label="Historial" />
                        <Tab label="Participantes" />
                        <Tab label="Adjuntos" />
                    </Tabs>

                    {/* Tab Panel 0: General Information */}
                    <TabPanel value={currentTab} index={0}>
                        <Box sx={{ px: 3 }}>
                            <Grid container spacing={3}>
                                {/* Main Information */}
                                <Grid item xs={12} md={8}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                                Información Principal
                                            </Typography>
                                            <Divider sx={{ mb: 2 }} />

                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle2" color="textSecondary">
                                                        Número de Caso
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                        {caseFile.caseNumber}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle2" color="textSecondary">
                                                        Título
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                                        {caseFile.title}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle2" color="textSecondary">
                                                        Descripción
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {caseFile.description}
                                                    </Typography>
                                                </Grid>

                                                {caseFile.location && (
                                                    <Grid item xs={12}>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Ubicación
                                                        </Typography>
                                                        <Typography variant="body1">
                                                            {caseFile.location}
                                                        </Typography>
                                                    </Grid>
                                                )}

                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle2" color="textSecondary">
                                                        Fecha del Incidente
                                                    </Typography>
                                                    <Typography variant="body1">
                                                        {dayjs(caseFile.incidentDate).format('DD/MM/YYYY')}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Metadata */}
                                <Grid item xs={12} md={4}>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                                Metadatos
                                            </Typography>
                                            <Divider sx={{ mb: 2 }} />

                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle2" color="textSecondary">
                                                        Estado
                                                    </Typography>
                                                    <Chip
                                                        label={caseFile.statusName || statusLabels[ caseFile.statusId ]}
                                                        color={statusColors[ caseFile.statusId ]}
                                                        size="small"
                                                        sx={{ mt: 0.5 }}
                                                    />
                                                </Grid>

                                                {caseFile.createdByName && (
                                                    <Grid item xs={12}>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Creado por
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {caseFile.createdByName}
                                                        </Typography>
                                                    </Grid>
                                                )}

                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle2" color="textSecondary">
                                                        Fecha de creación
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {dayjs(caseFile.createdAt).format('DD/MM/YYYY HH:mm')}
                                                    </Typography>
                                                </Grid>

                                                {caseFile.updatedAt && (
                                                    <Grid item xs={12}>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Última actualización
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {dayjs(caseFile.updatedAt).format('DD/MM/YYYY HH:mm')}
                                                        </Typography>
                                                    </Grid>
                                                )}

                                                {caseFile.approvedAt && (
                                                    <Grid item xs={12}>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Fecha de aprobación
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {dayjs(caseFile.approvedAt).format('DD/MM/YYYY HH:mm')}
                                                        </Typography>
                                                    </Grid>
                                                )}

                                                {caseFile.reviewedAt && (
                                                    <Grid item xs={12}>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Fecha de revisión
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {dayjs(caseFile.reviewedAt).format('DD/MM/YYYY HH:mm')}
                                                        </Typography>
                                                    </Grid>
                                                )}

                                                {caseFile.reviewedByName && (
                                                    <Grid item xs={12}>
                                                        <Typography variant="subtitle2" color="textSecondary">
                                                            Revisado por
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {caseFile.reviewedByName}
                                                        </Typography>
                                                    </Grid>
                                                )}

                                                {caseFile.rejectionReason && (
                                                    <Grid item xs={12}>
                                                        <Typography variant="subtitle2" color="error">
                                                            Motivo de rechazo
                                                        </Typography>
                                                        <Typography variant="body2" color="error">
                                                            {caseFile.rejectionReason}
                                                        </Typography>
                                                    </Grid>
                                                )}

                                                <Grid item xs={12}>
                                                    <Typography variant="subtitle2" color="textSecondary">
                                                        Indicios
                                                    </Typography>
                                                    <Typography variant="body2">
                                                        {caseFile.evidenceCount || 0} registrado(s)
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Box>
                    </TabPanel>

                    {/* Tab Panel 1: Evidence */}
                    <TabPanel value={currentTab} index={1}>
                        <Box sx={{ px: 3 }}>
                            <TraceEvidenceTab caseFileId={Number(id)} />
                        </Box>
                    </TabPanel>

                    {/* Tab Panel 2: History */}
                    <TabPanel value={currentTab} index={2}>
                        <Box sx={{ px: 3 }}>
                            <HistoryTab caseFileId={Number(id)} />
                        </Box>
                    </TabPanel>

                    {/* Tab Panel 3: Participants */}
                    <TabPanel value={currentTab} index={3}>
                        <Box sx={{ px: 3 }}>
                            <ParticipantsTab caseFileId={Number(id)} />
                        </Box>
                    </TabPanel>

                    {/* Tab Panel 4: Attachments */}
                    <TabPanel value={currentTab} index={4}>
                        <Box sx={{ px: 3 }}>
                            <Alert severity="info">
                                La gestión de archivos adjuntos estará disponible próximamente
                            </Alert>
                        </Box>
                    </TabPanel>
                </Paper>
            </Box>
        </MainLayout>
    );
};

export default CaseFileDetailPage;
