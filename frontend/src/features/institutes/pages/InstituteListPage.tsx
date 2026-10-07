/* -----------------------------------------------------------------------
   InstituteListPage.tsx  –  «витринный» список институтов
   -------------------------------------------------------------------- */
import React, { useEffect } from 'react';
import {
    Alert,
    Box,
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Grid,
    IconButton,
    Tooltip,
    Typography,
} from '@mui/material';
import MailIcon      from '@mui/icons-material/EmailOutlined';
import PhoneIcon     from '@mui/icons-material/LocalPhoneOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { motion }    from 'framer-motion';

import { fetchInstitutes } from '../instituteSlice';
import { useAppDispatch }  from '../../../hooks/useAppDispatch';
import { useAppSelector }  from '../../../hooks/useAppSelector';

/* анимация «появление снизу + fade» */
const cardVariants = {
    hidden : { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity   : 1,
        y         : 0,
        transition: { delay: i * 0.05 },
    }),
};

const InstituteListPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const { institutes, status, error } = useAppSelector(s => s.institutes);

    useEffect(() => { dispatch(fetchInstitutes()); }, [dispatch]);

    /* ---------- loading / error ---------- */
    if (status === 'loading') {
        return (
            <Box display="flex" justifyContent="center" mt={10}>
                <CircularProgress size={56} />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error" sx={{ mt: 6 }}>{error}</Alert>;
    }

    /* ---------------- render ---------------- */
    return (
        <Box
            sx={{
                position: 'relative',
                minHeight: '100vh',
                overflow : 'hidden',
                py: { xs: 4, md: 6 },
                px: 2,
            }}
        >
            {/* мягкий градиентный фон */}
            <Box
                sx={{
                    position: 'absolute',
                    inset   : 0,
                    background: 'linear-gradient(120deg,#dfe9f3 0%,#ffffff 100%)',
                    filter  : 'blur(8px)',
                    zIndex  : -1,
                }}
            />

            {/* заголовок страницы */}
            <Typography variant="h4" fontWeight={700} mb={{ xs: 3, md: 4 }}>
                Институты
            </Typography>

            {/* карточки */}
            <Grid container spacing={{ xs: 2.5, md: 3 }} justifyContent="flex-start">
                {institutes.map((inst, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={inst.id}>
                        <motion.div
                            custom={idx}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover={{ scale: 1.03 }}
                        >
                            <Card
                                elevation={6}
                                sx={{
                                    borderRadius    : 4,
                                    backdropFilter  : 'blur(3px)',
                                    backgroundColor : 'rgba(255,255,255,0.85)',
                                }}
                            >
                                <CardHeader
                                    title={inst.name}
                                    titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
                                    sx={{ pb: 0.5 }}
                                    action={
                                        <Tooltip title="Написать письмо">
                                            <IconButton
                                                size="small"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    window.open(`mailto:${inst.email}`, '_blank');
                                                }}
                                            >
                                                <OpenInNewIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    }
                                />

                                <CardContent sx={{ pt: 1.5 }}>
                                    <Box display="flex" alignItems="center" mb={1}>
                                        <MailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography
                                            component="a"
                                            href={`mailto:${inst.email}`}
                                            variant="body2"
                                            sx={{
                                                textDecoration: 'none',
                                                color: 'text.primary',
                                                wordBreak: 'break-all',
                                                '&:hover': { textDecoration: 'underline' },
                                            }}
                                        >
                                            {inst.email}
                                        </Typography>
                                    </Box>

                                    <Box display="flex" alignItems="center">
                                        <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body2">{inst.phone}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </Grid>
                ))}

                {institutes.length === 0 && (
                    <Grid item xs={12}>
                        <Typography variant="h6" textAlign="center" sx={{ opacity: 0.6, py: 8 }}>
                            Институты не найдены 😕
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default InstituteListPage;
