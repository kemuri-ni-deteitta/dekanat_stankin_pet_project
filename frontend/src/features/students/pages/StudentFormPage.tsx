/* -----------------------------------------------------------------------
   StudentFormPage.tsx · client-side duplicate checks only
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
    MenuItem,
    TextField,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import AnimatedFormShell from '../../../components/AnimatedFormShell';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import {
    fetchStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
} from '../studentSlice';
import { Student } from '../../../types/people';

/* ───────── helpers ───────── */
const msg = (e: unknown): string =>
    typeof e === 'string'
        ? e
        : (e as any)?.message ||
        (e as any)?.response?.data?.message ||
        JSON.stringify(e ?? {});

/* ───────── constants ───────── */
const THIS_YEAR = new Date().getFullYear();
const empty: Omit<Student, 'id'> = {
    person: { name: '', surname: '', patronymic: '', phone: '' },
    yearStarted: THIS_YEAR,
    financialForm: 'BUDGET',
};
const forms = [
    { value: 'BUDGET', label: 'Бюджет' },
    { value: 'CONTRACT', label: 'Контракт' },
];

/* ───────── types ───────── */
type Field =
    | keyof typeof empty.person
    | 'yearStarted'
    | 'financialForm';
type Errors = Partial<Record<Field, string>>;

/* ───────── component ───────── */
const StudentFormPage: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const isEdit = Boolean(id);
    const sid = id ? +id : null;

    const nav = useNavigate();
    const dispatch = useAppDispatch();
    const { selectedStudent, students, status } = useAppSelector(s => s.students);

    /* state */
    const [data, setData] = useState(empty);
    const [errors, setErrors] = useState<Errors>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    /* fetch / populate */
    useEffect(() => {
        if (isEdit && sid !== null) dispatch(fetchStudentById(sid));
    }, [dispatch, isEdit, sid]);

    useEffect(() => {
        if (isEdit && selectedStudent) {
            setData({
                person: { ...selectedStudent.person },
                yearStarted: selectedStudent.yearStarted,
                financialForm: selectedStudent.financialForm,
            });
        }
    }, [isEdit, selectedStudent]);

    /* ─── validation ─── */
    const validate = (): Errors => {
        const e: Errors = {};
        const { surname, name, patronymic, phone } = data.person;
        const year = data.yearStarted;

        /* basic empty / format checks */
        if (!surname.trim()) e.surname = 'Фамилия обязательна';
        if (!name.trim()) e.name = 'Имя обязательно';
        if (!patronymic.trim()) e.patronymic = 'Отчество обязательно';

        if (!phone.trim()) e.phone = 'Телефон обязателен';
        else if (!/^\+\d{5,15}$/.test(phone))
            e.phone = 'Формат: + и 5–15 цифр';

        if (!year || !Number.isInteger(year)) e.yearStarted = 'Неверный год';
        else if (year < 2000 || year > THIS_YEAR)
            e.yearStarted = `Год между 2000 и ${THIS_YEAR}`;

        /* unique patronymic check (old DB constraint) */
        const patronymicTaken = students.some(
            s =>
                s.id !== sid &&
                s.person.patronymic.trim().toLowerCase() ===
                patronymic.trim().toLowerCase(),
        );
        if (patronymicTaken)
            e.patronymic = 'Студент с таким отчеством уже есть';

        /* composite F-I-O + year */
        const duplicate = students.some(
            s =>
                s.id !== sid &&
                s.yearStarted === year &&
                s.person.surname.trim().toLowerCase() === surname.trim().toLowerCase() &&
                s.person.name.trim().toLowerCase() === name.trim().toLowerCase() &&
                s.person.patronymic.trim().toLowerCase() ===
                patronymic.trim().toLowerCase(),
        );
        if (duplicate)
            e.yearStarted = `Студент ${surname} ${name} уже зарегистрирован за ${year}`;

        return e;
    };

    /* change */
    const onField = (field: Field, val: string | number) => {
        setErrors(p => ({ ...p, [field]: undefined }));
        setServerError(null);

        if (field in data.person) {
            setData(d => ({ ...d, person: { ...d.person, [field]: val } }));
        } else {
            setData(d => ({ ...d, [field]: val }));
        }
    };

    /* submit */
    const onSubmit = async (ev: React.FormEvent) => {
        ev.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length) return;

        try {
            if (isEdit && sid !== null) {
                await dispatch(updateStudent({ id: sid, ...data })).unwrap();
            } else {
                await dispatch(createStudent(data)).unwrap();
            }
            nav('/students');
        } catch (err) {
            setServerError(msg(err));
        }
    };

    /* delete */
    const onDelete = async () => {
        if (sid === null) return;
        try {
            await dispatch(deleteStudent(sid)).unwrap();
            nav('/students');
        } catch (err) {
            setDeleteError(msg(err));
        }
    };

    /* loader */
    if (isEdit && status === 'loading') {
        return (
            <Box display="flex" justifyContent="center" mt={8}>
                <CircularProgress />
            </Box>
        );
    }

    /* render */
    return (
        <AnimatedFormShell title={isEdit ? 'Редактировать студента' : 'Создать студента'}>
            <Box component="form" onSubmit={onSubmit}>
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

                <TextField
                    label="Год поступления"
                    type="number"
                    value={data.yearStarted}
                    fullWidth
                    margin="normal"
                    error={!!errors.yearStarted}
                    helperText={errors.yearStarted}
                    onChange={e => onField('yearStarted', +e.target.value)}
                />

                <TextField
                    select
                    label="Форма обучения"
                    value={data.financialForm}
                    fullWidth
                    margin="normal"
                    onChange={e => onField('financialForm', e.target.value)}
                >
                    {forms.map(opt => (
                        <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                        </MenuItem>
                    ))}
                </TextField>

                {serverError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {serverError}
                    </Alert>
                )}

                <Box display="flex" justifyContent="space-between" mt={3}>
                    {isEdit && (
                        <Button variant="outlined" color="error" onClick={() => setConfirmDelete(true)}>
                            Удалить
                        </Button>
                    )}
                    <Button type="submit" variant="contained">
                        {isEdit ? 'Сохранить' : 'Создать'}
                    </Button>
                </Box>
            </Box>

            {/* delete confirmation */}
            <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
                <DialogTitle>Подтвердите удаление</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Вы уверены, что хотите удалить этого студента? Это действие не обратимо.
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

export default StudentFormPage;
