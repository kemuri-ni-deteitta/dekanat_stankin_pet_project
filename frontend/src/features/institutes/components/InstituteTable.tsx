/* --------------------------------------------------------------------
   InstituteTable.tsx – modern table with inline “Добавить институт”
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

import AnimatedTableShell from '../../../components/AnimatedTableShell';
import { fetchInstitutes } from '../instituteSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';

/* ───────── helpers & constants ───────── */
type SortOrder = 'asc' | 'desc';

const labels: Record<'email' | 'name' | 'phone', string> = {
    email: 'E-mail',
    name: 'Название',
    phone: 'Телефон',
};

const columns = (Object.keys(labels) as (keyof typeof labels)[]).map((f) => ({
    field: f,
    label: labels[f],
}));

/* ───────── component ───────── */
const InstituteTable: React.FC = () => {
    const dispatch  = useAppDispatch();
    const navigate  = useNavigate();
    const { institutes, status } = useAppSelector((s) => s.institutes);

    /* ui state */
    const [search,      setSearch]      = useState('');
    const [sortBy,      setSortBy]      = useState<keyof typeof labels>('name');
    const [sortOrder,   setSortOrder]   = useState<SortOrder>('asc');
    const [page,        setPage]        = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    /* fetch once */
    useEffect(() => { dispatch(fetchInstitutes()); }, [dispatch]);

    /* transforms */
    const filtered = useMemo(() => {
        const txt = search.toLowerCase();
        return institutes.filter((i) =>
            i.name.toLowerCase().includes(txt) ||
            i.email.toLowerCase().includes(txt) ||
            i.phone.toLowerCase().includes(txt)
        );
    }, [institutes, search]);

    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            const av = (a as any)[sortBy] as string;
            const bv = (b as any)[sortBy] as string;
            return sortOrder === 'asc'
                ? av.localeCompare(bv, 'ru')
                : bv.localeCompare(av, 'ru');
        });
    }, [filtered, sortBy, sortOrder]);

    const pageData = useMemo(() => {
        const start = page * rowsPerPage;
        return sorted.slice(start, start + rowsPerPage);
    }, [sorted, page, rowsPerPage]);

    /* loading */
    if (status === 'loading') {
        return (
            <Box display="flex" justifyContent="center" mt={10}>
                <CircularProgress size={48} />
            </Box>
        );
    }

    /* ───────── render ───────── */
    return (
        <AnimatedTableShell
            title="Список институтов"
            actionLabel="ДОБАВИТЬ ИНСТИТУТ"
            onAction={() => navigate('/institutes/create')}
        >
            {/* search */}
            <TextField
                label="Поиск (название / e-mail / телефон)"
                value={search}
                onChange={(e) => {
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
                            {columns.map((c) => (
                                <TableCell key={c.field}>
                                    <TableSortLabel
                                        active={sortBy === c.field}
                                        direction={sortOrder}
                                        onClick={() => {
                                            if (sortBy === c.field) {
                                                setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
                                            } else {
                                                setSortBy(c.field);
                                                setSortOrder('asc');
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
                        {pageData.map((i) => (
                            <TableRow
                                key={i.id}
                                hover
                                sx={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/institutes/${i.id}`)}
                            >
                                <TableCell>{i.email}</TableCell>
                                <TableCell>{i.name}</TableCell>
                                <TableCell>{i.phone}</TableCell>
                            </TableRow>
                        ))}

                        {pageData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    <Typography variant="body2" sx={{ py: 4 }}>
                                        Институты не найдены ☹️
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

export default InstituteTable;
