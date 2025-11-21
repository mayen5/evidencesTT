import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    IconButton,
    Tooltip,
    CircularProgress,
    Alert,
    Button,
} from '@mui/material';
import {
    Search as SearchIcon,
    Visibility as VisibilityIcon,
    Clear as ClearIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { useAllTraceEvidence } from '../../hooks/useTraceEvidence';
import dayjs from 'dayjs';

const TraceEvidenceListPage: React.FC = () => {
    const navigate = useNavigate();
    const [ page, setPage ] = useState(0);
    const [ rowsPerPage, setRowsPerPage ] = useState(10);
    const [ search, setSearch ] = useState('');
    const [ searchQuery, setSearchQuery ] = useState('');

    const { data, isLoading, error } = useAllTraceEvidence(page + 1, rowsPerPage, searchQuery);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearch = () => {
        setSearchQuery(search);
        setPage(0);
    };

    const handleClearSearch = () => {
        setSearch('');
        setSearchQuery('');
        setPage(0);
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const handleViewCaseFile = (caseFileId: number) => {
        navigate(`/expedientes/${caseFileId}`);
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
                    }}
                >
                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                        📁 Indicios
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        Gestión centralizada de indicios del sistema
                    </Typography>
                </Box>

                {/* Filtros con diseño mejorado */}
                <Card
                    sx={{
                        mb: 3,
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <TextField
                                placeholder="Buscar indicios..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyPress={handleKeyPress}
                                sx={{
                                    flex: 1,
                                    minWidth: 300,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        '&:hover fieldset': {
                                            borderColor: 'primary.main',
                                        },
                                    },
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: search && (
                                        <InputAdornment position="end">
                                            <IconButton size="small" onClick={handleClearSearch}>
                                                <ClearIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button
                                variant="contained"
                                startIcon={<SearchIcon />}
                                onClick={handleSearch}
                                disabled={isLoading}
                                sx={{
                                    px: 3,
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontWeight: 600,
                                }}
                            >
                                Buscar
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {/* Tabla con diseño mejorado */}
                <Card
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
                                    <TableCell>Número</TableCell>
                                    <TableCell>Número de Caso</TableCell>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell>Descripción</TableCell>
                                    <TableCell>Color</TableCell>
                                    <TableCell>Tamaño</TableCell>
                                    <TableCell>Peso (kg)</TableCell>
                                    <TableCell>Ubicación</TableCell>
                                    <TableCell>Recolectado por</TableCell>
                                    <TableCell>Fecha</TableCell>
                                    <TableCell align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={11} align="center" sx={{ py: 8 }}>
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                ) : error ? (
                                    <TableRow>
                                        <TableCell colSpan={11} align="center" sx={{ py: 8 }}>
                                            <Alert severity="error">Error al cargar los indicios</Alert>
                                        </TableCell>
                                    </TableRow>
                                ) : !data || data.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={11} align="center" sx={{ py: 8 }}>
                                            <Typography color="textSecondary">
                                                No se encontraron indicios
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data.data.map((evidence) => (
                                        <TableRow
                                            key={evidence.traceEvidenceId}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: 'rgba(30, 60, 114, 0.04)',
                                                    transform: 'scale(1.001)',
                                                    transition: 'all 0.2s ease-in-out',
                                                },
                                                transition: 'all 0.2s ease-in-out',
                                            }}
                                        >
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {evidence.evidenceNumber}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={evidence.caseFileNumber}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                    onClick={() => handleViewCaseFile(evidence.caseFileId)}
                                                    sx={{ cursor: 'pointer' }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={evidence.traceEvidenceTypeName}
                                                    size="small"
                                                    color="info"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
                                                    {evidence.description}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {evidence.color || 'N/A'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {evidence.size || 'N/A'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {evidence.weight ? `${evidence.weight} kg` : 'N/A'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {evidence.location || 'N/A'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {evidence.collectedByName}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {dayjs(evidence.collectedAt).format('DD/MM/YYYY')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Tooltip title="Ver expediente" arrow>
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
                                                        onClick={() => handleViewCaseFile(evidence.caseFileId)}
                                                    >
                                                        <VisibilityIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {data && data.pagination && (
                        <TablePagination
                            rowsPerPageOptions={[ 5, 10, 25, 50 ]}
                            component="div"
                            count={data.pagination.total}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Filas por página:"
                            labelDisplayedRows={({ from, to, count }) =>
                                `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                            }
                        />
                    )}
                </Card>
            </Box>
        </MainLayout>
    );
};

export default TraceEvidenceListPage;
