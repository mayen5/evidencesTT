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
    MenuItem,
} from '@mui/material';
import {
    Search as SearchIcon,
    Visibility as VisibilityIcon,
    Download as DownloadIcon,
    Description as DescriptionIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';

// Placeholder data - esto se reemplazará con datos reales del backend
interface Evidence {
    id: number;
    caseFileId: number;
    caseFileNumber: string;
    fileName: string;
    description: string;
    uploadDate: string;
    uploadedBy: string;
    fileSize: number;
    fileType: string;
}

const mockEvidences: Evidence[] = [
    {
        id: 1,
        caseFileId: 1,
        caseFileNumber: 'EXP-2025-001',
        fileName: 'informe_tecnico.pdf',
        description: 'Informe técnico inicial',
        uploadDate: '2025-11-15',
        uploadedBy: 'Juan Pérez',
        fileSize: 2048576,
        fileType: 'application/pdf',
    },
    {
        id: 2,
        caseFileId: 1,
        caseFileNumber: 'EXP-2025-001',
        fileName: 'fotografias.zip',
        description: 'Fotografías del sitio',
        uploadDate: '2025-11-16',
        uploadedBy: 'Juan Pérez',
        fileSize: 15728640,
        fileType: 'application/zip',
    },
    {
        id: 3,
        caseFileId: 2,
        caseFileNumber: 'EXP-2025-002',
        fileName: 'analisis_laboratorio.pdf',
        description: 'Resultados de análisis',
        uploadDate: '2025-11-17',
        uploadedBy: 'María García',
        fileSize: 1048576,
        fileType: 'application/pdf',
    },
];

const EvidenceListPage: React.FC = () => {
    const navigate = useNavigate();
    const [ page, setPage ] = useState(0);
    const [ rowsPerPage, setRowsPerPage ] = useState(10);
    const [ search, setSearch ] = useState('');
    const [ fileTypeFilter, setFileTypeFilter ] = useState('');

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = [ 'Bytes', 'KB', 'MB', 'GB' ];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[ i ];
    };

    const getFileTypeLabel = (fileType: string): string => {
        if (fileType.includes('pdf')) return 'PDF';
        if (fileType.includes('image')) return 'Imagen';
        if (fileType.includes('zip')) return 'ZIP';
        if (fileType.includes('word')) return 'Word';
        if (fileType.includes('excel')) return 'Excel';
        return 'Archivo';
    };

    const getFileTypeColor = (fileType: string): 'error' | 'success' | 'warning' | 'info' | 'default' => {
        if (fileType.includes('pdf')) return 'error';
        if (fileType.includes('image')) return 'success';
        if (fileType.includes('zip')) return 'warning';
        if (fileType.includes('word') || fileType.includes('excel')) return 'info';
        return 'default';
    };

    const filteredEvidences = mockEvidences.filter((evidence) => {
        const matchesSearch = search === '' ||
            evidence.fileName.toLowerCase().includes(search.toLowerCase()) ||
            evidence.caseFileNumber.toLowerCase().includes(search.toLowerCase()) ||
            evidence.description.toLowerCase().includes(search.toLowerCase());

        const matchesFileType = fileTypeFilter === '' || evidence.fileType.includes(fileTypeFilter);

        return matchesSearch && matchesFileType;
    });

    const handleViewCaseFile = (caseFileId: number) => {
        navigate(`/case-files/${caseFileId}`);
    };

    const handleDownload = (evidenceId: number) => {
        console.log('Download evidence:', evidenceId);
        // TODO: Implementar descarga de evidencia
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
                        📁 Evidencias
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                        Gestión centralizada de evidencias del sistema
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
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <TextField
                                placeholder="Buscar evidencias..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
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
                                }}
                            />
                            <TextField
                                select
                                label="Tipo de archivo"
                                value={fileTypeFilter}
                                onChange={(e) => setFileTypeFilter(e.target.value)}
                                sx={{
                                    minWidth: 200,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                    },
                                }}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                <MenuItem value="pdf">PDF</MenuItem>
                                <MenuItem value="image">Imágenes</MenuItem>
                                <MenuItem value="zip">ZIP</MenuItem>
                                <MenuItem value="word">Word</MenuItem>
                                <MenuItem value="excel">Excel</MenuItem>
                            </TextField>
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
                                    <TableCell>Expediente</TableCell>
                                    <TableCell>Archivo</TableCell>
                                    <TableCell>Descripción</TableCell>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell>Tamaño</TableCell>
                                    <TableCell>Subido por</TableCell>
                                    <TableCell>Fecha</TableCell>
                                    <TableCell align="center">Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredEvidences
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((evidence) => (
                                        <TableRow
                                            key={evidence.id}
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
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <DescriptionIcon color="action" fontSize="small" />
                                                    <Typography variant="body2">
                                                        {evidence.fileName}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" color="text.secondary">
                                                    {evidence.description}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={getFileTypeLabel(evidence.fileType)}
                                                    size="small"
                                                    color={getFileTypeColor(evidence.fileType)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">
                                                    {formatFileSize(evidence.fileSize)}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{evidence.uploadedBy}</TableCell>
                                            <TableCell>
                                                {new Date(evidence.uploadDate).toLocaleDateString('es-ES')}
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
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
                                                    <Tooltip title="Descargar" arrow>
                                                        <IconButton
                                                            size="small"
                                                            sx={{
                                                                color: 'success.main',
                                                                '&:hover': {
                                                                    backgroundColor: 'success.light',
                                                                    transform: 'scale(1.1)',
                                                                },
                                                                transition: 'all 0.2s',
                                                            }}
                                                            onClick={() => handleDownload(evidence.id)}
                                                        >
                                                            <DownloadIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                {filteredEvidences.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center">
                                            <Typography variant="body2" color="text.secondary" py={3}>
                                                No se encontraron evidencias
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[ 5, 10, 25, 50 ]}
                        component="div"
                        count={filteredEvidences.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage="Filas por página:"
                        labelDisplayedRows={({ from, to, count }) =>
                            `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                        }
                    />
                </Card>
            </Box>
        </MainLayout>
    );
};

export default EvidenceListPage;
