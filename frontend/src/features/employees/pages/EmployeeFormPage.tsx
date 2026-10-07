/* -----------------------------------------------------------------------
   EmployeeFormPage – add / edit an employee
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
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TextField,
    FormControlLabel
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import AnimatedFormShell from '../../../components/AnimatedFormShell';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import {
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    fetchEmployeeById        // add this thunk if you want “edit” mode
} from '../employeeSlice';
import { fetchKafedras } from '../../kafedras/kafedraSlice';
import api from '../../../api/axios';    // <— we’ll call job-titles directly
import { Employee } from '../../../types/employee';

/* ───────── helpers ───────── */
const getMsg = (e: unknown) =>
    typeof e === 'string'
        ? e
        : (e as any)?.message ||
        (e as any)?.response?.data?.message ||
        JSON.stringify(e ?? {});

/* ───────── constants / types ───────── */
type JobTitle = { id: number; name: string };
const initialForm: Omit<Employee, 'id'> = {
    person: { name: '', surname: '', patronymic: '', phone: '' },
    jobTitleId: 0,
    kafedraId: 0,
    credentialsNonExpired: true
};
type FormField =
    | keyof typeof initialForm.person
    | 'jobTitleId'
    | 'kafedraId'
    | 'credentialsNonExpired';
type FormErrors = Partial<Record<FormField, string>>;

/* ───────── component ───────── */
const EmployeeFormPage: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const isEdit = Boolean(id);
    const employeeId = id ? +id : null;

    const nav = useNavigate();
    const dispatch = useAppDispatch();

    const { status, selectedEmployee } = useAppSelector(s => s.employees);
    const { kafedras } = useAppSelector(s => s.kafedras);

    const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
    const [data, setData] = useState(initialForm);
    const [errors, setErrors] = useState<FormErrors>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    /* fetch look-ups once */
    useEffect(() => {
        dispatch(fetchKafedras());
        (async () => {
            const res = await api.get<JobTitle[]>('/job-titles/getAll');
            setJobTitles(res.data);
        })();
    }, [dispatch]);

    /* fetch employee on edit */
    useEffect(() => {
        if (isEdit && employeeId !== null) dispatch(fetchEmployeeById(employeeId));
    }, [dispatch, isEdit, employeeId]);

    /* populate edit form */
    useEffect(() => {
        if (isEdit && selectedEmployee) {
            const { id: _ignore, ...rest } = selectedEmployee;
            setData(rest);
        }
    }, [isEdit, selectedEmployee]);

    /* ─── validation (pure front-end) ─── */
    const validate = (): FormErrors => {
        const e: FormErrors = {};
        const { surname, name, patronymic, phone } = data.person;

        if (!surname.trim()) e.surname = 'Фамилия обязательна';
        if (!name.trim()) e.name = 'Имя обязательно';
        if (!patronymic.trim()) e.patronymic = 'Отчество обязательно';

        if (!phone.trim()) e.phone = 'Телефон обязателен';
        else if (!/^\+\d{5,15}$/.test(phone))
            e.phone = 'Формат: + и 5–15 цифр';

        if (!data.jobTitleId)   e.jobTitleId   = 'Должность обязательна';
        if (!data.kafedraId)    e.kafedraId    = 'Кафедра обязательна';

        return e;
    };

    /* field handler */
    const onField = (field: FormField, value: any) => {
        setErrors(p => ({ ...p, [field]: undefined }));
        setServerError(null);
        if (field in data.person) {
            setData(d => ({ ...d, person: { ...d.person, [field]: value } }));
        } else {
            setData(d => ({ ...d, [field]: value }));
        }
    };

    /* submit */
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const eMap = validate();
        setErrors(eMap);
        if (Object.keys(eMap).length) return;

        try {
            if (isEdit && employeeId !== null) {
                await dispatch(updateEmployee({ id: employeeId, ...data })).unwrap();
            } else {
                await dispatch(createEmployee(data)).unwrap();
            }
            dispatch(fetchEmployees());          // refresh table cache
            nav('/employees');
        } catch (err) {
            setServerError(getMsg(err));
        }
    };

    /* delete */
    const onDelete = async () => {
        if (employeeId === null) return;
        try {
            await dispatch(deleteEmployee(employeeId)).unwrap();
            nav('/employees');
        } catch (err) {
            setDeleteError(getMsg(err));
        }
    };

    if (isEdit && status === 'loading')
        return (
            <Box display="flex" justifyContent="center" mt={8}>
                <CircularProgress size={48} />
            </Box>
        );

    /* ─── render ─── */
    return (
        <AnimatedFormShell
            title={isEdit ? 'Редактировать сотрудника' : 'Создать сотрудника'}
        >
            <Box component="form" onSubmit={onSubmit}>
                {/* ФИО + телефон */}
                <TextField
                    label="Фамилия"
                    value={data.person.surname}
                    fullWidth
                    margin="normal"
                    error={!!errors.surname}
                    helperText={errors.surname}
                    onChange={e => onField('surname', e.target.value)}
                />
                <TextField
                    label="Имя"
                    value={data.person.name}
                    fullWidth
                    margin="normal"
                    error={!!errors.name}
                    helperText={errors.name}
                    onChange={e => onField('name', e.target.value)}
                />
                <TextField
                    label="Отчество"
                    value={data.person.patronymic}
                    fullWidth
                    margin="normal"
                    error={!!errors.patronymic}
                    helperText={errors.patronymic}
                    onChange={e => onField('patronymic', e.target.value)}
                />
                <TextField
                    label="Телефон"
                    value={data.person.phone}
                    fullWidth
                    margin="normal"
                    error={!!errors.phone}
                    helperText={errors.phone}
                    onChange={e => onField('phone', e.target.value)}
                />

                {/* выпадающие списки */}
                <FormControl fullWidth margin="normal" error={!!errors.jobTitleId}>
                    <InputLabel id="job-label">Должность</InputLabel>
                    <Select
                        labelId="job-label"
                        label="Должность"
                        value={data.jobTitleId}
                        onChange={e => onField('jobTitleId', Number(e.target.value))}
                    >
                        {jobTitles.map(j => (
                            <MenuItem key={j.id} value={j.id}>
                                {j.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal" error={!!errors.kafedraId}>
                    <InputLabel id="kafedra-label">Кафедра</InputLabel>
                    <Select
                        labelId="kafedra-label"
                        label="Кафедра"
                        value={data.kafedraId}
                        onChange={e => onField('kafedraId', Number(e.target.value))}
                    >
                        {kafedras.map(k => (
                            <MenuItem key={k.id} value={k.id}>
                                {k.name}
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
                            onClick={() => setConfirmDelete(true)}
                        >
                            Удалить
                        </Button>
                    )}
                    <Button type="submit" variant="contained">
                        {isEdit ? 'Сохранить' : 'Создать'}
                    </Button>
                </Box>
            </Box>

            {/* confirm delete */}
            <Dialog
                open={confirmDelete}
                onClose={() => setConfirmDelete(false)}
            >
                <DialogTitle>Удалить сотрудника?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Действие необратимо.
                    </DialogContentText>
                    {deleteError && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {deleteError}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDelete(false)}>Отмена</Button>
                    <Button variant="contained" color="error" onClick={onDelete}>
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </AnimatedFormShell>
    );
};

export default EmployeeFormPage;
