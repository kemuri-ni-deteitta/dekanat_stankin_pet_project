/* -----------------------------------------------------------------------
   KafedraFormPage – visually matches StudentFormPage
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
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TextField,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import {
    fetchKafedraById,
    createKafedra,
    updateKafedra,
    deleteKafedra,
} from '../kafedraSlice';
import { fetchInstitutes } from '../../institutes/instituteSlice';
import { Kafedra } from '../../../types/kafedra';

import AnimatedFormShell from '../../../components/AnimatedFormShell';

/* ───────── helpers ───────── */
const getMsg = (err: unknown) =>
    typeof err === 'string'
        ? err
        : (err as any)?.message ||
        (err as any)?.response?.data?.message ||
        JSON.stringify(err ?? {});

/* ───────── constants ───────── */
const initialForm: Omit<Kafedra, 'id'> = {
    name: '',
    email: '',
    phone: '',
    room: '',
    instituteId: 0,
    credentialsNonExpired: false,
};

type FormErrors = Partial<Record<keyof typeof initialForm, string>>;

/* ───────── component ───────── */
const KafedraFormPage: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const isEdit = Boolean(id);
    const kafedraId = id ? +id : null;

    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { selectedKafedra, status } = useAppSelector(s => s.kafedras);
    const { institutes } = useAppSelector(s => s.institutes);

    const [data, setData] = useState(initialForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    /* fetch data */
    useEffect(() => {
        dispatch(fetchInstitutes());
        if (isEdit && kafedraId !== null) dispatch(fetchKafedraById(kafedraId));
    }, [dispatch, isEdit, kafedraId]);

    /* populate on edit */
    useEffect(() => {
        if (isEdit && selectedKafedra) {
            const { id: _ignore, ...rest } = selectedKafedra;
            setData(rest);
        }
    }, [isEdit, selectedKafedra]);

    /* validation */
    const validate = (): FormErrors => {
        const e: FormErrors = {};
        if (!data.name.trim()) e.name = 'Название обязательно';
        if (!data.email.trim()) e.email = 'E-mail обязателен';
        if (!data.phone.trim()) e.phone = 'Телефон обязателен';
        if (!data.room.trim()) e.room = 'Кабинет обязателен';
        if (!data.instituteId) e.instituteId = 'Институт обязателен';
        return e;
    };

    /* field change */
    const onField = (field: keyof typeof initialForm, value: any) => {
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
            if (isEdit && kafedraId !== null) {
                await dispatch(updateKafedra({ id: kafedraId, ...data })).unwrap();
            } else {
                await dispatch(createKafedra(data)).unwrap();
            }
            navigate('/kafedras');
        } catch (err) {
            setServerError(getMsg(err));
        }
    };

    /* delete */
    const onDelete = async () => {
        if (kafedraId === null) return;
        try {
            await dispatch(deleteKafedra(kafedraId)).unwrap();
            navigate('/kafedras');
        } catch (err) {
            setDeleteError(getMsg(err));
        }
    };

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
            title={isEdit ? 'Редактировать кафедру' : 'Создать кафедру'}
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

                <TextField
                    label="Кабинет"
                    value={data.room}
                    fullWidth
                    margin="normal"
                    error={!!errors.room}
                    helperText={errors.room}
                    onChange={e => onField('room', e.target.value)}
                />

                <FormControl fullWidth margin="normal" error={!!errors.instituteId}>
                    <InputLabel id="institutes-label">Институт</InputLabel>
                    <Select
                        labelId="institutes-label"
                        label="Институт"
                        value={data.instituteId}
                        onChange={e => onField('instituteId', Number(e.target.value))}
                    >
                        {institutes.map(i => (
                            <MenuItem key={i.id} value={i.id}>
                                {i.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControlLabel
                    sx={{ mt: 2 }}
                    control={
                        <Switch
                            checked={data.credentialsNonExpired}
                            onChange={e =>
                                onField('credentialsNonExpired', e.target.checked)
                            }
                        />
                    }
                    label="Учётные данные действительны"
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

            {/* dialog */}
            <Dialog
                open={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
            >
                <DialogTitle>Подтвердите удаление</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Удалить кафедру без возможности восстановления?
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

export default KafedraFormPage;
