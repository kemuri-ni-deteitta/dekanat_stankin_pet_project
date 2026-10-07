/* -----------------------------------------------------------------------
   InstituteFormPage – uses the shared AnimatedFormShell
   -------------------------------------------------------------------- */

import React, { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import {
    fetchInstituteById,
    createInstitute,
    updateInstitute,
    deleteInstitute,
} from '../instituteSlice';
import { Institute } from '../../../types/institute';

import AnimatedFormShell from '../../../components/AnimatedFormShell';

/* ───────── helper ───────── */
const getMsg = (err: unknown): string =>
    typeof err === 'string'
        ? err
        : (err as any)?.message ||
        (err as any)?.response?.data?.message ||
        JSON.stringify(err ?? {});

/* ───────── constants / types ───────── */
const initialForm: Omit<Institute, 'id'> = {
    email: '',
    name: '',
    phone: '',
};
type FormErrors = Partial<Record<keyof typeof initialForm, string>>;

/* ───────── component ───────── */
const InstituteFormPage: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const isEdit = Boolean(id);
    const instituteId = id ? +id : null;

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { selectedInstitute, status } = useAppSelector(s => s.institutes);

    /* local state */
    const [data, setData] = useState(initialForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    /* fetch / hydrate */
    useEffect(() => {
        if (isEdit && instituteId !== null) dispatch(fetchInstituteById(instituteId));
    }, [dispatch, isEdit, instituteId]);

    useEffect(() => {
        if (isEdit && selectedInstitute) {
            setData({
                email: selectedInstitute.email,
                name: selectedInstitute.name,
                phone: selectedInstitute.phone,
            });
        }
    }, [isEdit, selectedInstitute]);

    /* validation */
    const validate = (): FormErrors => {
        const e: FormErrors = {};
        const { email, name, phone } = data;

        if (!name.trim()) e.name = 'Название обязательно';
        if (!email.trim()) e.email = 'E-mail обязателен';
        if (!phone.trim()) e.phone = 'Телефон обязателен';
        else if (!/^\+\d{5,15}$/.test(phone))
            e.phone = 'Формат: + и 5–15 цифр';

        return e;
    };

    /* field change */
    const onField = (field: keyof typeof initialForm, value: string) => {
        setErrors(p => ({ ...p, [field]: undefined }));
        setServerError(null);
        setData(d => ({ ...d, [field]: value }));
    };

    /* submit */
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const eMap = validate();
        setErrors(eMap);
        if (Object.keys(eMap).length) return;

        try {
            if (isEdit && instituteId !== null) {
                await dispatch(updateInstitute({ id: instituteId, ...data })).unwrap();
            } else {
                await dispatch(createInstitute(data)).unwrap();
            }
            navigate('/institutes');
        } catch (err) {
            setServerError(getMsg(err));
        }
    };

    /* delete */
    const onDelete = async () => {
        if (instituteId === null) return;
        try {
            await dispatch(deleteInstitute(instituteId)).unwrap();
            navigate('/institutes');
        } catch (err) {
            setDeleteError(getMsg(err));
        }
    };

    /* loader */
    if (isEdit && status === 'loading') {
        return (
            <Box display="flex" justifyContent="center" mt={8}>
                <CircularProgress size={48} />
            </Box>
        );
    }

    /* render */
    return (
        <AnimatedFormShell
            title={isEdit ? 'Редактировать институт' : 'Создать институт'}
        >
            <Box component="form" onSubmit={onSubmit}>
                <TextField
                    label="Название"
                    value={data.name}
                    fullWidth
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name}
                    onChange={e => onField('name', e.target.value)}
                />

                <TextField
                    label="E-mail"
                    value={data.email}
                    fullWidth
                    margin="normal"
                    error={!!errors.email}
                    helperText={errors.email}
                    onChange={e => onField('email', e.target.value)}
                />

                <TextField
                    label="Телефон"
                    value={data.phone}
                    fullWidth
                    margin="normal"
                    error={!!errors.phone}
                    helperText={errors.phone}
                    onChange={e => onField('phone', e.target.value)}
                />

                {serverError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {serverError}
                    </Alert>
                )}

                <Box display="flex" justifyContent="space-between" mt={3}>
                    {isEdit && (
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => setConfirmDeleteOpen(true)}
                        >
                            Удалить
                        </Button>
                    )}
                    <Button type="submit" variant="contained">
                        {isEdit ? 'Сохранить' : 'Создать'}
                    </Button>
                </Box>
            </Box>

            {/* delete confirmation dialog */}
            <Dialog
                open={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
            >
                <DialogTitle>Подтвердите удаление</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Вы уверены, что хотите удалить этот институт? Это действие
                        необратимо.
                    </DialogContentText>
                    {deleteError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {deleteError}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteOpen(false)}>Отмена</Button>
                    <Button variant="contained" color="error" onClick={onDelete}>
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </AnimatedFormShell>
    );
};

export default InstituteFormPage;
