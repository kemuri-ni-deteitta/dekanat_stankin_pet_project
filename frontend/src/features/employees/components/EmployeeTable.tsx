/* --------------------------------------------------------------------
   EmployeeTable.tsx
   ------------------------------------------------------------------ */

import React, { useEffect, useMemo, useState } from 'react';
import {
    Box,
    CircularProgress,
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

import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { fetchKafedras } from '../../kafedras/kafedraSlice';
import { fetchEmployees } from '../employeeSlice';
import AnimatedTableShell from '../../../components/AnimatedTableShell';


/* ───────── helpers & constants ───────── */
type SortOrder = 'asc' | 'desc';

const columns = [
    { field: 'surname', label: 'Фамилия' },
    { field: 'name', label: 'Имя' },
    { field: 'patronymic', label: 'Отчество' },
    { field: 'phone', label: 'Телефон' },
    { field: 'jobTitle', label: 'Должность' },
    { field: 'kafedraName', label: 'Кафедра' },
    { field: 'active', label: 'Уч. данные' },
] as const;

/* ───────────── component ───────────── */
const EmployeeTable: React.FC = () => {
    const dispatch  = useAppDispatch();
    const navigate   = useNavigate();
    const { employees, status } = useAppSelector(s => s.employees);
    const { kafedras           } = useAppSelector(s => s.kafedras);

    /* ui state */
    const [search, setSearch]     = useState('');
    const [sortBy, setSortBy]     = useState<(typeof columns)[number]['field']>('surname');
    const [sortOrder, setOrder]   = useState<SortOrder>('asc');
    const [page, setPage]         = useState(0);
    const [rows, setRows]         = useState(10);

    /* fetch once */
    useEffect(() => {
        dispatch(fetchEmployees());
        dispatch(fetchKafedras());
    }, [dispatch]);

    const getKafedraName = (id: number) =>
        kafedras.find(k => k.id === id)?.name ?? '—';

    /* filter + sort + paginate */
    const filtered = useMemo(() => {
        const txt = search.toLowerCase();
        return employees.filter(e => {
            const fio = `${e.person.surname} ${e.person.name} ${e.person.patronymic}`.toLowerCase();
            return (
                fio.includes(txt) ||
                e.phone.includes(txt) ||
                e.jobTitle.toLowerCase().includes(txt) ||
                getKafedraName(e.kafedraId).toLowerCase().includes(txt)
            );
        });
    }, [employees, search, kafedras]);

    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            const av =
                sortBy === 'kafedraName'
                    ? getKafedraName(a.kafedraId)
                    : (a as any)[sortBy] ?? a.person?.[sortBy];
            const bv =
                sortBy === 'kafedraName'
                    ? getKafedraName(b.kafedraId)
                    : (b as any)[sortBy] ?? b.person?.[sortBy];

            return sortOrder === 'asc'
                ? String(av).localeCompare(String(bv), 'ru')
                : String(bv).localeCompare(String(av), 'ru');
        });
    }, [filtered, sortBy, sortOrder]);

    const pageData = useMemo(() => {
        const start = page * rows;
        return sorted.slice(start, start + rows);
    }, [sorted, page, rows]);

    /* loading */
    if (status === 'loading') {
        return (
            <Box display="flex" justifyContent="center" mt={10}>
                <CircularProgress size={48} />
            </Box>
        );
    }

    /* ─────────── render ─────────── */
    return (
        <AnimatedTableShell
            title="Сотрудники"
            actionLabel="ДОБАВИТЬ СОТРУДНИКА"
            onAction={() => navigate('/employees/new')}
        >
            {/* search */}
            <TextField
                placeholder="Поиск (ФИО / телефон / должность / кафедра)"
                value={search}
                onChange={e => {
                    setSearch(e.target.value);
                    setPage(0);
                }}
                fullWidth
                sx={{ mb: 3 }}
            />

            {/* table */}
            <TableContainer sx={{ maxHeight: 540 }}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            {columns.map(c => (
                                <TableCell key={c.field}>
                                    <TableSortLabel
                                        active={sortBy === c.field}
                                        direction={sortOrder}
                                        onClick={() => {
                                            if (sortBy === c.field) {
                                                setOrder(p => (p === 'asc' ? 'desc' : 'asc'));
                                            } else {
                                                setSortBy(c.field);
                                                setOrder('asc');
                                            }
                                        }}
                                    >
                                        {c.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {pageData.map(e => (
                            <TableRow
                                key={e.id}
                                hover
                                sx={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/employees/${e.id}`)}
                            >
                                <TableCell>{e.person.surname}</TableCell>
                                <TableCell>{e.person.name}</TableCell>
                                <TableCell>{e.person.patronymic}</TableCell>
                                <TableCell>{e.phone}</TableCell>
                                <TableCell>{e.jobTitle}</TableCell>
                                <TableCell>{getKafedraName(e.kafedraId)}</TableCell>
                                <TableCell>{e.credentialsNonExpired ? '✔️' : '—'}</TableCell>
                            </TableRow>
                        ))}

                        {pageData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    <Typography variant="body2" sx={{ py: 4 }}>
                                        Сотрудники не найдены 😕
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
                rowsPerPage={rows}
                onRowsPerPageChange={e => {
                    setRows(+e.target.value);
                    setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </AnimatedTableShell>
    );
};

export default EmployeeTable;
