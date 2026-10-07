/* --------------------------------------------------------------------
   StudentTable.tsx   –   full file, paste over the current one
   ------------------------------------------------------------------ */

import React, { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
    Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import AnimatedTableShell from '../../../components/AnimatedTableShell';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchStudents } from '../studentSlice';

/* ───────── helpers & constants ────────── */
type SortOrder = 'asc' | 'desc';

const labels: Record<string, string> = {
    surname:        'Фамилия',
    name:           'Имя',
    patronymic:     'Отчество',
    phone:          'Телефон',
    yearStarted:    'Год поступления',
    financialForm:  'Форма обучения',
};

const formRU: Record<'BUDGET' | 'CONTRACT', string> = {
    BUDGET:   'Бюджет',
    CONTRACT: 'Контракт',
};

const financialOptions = [
    { value: 'ALL',      label: 'Все' },
    { value: 'BUDGET',   label: formRU.BUDGET },
    { value: 'CONTRACT', label: formRU.CONTRACT },
];

const columns: { field: keyof typeof labels; labelKey: string }[] = [
    { field: 'surname',       labelKey: 'surname' },
    { field: 'name',          labelKey: 'name' },
    { field: 'patronymic',    labelKey: 'patronymic' },
    { field: 'phone',         labelKey: 'phone' },
    { field: 'yearStarted',   labelKey: 'yearStarted' },
    { field: 'financialForm', labelKey: 'financialForm' },
];

/* ─────────────────── component ────────────────── */
const StudentTable: React.FC = () => {
    const dispatch  = useAppDispatch();
    const navigate  = useNavigate();
    const { students, status } = useAppSelector((s) => s.students);

    /* ui state */
    const [search,      setSearch]      = useState('');
    const [filter,      setFilter]      = useState('ALL');
    const [sortBy,      setSortBy]      = useState<keyof typeof labels>('surname');
    const [sortOrder,   setSortOrder]   = useState<SortOrder>('asc');
    const [page,        setPage]        = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    /* fetch on mount */
    useEffect(() => { dispatch(fetchStudents()); }, [dispatch]);

    /* handlers */
    const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(0);
    };

    const onFilter = (e: SelectChangeEvent) => {
        setFilter(e.target.value);
        setPage(0);
    };

    const onSort = (field: keyof typeof labels) => {
        if (field === sortBy) {
            setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    /* transform data */
    const filtered = useMemo(() => {
        const txt = search.toLowerCase();
        return students.filter((s) => {
            const { surname, name, patronymic } = s.person;
            const matchTxt =
                surname.toLowerCase().includes(txt) ||
                name.toLowerCase().includes(txt) ||
                patronymic.toLowerCase().includes(txt);
            const matchForm = filter === 'ALL' || s.financialForm === filter;
            return matchTxt && matchForm;
        });
    }, [students, search, filter]);

    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            const aVal = a.person[sortBy as any] ?? (a as any)[sortBy];
            const bVal = b.person[sortBy as any] ?? (b as any)[sortBy];
            const va   = typeof aVal === 'string' ? aVal.toLowerCase() : aVal;
            const vb   = typeof bVal === 'string' ? bVal.toLowerCase() : bVal;
            if (va < vb) return sortOrder === 'asc' ? -1 : 1;
            if (va > vb) return sortOrder === 'asc' ?  1 : -1;
            return 0;
        });
    }, [filtered, sortBy, sortOrder]);

    const pageData = useMemo(() => {
        const start = page * rowsPerPage;
        return sorted.slice(start, start + rowsPerPage);
    }, [sorted, page, rowsPerPage]);

    /* loading state */
    if (status === 'loading') {
        return (
            <Box display="flex" justifyContent="center" mt={10}>
                <CircularProgress size={48} />
            </Box>
        );
    }
    return (
        <AnimatedTableShell
            title="Список студентов"
            actionLabel="ДОБАВИТЬ СТУДЕНТА"
            onAction={() => navigate('/students/create')}
        >
            {/* toolbar */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    mb: 3,
                }}
            >
                <TextField
                    label="Поиск (ФИО)"
                    value={search}
                    onChange={onSearch}
                    fullWidth
                />
                <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel>Форма обучения</InputLabel>
                    <Select value={filter} label="Форма обучения" onChange={onFilter}>
                        {financialOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            {/* table */}
            <TableContainer sx={{ maxHeight: 540 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {columns.map((col) => (
                                <TableCell key={col.field}>
                                    <TableSortLabel
                                        active={sortBy === col.field}
                                        direction={sortOrder}
                                        onClick={() => onSort(col.field)}
                                    >
                                        {labels[col.labelKey]}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {pageData.map((s) => (
                            <TableRow
                                key={s.id}
                                hover
                                sx={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/students/${s.id}`)}
                            >
                                <TableCell>{s.person.surname}</TableCell>
                                <TableCell>{s.person.name}</TableCell>
                                <TableCell>{s.person.patronymic}</TableCell>
                                <TableCell>{s.person.phone}</TableCell>
                                <TableCell>{s.yearStarted}</TableCell>
                                <TableCell>{formRU[s.financialForm]}</TableCell>
                            </TableRow>
                        ))}

                        {pageData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    <Typography variant="body2" sx={{ py: 4 }}>
                                        Студенты не найдены 😕
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* pagination */}
            <TablePagination
                component="div"
                count={sorted.length}
                page={page}
                onPageChange={(_, p) => setPage(p)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                    setRowsPerPage(+e.target.value);
                    setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </AnimatedTableShell>
    );
};

export default StudentTable;
