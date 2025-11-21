import React, { useState } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    CircularProgress,
    Alert,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material';
import { Add as AddIcon, PersonRemove as PersonRemoveIcon } from '@mui/icons-material';
import { useParticipants, useAddParticipant, useRemoveParticipant } from '../../hooks/useParticipants';
import type { AddParticipantDTO } from '../../types/participant.types';

interface ParticipantsTabProps {
    caseFileId: number;
}

const ParticipantsTab: React.FC<ParticipantsTabProps> = ({ caseFileId }) => {
    const [ open, setOpen ] = useState(false);
    const [ formData, setFormData ] = useState({
        userId: '',
        role: '',
    });

    const { data: participants, isLoading, error } = useParticipants(caseFileId);
    const addMutation = useAddParticipant();
    const removeMutation = useRemoveParticipant();

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setFormData({ userId: '', role: '' });
    };

    const handleSubmit = async () => {
        if (!formData.userId) return;

        const data: AddParticipantDTO = {
            userId: Number(formData.userId),
            role: formData.role || undefined,
        };

        await addMutation.mutateAsync({ caseFileId, data });
        handleClose();
    };

    const handleRemove = async (participantId: number) => {
        if (window.confirm('¿Está seguro de remover este participante?')) {
            await removeMutation.mutateAsync({ caseFileId, participantId });
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">Error al cargar los participantes</Alert>;
    }

    return (
        <Box>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                    sx={{
                        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                    }}
                >
                    Agregar Participante
                </Button>
            </Box>

            {participants && participants.length > 0 ? (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'rgba(30, 60, 114, 0.04)' }}>
                                <TableCell sx={{ fontWeight: 600 }}>Usuario</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Rol del Sistema</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Rol en Expediente</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Asignado</TableCell>
                                <TableCell sx={{ fontWeight: 600 }} align="center">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {participants.map((participant) => (
                                <TableRow key={participant.id} hover>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {participant.firstName && participant.lastName
                                                ? `${participant.firstName} ${participant.lastName}`
                                                : participant.username || 'N/A'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{participant.email || 'N/A'}</TableCell>
                                    <TableCell>{participant.roleName || 'N/A'}</TableCell>
                                    <TableCell>{participant.participantRole || '-'}</TableCell>
                                    <TableCell>
                                        {new Date(participant.assignedAt).toLocaleDateString('es-ES')}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Remover participante">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleRemove(participant.id)}
                                                disabled={removeMutation.isPending}
                                            >
                                                <PersonRemoveIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Alert severity="info">No hay participantes asignados a este expediente</Alert>
            )}

            {/* Add Participant Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Agregar Participante</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="ID de Usuario *"
                            type="number"
                            value={formData.userId}
                            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                            fullWidth
                            helperText="Ingrese el ID del usuario a agregar"
                        />

                        <TextField
                            select
                            label="Rol en Expediente (opcional)"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            fullWidth
                            helperText="Rol específico para este expediente"
                        >
                            <MenuItem value="">Sin rol específico</MenuItem>
                            <MenuItem value="Investigador">Investigador</MenuItem>
                            <MenuItem value="Colaborador">Colaborador</MenuItem>
                            <MenuItem value="Revisor">Revisor</MenuItem>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!formData.userId || addMutation.isPending}
                    >
                        {addMutation.isPending ? <CircularProgress size={24} /> : 'Agregar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ParticipantsTab;
