/* -----------------------------------------------------------------------
   AnimatedTableShell.tsx
   Glass-morphism wrapper for tables / data views
   -------------------------------------------------------------------- */

import React, { ReactNode } from 'react';
import {
    Box,
    Button,
    Paper,
    Typography,
    useTheme,
    SxProps,
    Theme,
} from '@mui/material';
import { motion } from 'framer-motion';

/* ───────────── props ───────────── */
interface AnimatedTableShellProps {
    /** Optional title shown on the left */
    title?: string;
    /** Main content – usually a table */
    children: ReactNode;
    /** Caption of the blue “action” button (right-aligned) */
    actionLabel?: string;
    /** Click-handler for the action button */
    onAction?: () => void;
    /** Card max-width (default = 1100) – can be number or breakpoint key */
    maxWidth?: number | string;
    /** MUI elevation (default = 10) */
    elevation?: number;
    /** Paper padding (default = { xs:2, sm:3 }) */
    padding?: SxProps<Theme>;
}

const AnimatedTableShell: React.FC<AnimatedTableShellProps> = ({
                                                                   title,
                                                                   children,
                                                                   actionLabel,
                                                                   onAction,
                                                                   maxWidth   = 1100,
                                                                   elevation  = 10,
                                                                   padding    = { xs: 2, sm: 3 },
                                                               }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                position: 'relative',
                minHeight: '50vh',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                px: 2,
            }}
        >
            {/* blurred gradient backdrop */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background:
                        theme.palette.mode === 'dark'
                            ? 'linear-gradient(120deg,#1e2746 0%,#111827 100%)'
                            : 'linear-gradient(120deg,#dfe9f3 0%,#ffffff 100%)',
                    filter: 'blur(8px)',
                    transform: 'scale(1.1)',
                    zIndex: -1,
                }}
            />

            {/* animated card */}
            <motion.div
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45 }}
                style={{ width: '100%', maxWidth }}
            >
                <Paper
                    elevation={elevation}
                    sx={{
                        borderRadius: 4,
                        backdropFilter: 'blur(4px)',
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        p: padding,
                    }}
                >
                    {(title || actionLabel) && (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 3,
                                gap: 2,
                                flexWrap: 'wrap',
                            }}
                        >
                            {title && (
                                <Typography variant="h5" component="h2">
                                    {title}
                                </Typography>
                            )}
                            {actionLabel && (
                                <Button variant="contained" onClick={onAction} sx={{ ml: 'auto' }}>
                                    {actionLabel}
                                </Button>
                            )}
                        </Box>
                    )}

                    {children}
                </Paper>
            </motion.div>
        </Box>
    );
};

export default AnimatedTableShell;
