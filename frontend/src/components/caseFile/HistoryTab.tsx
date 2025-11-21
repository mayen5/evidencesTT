import React from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    CircularProgress,
    Alert,
    Chip,
    Typography,
} from '@mui/material';
import { useCaseFileHistory } from '../../hooks/useHistory';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/es';

dayjs.extend(relativeTime);
dayjs.locale('es');

interface HistoryTabProps {
    caseFileId: number;
}

const changeTypeLabels: Record<string, string> = {
    'STATUS_CHANGE': 'Cambio de Estado',
    'FIELD_UPDATE': 'Actualización de Campo',
    'EVIDENCE_ADDED': 'Indicio Agregado',
    'PARTICIPANT_ADDED': 'Participante Agregado',
    'PARTICIPANT_REMOVED': 'Participante Removido',
    'ATTACHMENT_ADDED': 'Archivo Adjunto',
    'ATTACHMENT_DELETED': 'Archivo Eliminado',
    'CREATED': 'Creación',
    'SUBMITTED': 'Enviado a Revisión',
    'APPROVED': 'Aprobado',
    'REJECTED': 'Rechazado',
};

const changeTypeColors: Record<string, 'default' | 'primary' | 'success' | 'error' | 'warning' | 'info'> = {
    'CREATED': 'success',
    'STATUS_CHANGE': 'primary',
    'SUBMITTED': 'info',
    'APPROVED': 'success',
    'REJECTED': 'error',
    'FIELD_UPDATE': 'warning',
    'EVIDENCE_ADDED': 'info',
    'PARTICIPANT_ADDED': 'success',
    'PARTICIPANT_REMOVED': 'error',
    'ATTACHMENT_ADDED': 'info',
    'ATTACHMENT_DELETED': 'error',
};

const HistoryTab: React.FC<HistoryTabProps> = ({ caseFileId }) => {
    const { data: history, isLoading, error } = useCaseFileHistory(caseFileId);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">Error al cargar el historial</Alert>;
    }

    if (!history || history.length === 0) {
        return <Alert severity="info">No hay historial disponible para este expediente</Alert>;
    }

    return (
        <Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'rgba(30, 60, 114, 0.04)' }}>
                            <TableCell sx={{ fontWeight: 600 }}>Tipo de Cambio</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Usuario</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Detalles</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Comentarios</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Fecha</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {history.map((item) => (
                            <TableRow key={item.id} hover>
                                <TableCell>
                                    <Chip
                                        label={changeTypeLabels[ item.changeType ] || item.changeType}
                                        size="small"
                                        color={changeTypeColors[ item.changeType ] || 'default'}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {item.changedByFirstName && item.changedByLastName
                                            ? `${item.changedByFirstName} ${item.changedByLastName}`
                                            : item.changedByUsername || 'N/A'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {item.oldValue && item.newValue ? (
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                De: <s>{item.oldValue}</s>
                                            </Typography>
                                            <br />
                                            <Typography variant="caption" color="success.main">
                                                A: <strong>{item.newValue}</strong>
                                            </Typography>
                                        </Box>
                                    ) : item.newValue ? (
                                        <Typography variant="body2">{item.newValue}</Typography>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            -
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.comments || '-'}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">
                                        {dayjs(item.changedAt).format('DD/MM/YYYY HH:mm')}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {dayjs(item.changedAt).fromNow()}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default HistoryTab;
