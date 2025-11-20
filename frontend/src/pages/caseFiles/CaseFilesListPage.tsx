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
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Expedientes
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/case-files/new')}
                    >
                        Nuevo Expediente
                    </Button>
                </Box>

                <Paper sx={{ p: 3, mb: 3 }}>
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <TextField
                            label="Buscar"
                            variant="outlined"
                            size="small"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            sx={{ flexGrow: 1, minWidth: 200 }}
                            placeholder="Número de caso, acusado, víctima..."
                        />
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                            <InputLabel>Estado</InputLabel>
                            <Select
                                value={filters.statusId ?? ''}
                                onChange={(e) => handleStatusFilter(e.target.value as number | '')}
                                label="Estado"
                            >
                                <MenuItem value="">Todos</MenuItem>
                                <MenuItem value={CaseFileStatus.DRAFT}>Borrador</MenuItem>
                                <MenuItem value={CaseFileStatus.UNDER_REVIEW}>En Revisión</MenuItem>
                                <MenuItem value={CaseFileStatus.APPROVED}>Aprobado</MenuItem>
                                <MenuItem value={CaseFileStatus.REJECTED}>Rechazado</MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch}>
                            Buscar
                        </Button>
                    </Box>
                </Paper>

                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Número de Caso</TableCell>
                                    <TableCell>Delito</TableCell>
                                    <TableCell>Acusado</TableCell>
                                    <TableCell>Víctima</TableCell>
                                    <TableCell>Fiscal</TableCell>
                                    <TableCell>Fecha del Incidente</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell align="right">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                ) : error ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                                            <Typography color="error">Error al cargar los expedientes</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : data?.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                                            <Typography color="textSecondary">No se encontraron expedientes</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data?.data.map((caseFile) => (
                                        <TableRow key={caseFile.id} hover>
                                            <TableCell>{caseFile.caseNumber}</TableCell>
                                            <TableCell>{caseFile.crime}</TableCell>
                                            <TableCell>{caseFile.accused}</TableCell>
                                            <TableCell>{caseFile.victim}</TableCell>
                                            <TableCell>{caseFile.prosecutor}</TableCell>
                                            <TableCell>
                                                {dayjs(caseFile.incidentDate).format('DD/MM/YYYY')}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={statusLabels[ caseFile.statusId ]}
                                                    color={statusColors[ caseFile.statusId ]}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Tooltip title="Ver detalles">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => navigate(`/case-files/${caseFile.id}`)}
                                                    >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Editar">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => navigate(`/case-files/${caseFile.id}/edit`)}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title="Eliminar">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleDelete(caseFile.id)}
                                                        disabled={deleteMutation.isPending}
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
