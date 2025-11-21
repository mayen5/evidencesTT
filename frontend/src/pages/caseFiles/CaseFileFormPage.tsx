import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Grid,
    CircularProgress,
    Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import MainLayout from '../../components/layout/MainLayout.tsx';
import { useCaseFile, useCreateCaseFile, useUpdateCaseFile } from '../../hooks/useCaseFiles';
import type { CreateCaseFileDTO, UpdateCaseFileDTO } from '../../types/caseFile.types';

// Validation Schema
const caseFileValidationSchema = Yup.object({
    caseNumber: Yup.string()
        .required('El número de caso es requerido')
        .max(50, 'El número de caso no puede exceder 50 caracteres'),
    title: Yup.string()
        .required('El título es requerido')
        .max(200, 'El título no puede exceder 200 caracteres'),
    description: Yup.string()
        .required('La descripción es requerida'),
    location: Yup.string()
        .max(200, 'La ubicación no puede exceder 200 caracteres')
        .optional(),
    incidentDate: Yup.date()
        .required('La fecha del incidente es requerida')
        .max(new Date(), 'La fecha no puede ser futura'),
});

const CaseFileFormPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;

    // Hooks
    const { data: caseFile, isLoading: isLoadingCaseFile } = useCaseFile(Number(id));
    const createMutation = useCreateCaseFile();
    const updateMutation = useUpdateCaseFile();

    const formik = useFormik({
        initialValues: {
            caseNumber: '',
            title: '',
            description: '',
            location: '',
            incidentDate: new Date(),
        },
        validationSchema: caseFileValidationSchema,
        onSubmit: async (values) => {
            try {
                const formattedDate = values.incidentDate.toISOString();

                if (isEditMode && id) {
                    const updateData: UpdateCaseFileDTO = {
                        title: values.title,
                        description: values.description,
                        location: values.location || undefined,
                        incidentDate: formattedDate,
                    };
                    await updateMutation.mutateAsync({ id: Number(id), data: updateData });
                    navigate(`/expedientes/${id}`);
                } else {
                    const createData: CreateCaseFileDTO = {
                        caseNumber: values.caseNumber,
                        title: values.title,
                        description: values.description,
                        location: values.location || undefined,
                        incidentDate: formattedDate,
                    };
                    const result = await createMutation.mutateAsync(createData);
                    navigate(`/expedientes/${result.caseFileId}`);
                }
            } catch (error) {
                console.error('Error al guardar expediente:', error);
            }
        },
    });

    // Load case file data in edit mode
    useEffect(() => {
        if (isEditMode && caseFile) {
            formik.setValues({
                caseNumber: caseFile.caseNumber,
                title: caseFile.title,
                description: caseFile.description,
                location: caseFile.location || '',
                incidentDate: new Date(caseFile.incidentDate),
            });
        }
    }, [ caseFile, isEditMode ]);

    const handleCancel = () => {
        if (isEditMode && id) {
            navigate(`/expedientes/${id}`);
        } else {
            navigate('/expedientes');
        }
    };

    if (isEditMode && isLoadingCaseFile) {
        return (
            <MainLayout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                    <CircularProgress />
                </Box>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Box sx={{ p: 3 }}>
                {/* Header */}
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                        startIcon={<ArrowBackIcon />}
                        onClick={handleCancel}
                        variant="outlined"
                    >
                        Volver
                    </Button>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                        {isEditMode ? 'Editar Expediente' : 'Crear Nuevo Expediente'}
                    </Typography>
                </Box>

                {/* Form */}
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
                    }}
                >
                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Case Number - Only in create mode */}
                            {!isEditMode && (
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        id="caseNumber"
                                        name="caseNumber"
                                        label="Número de Caso *"
                                        value={formik.values.caseNumber}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.caseNumber && Boolean(formik.errors.caseNumber)}
                                        helperText={formik.touched.caseNumber && formik.errors.caseNumber}
                                        disabled={createMutation.isPending || updateMutation.isPending}
                                    />
                                </Grid>
                            )}

                            {/* Title */}
                            <Grid item xs={12} md={isEditMode ? 12 : 6}>
                                <TextField
                                    fullWidth
                                    id="title"
                                    name="title"
                                    label="Título *"
                                    value={formik.values.title}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.title && Boolean(formik.errors.title)}
                                    helperText={formik.touched.title && formik.errors.title}
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                />
                            </Grid>

                            {/* Description */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="description"
                                    name="description"
                                    label="Descripción *"
                                    multiline
                                    rows={4}
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.description && Boolean(formik.errors.description)}
                                    helperText={formik.touched.description && formik.errors.description}
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                />
                            </Grid>

                            {/* Location */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    id="location"
                                    name="location"
                                    label="Ubicación (opcional)"
                                    value={formik.values.location}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.location && Boolean(formik.errors.location)}
                                    helperText={formik.touched.location && formik.errors.location}
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                />
                            </Grid>

                            {/* Incident Date */}
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Fecha del Incidente *"
                                    name="incidentDate"
                                    type="date"
                                    value={formik.values.incidentDate instanceof Date
                                        ? formik.values.incidentDate.toISOString().split('T')[ 0 ]
                                        : formik.values.incidentDate}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.incidentDate && Boolean(formik.errors.incidentDate)}
                                    helperText={formik.touched.incidentDate && formik.errors.incidentDate as string}
                                    disabled={createMutation.isPending || updateMutation.isPending}
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ max: new Date().toISOString().split('T')[ 0 ] }}
                                />
                            </Grid>

                            {/* Info */}
                            <Grid item xs={12}>
                                <Alert severity="info">
                                    Los campos marcados con (*) son obligatorios
                                </Alert>
                            </Grid>

                            {/* Action Buttons */}
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                    <Button
                                        variant="outlined"
                                        onClick={handleCancel}
                                        disabled={createMutation.isPending || updateMutation.isPending}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        startIcon={
                                            createMutation.isPending || updateMutation.isPending ? (
                                                <CircularProgress size={20} color="inherit" />
                                            ) : (
                                                <SaveIcon />
                                            )
                                        }
                                        disabled={createMutation.isPending || updateMutation.isPending}
                                        sx={{
                                            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #152a52 0%, #1e3c72 100%)',
                                            },
                                        }}
                                    >
                                        {isEditMode ? 'Guardar Cambios' : 'Crear Expediente'}
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Box>
        </MainLayout>
    );
};

export default CaseFileFormPage;
