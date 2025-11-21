import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    IconButton,
    Tooltip,
    CircularProgress,
} from '@mui/material';
import {
    Add as AddIcon,
    Visibility as VisibilityIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import { MainLayout } from '../../components/layout';
import { useCaseFiles, useDeleteCaseFile } from '../../hooks/useCaseFiles';
import type { CaseFileFilters } from '../../types/caseFile.types';
import { CaseFileStatus } from '../../types/caseFile.types';
import dayjs from 'dayjs';

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

const CaseFilesListPage: React.FC = () => {
    const navigate = useNavigate();
    const [ page, setPage ] = useState(0);
    const [ rowsPerPage, setRowsPerPage ] = useState(10);
    const [ filters, setFilters ] = useState<CaseFileFilters>({});
    const [ searchTerm, setSearchTerm ] = useState('');

    const { data, isLoading, error } = useCaseFiles(page + 1, rowsPerPage, filters);
    const deleteMutation = useDeleteCaseFile();

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearch = () => {
        setFilters({ ...filters, search: searchTerm || undefined });
        setPage(0);
    };

    const handleStatusFilter = (statusId: number | '') => {
        setFilters({ ...filters, statusId: statusId === '' ? undefined : statusId });
        setPage(0);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este expediente?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <MainLayout>
            <Box sx={{ width: '100%', height: '100%' }}>
                {/* Header con gradiente */}
                <Box
                    sx={{
                        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                        borderRadius: 3,
                        p: 4,
                        mb: 3,
                        boxShadow: '0 8px 32px rgba(30, 60, 114, 0.2)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Box>
                        <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                            📂 Expedientes
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                            Gestión de casos y expedientes judiciales
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/case-files/new')}
                        sx={{
                            backgroundColor: 'white',
                            color: 'primary.main',
                            fontWeight: 600,
                            px: 3,
                            py: 1.5,
                            borderRadius: 2,
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                            },
                            transition: 'all 0.3s ease',
                        }}
                    >
                        Nuevo Expediente
                    </Button>
                </Box>

                {/* Filtros con diseño mejorado */}
                <Paper
                    sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                        <TextField
                            label="Buscar"
                            variant="outlined"
                            size="medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            sx={{
                                flexGrow: 1,
                                minWidth: 300,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover fieldset': {
                                        borderColor: 'primary.main',
                                    },
                                },
                            }}
                            placeholder="Número de caso, acusado, víctima..."
                        />
                        <FormControl size="medium" sx={{ minWidth: 180 }}>
                            <InputLabel>Estado</InputLabel>
                            <Select
                                value={filters.statusId ?? ''}
                                onChange={(e) => handleStatusFilter(e.target.value as number | '')}
                                label="Estado"
                                sx={{
                                    borderRadius: 2,
                                }}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                <MenuItem value={CaseFileStatus.DRAFT}>Borrador</MenuItem>
                                <MenuItem value={CaseFileStatus.UNDER_REVIEW}>En Revisión</MenuItem>
                                <MenuItem value={CaseFileStatus.APPROVED}>Aprobado</MenuItem>
                                <MenuItem value={CaseFileStatus.REJECTED}>Rechazado</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            startIcon={<SearchIcon />}
                            onClick={handleSearch}
                            sx={{
                                px: 3,
                                py: 1.5,
                                borderRadius: 2,
                                fontWeight: 600,
                                boxShadow: '0 4px 12px rgba(30, 60, 114, 0.25)',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 16px rgba(30, 60, 114, 0.3)',
                                },
                                transition: 'all 0.3s ease',
                            }}
                        >
                            Buscar
                        </Button>
                    </Box>
                </Paper>

                {/* Tabla con diseño mejorado */}
                <Paper
                    sx={{
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        overflow: 'hidden',
                    }}
                >
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow
                                    sx={{
                                        backgroundColor: 'rgba(30, 60, 114, 0.04)',
                                        '& th': {
                                            fontWeight: 700,
                                            color: 'primary.main',
                                            borderBottom: '2px solid',
                                            borderColor: 'primary.main',
                                            py: 2,
                                        },
                                    }}
                                >
                                    <TableCell>Número de Caso</TableCell>
                                    <TableCell>Título</TableCell>
                                    <TableCell>Ubicación</TableCell>
                                    <TableCell>Creado Por</TableCell>
                                    <TableCell>Fecha del Incidente</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell align="right">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                ) : error ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                            <Typography color="error">Error al cargar los expedientes</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : data?.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                            <Typography color="textSecondary">No se encontraron expedientes</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data?.data.map((caseFile) => (
                                        <TableRow
                                            key={caseFile.caseFileId}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: 'rgba(30, 60, 114, 0.04)',
                                                    transform: 'scale(1.001)',
                                                    transition: 'all 0.2s ease-in-out',
                                                },
                                                transition: 'all 0.2s ease-in-out',
                                            }}
                                        >
                                            <TableCell>{caseFile.caseNumber}</TableCell>
                                            <TableCell>{caseFile.title}</TableCell>
                                            <TableCell>{caseFile.location || 'N/A'}</TableCell>
                                            <TableCell>{caseFile.createdByName || 'N/A'}</TableCell>
                                            <TableCell>
                                                {dayjs(caseFile.incidentDate).format('DD/MM/YYYY')}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={caseFile.statusName || statusLabels[ caseFile.statusId ]}
                                                    color={statusColors[ caseFile.statusId ]}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Ver detalles" arrow>
                                                    <IconButton
                                                        size="small"
                                                        sx={{
                                                            color: 'primary.main',
                                                            '&:hover': {
                                                                backgroundColor: 'primary.light',
                                                                transform: 'scale(1.1)',
                                                            },
                                                            transition: 'all 0.2s',
                                                        }}
                                                        onClick={() => navigate(`/expedientes/${caseFile.caseFileId}`)}
                                                    >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Editar" arrow>
                                                    <IconButton
                                                        size="small"
                                                        sx={{
                                                            color: 'info.main',
                                                            '&:hover': {
                                                                backgroundColor: 'info.light',
                                                                transform: 'scale(1.1)',
                                                            },
                                                            transition: 'all 0.2s',
                                                        }}
                                                        onClick={() => navigate(`/expedientes/${caseFile.caseFileId}/editar`)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Eliminar" arrow>
                                                    <IconButton
                                                        size="small"
                                                        disabled={deleteMutation.isPending}
                                                        sx={{
                                                            color: 'error.main',
                                                            '&:hover': {
                                                                backgroundColor: 'error.light',
                                                                transform: 'scale(1.1)',
                                                            },
                                                            '&:disabled': {
                                                                color: 'action.disabled',
                                                            },
                                                            transition: 'all 0.2s',
                                                        }}
                                                        onClick={() => handleDelete(caseFile.caseFileId)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={data?.pagination.total ?? 0}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[ 5, 10, 25, 50 ]}
                        labelRowsPerPage="Filas por página:"
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                    />
                </Paper>
            </Box>
        </MainLayout>
    );
};

export default CaseFilesListPage;
