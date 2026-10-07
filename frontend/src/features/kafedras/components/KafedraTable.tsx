/* --------------------------------------------------------------------
   KafedraTable.tsx – кафедры with “Добавить кафедру” action button
   ------------------------------------------------------------------ */

import React, { useEffect, useMemo, useState } from 'react';
import {
    Badge,
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
import { fetchKafedras } from '../kafedraSlice';
import { fetchInstitutes } from '../../institutes/instituteSlice';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';

/* ───────── helpers & constants ───────── */
type SortOrder = 'asc' | 'desc';

const labels: Record<'name' | 'email' | 'room' | 'phone', string> = {
    name:  'Название',
    email: 'E-mail',
    room:  'Кабинет',
    phone: 'Телефон',
};

const columns = (Object.keys(labels) as (keyof typeof labels)[]).map(k => ({
    field: k,
    label: labels[k],
}));

/* ─────────── component ─────────── */
const KafedraTable: React.FC = () => {
    const dispatch   = useAppDispatch();
    const navigate   = useNavigate();
    const { kafedras, status }   = useAppSelector(s => s.kafedras);
    const { institutes }         = useAppSelector(s => s.institutes);

    /* ui state */
    const [search, setSearch]       = useState('');
    const [sortBy, setSortBy]       = useState<keyof typeof labels>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [page, setPage]           = useState(0);
    const [rowsPerPage, setRows]    = useState(10);

    /* fetch data */
    useEffect(() => {
        dispatch(fetchKafedras());
        dispatch(fetchInstitutes());
    }, [dispatch]);

    /* helpers */
    const getInstituteName = (id: number) =>
        institutes.find(i => i.id === id)?.name ?? 'Не указан';

    /* transforms */
    const filtered = useMemo(() => {
        const txt = search.toLowerCase();
        return kafedras.filter(k =>
            [k.name, k.email, k.room, k.phone].some(v => v.toLowerCase().includes(txt)),
        );
    }, [kafedras, search]);

    const sorted = useMemo(() => {
        const arr = [...filtered];
        arr.sort((a, b) => {
            const av = (a as any)[sortBy].toString().toLowerCase();
            const bv = (b as any)[sortBy].toString().toLowerCase();
            if (av < bv) return sortOrder === 'asc' ? -1 : 1;
            if (av > bv) return sortOrder === 'asc' ? 1  : -1;
            return 0;
        });
        return arr;
    }, [filtered, sortBy, sortOrder]);

    const pageData = useMemo(() => {
        const start = page * rowsPerPage;
        return sorted.slice(start, start + rowsPerPage);
    }, [sorted, page, rowsPerPage]);

    /* loading */
    if (status === 'loading')
        return (
            <Box display="flex" justifyContent="center" mt={10}>
                <CircularProgress size={48} />
            </Box>
        );

    /* ───────── render ───────── */
    return (
        <AnimatedTableShell
            title="Список кафедр"
            actionLabel="ДОБАВИТЬ КАФЕДРУ"
            onAction={() => navigate('/kafedras/create')}
        >
            {/* search */}
            <TextField
                label="Поиск (название / e-mail / кабинет / телефон)"
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
                                        onClick={() =>
                                            c.field === sortBy
                                                ? setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'))
                                                : (setSortBy(c.field), setSortOrder('asc'))
                                        }
                                    >
                                        {c.label}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            <TableCell>Уч. данные</TableCell>
                            <TableCell>Институт</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {pageData.map(k => (
                            <TableRow
                                key={k.id}
                                hover
                                sx={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/kafedras/${k.id}`)}
                            >
                                <TableCell>{k.name}</TableCell>
                                <TableCell>{k.email}</TableCell>
                                <TableCell>{k.room}</TableCell>
                                <TableCell>{k.phone}</TableCell>
                                <TableCell align="center">
                                    <Badge
                                        color={k.credentialsNonExpired ? 'success' : 'error'}
                                        badgeContent={k.credentialsNonExpired ? 'Активен' : 'Истёк'}
                                    />
                                </TableCell>
                                <TableCell>{getInstituteName(k.instituteId)}</TableCell>
                            </TableRow>
                        ))}

                        {pageData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={columns.length + 2} align="center">
                                    <Typography variant="body2" sx={{ py: 4 }}>
                                        Кафедры не найдены 😕
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
                onRowsPerPageChange={e => {
                    setRows(+e.target.value);
                    setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25]}
            />
        </AnimatedTableShell>
    );
};

export default KafedraTable;
