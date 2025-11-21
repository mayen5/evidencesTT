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
    Chip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTraceEvidence, useAddTraceEvidence } from '../../hooks/useTraceEvidence';
import { useEvidenceTypes } from '../../hooks/useCatalogs';
import { useAuth } from '../../hooks/useAuth';
import type { AddTraceEvidenceDTO } from '../../types/traceEvidence.types';
import dayjs from 'dayjs';

interface TraceEvidenceTabProps {
    caseFileId: number;
}

const TraceEvidenceTab: React.FC<TraceEvidenceTabProps> = ({ caseFileId }) => {
    const { user } = useAuth();
    const [ open, setOpen ] = useState(false);
    const [ formData, setFormData ] = useState({
        evidenceTypeId: '',
        description: '',
        color: '',
        size: '',
        weight: '',
        location: '',
        collectionDate: dayjs().format('YYYY-MM-DD'),
    });

    const { data: evidences, isLoading, error } = useTraceEvidence(caseFileId);
    const { data: evidenceTypes } = useEvidenceTypes();
    const addMutation = useAddTraceEvidence();

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setFormData({
            evidenceTypeId: '',
            description: '',
            color: '',
            size: '',
            weight: '',
            location: '',
            collectionDate: dayjs().format('YYYY-MM-DD'),
        });
    };

    const handleSubmit = async () => {
        if (!user || !formData.evidenceTypeId || !formData.description) return;

        // Generate evidence number based on case file and timestamp
        const timestamp = Date.now().toString(36).toUpperCase();
        const evidenceNumber = `EVD-${caseFileId}-${timestamp}`;

        const data: AddTraceEvidenceDTO = {
            caseFileId,
            evidenceNumber,
            traceEvidenceTypeId: Number(formData.evidenceTypeId),
            description: formData.description,
            color: formData.color || undefined,
            size: formData.size || undefined,
            weight: formData.weight ? Number(formData.weight) : undefined,
            location: formData.location || undefined,
            collectedBy: user.id,
            collectedAt: new Date(formData.collectionDate).toISOString(),
        };

        await addMutation.mutateAsync(data);
        handleClose();
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">Error al cargar los indicios</Alert>;
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
                    Agregar Indicio
                </Button>
            </Box>

            {evidences && evidences.length > 0 ? (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'rgba(30, 60, 114, 0.04)' }}>
                                <TableCell sx={{ fontWeight: 600 }}>Tipo</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Descripción</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Color</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Tamaño</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Peso (kg)</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Ubicación</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Recolectado por</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {evidences.map((evidence) => (
                                <TableRow key={evidence.traceEvidenceId} hover>
                                    <TableCell>
                                        <Chip
                                            label={evidence.traceEvidenceTypeName || 'N/A'}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>{evidence.description}</TableCell>
                                    <TableCell>{evidence.color || '-'}</TableCell>
                                    <TableCell>{evidence.size || '-'}</TableCell>
                                    <TableCell>{evidence.weight ? `${evidence.weight} kg` : '-'}</TableCell>
                                    <TableCell>{evidence.location || '-'}</TableCell>
                                    <TableCell>{evidence.collectedByName || 'N/A'}</TableCell>
                                    <TableCell>
                                        {dayjs(evidence.collectedAt).format('DD/MM/YYYY')}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Alert severity="info">No hay indicios registrados para este expediente</Alert>
            )}

            {/* Add Evidence Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>Agregar Indicio</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            select
                            label="Tipo de Indicio *"
                            value={formData.evidenceTypeId}
                            onChange={(e) => setFormData({ ...formData, evidenceTypeId: e.target.value })}
                            fullWidth
                        >
                            {evidenceTypes?.map((type) => (
                                <MenuItem key={type.id} value={type.id}>
                                    {type.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            label="Descripción *"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            multiline
                            rows={3}
                            fullWidth
                        />

                        <TextField
                            label="Color (opcional)"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            fullWidth
                            placeholder="Ej: Negro, Plateado, Rojo"
                        />

                        <TextField
                            label="Tamaño (opcional)"
                            value={formData.size}
                            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                            fullWidth
                            placeholder="Ej: 15cm x 10cm, Grande, Mediano"
                        />

                        <TextField
                            label="Peso en kg (opcional)"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            fullWidth
                            type="number"
                            inputProps={{ step: "0.01", min: "0" }}
                            placeholder="Ej: 1.5"
                        />

                        <TextField
                            label="Ubicación (opcional)"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            fullWidth
                            placeholder="Ej: Sala principal, Vehículo"
                        />

                        <TextField
                            label="Fecha de Recolección *"
                            type="date"
                            value={formData.collectionDate}
                            onChange={(e) => setFormData({ ...formData, collectionDate: e.target.value })}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={
                            !formData.evidenceTypeId ||
                            !formData.description ||
                            addMutation.isPending
                        }
                    >
                        {addMutation.isPending ? <CircularProgress size={24} /> : 'Agregar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default TraceEvidenceTab;
