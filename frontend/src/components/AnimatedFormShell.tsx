/* -----------------------------------------------------------------------
   AnimatedFormShell
   A reusable, animated card with a blurred gradient background.
   -------------------------------------------------------------------- */

import React, { PropsWithChildren } from 'react';
import { Box, Card, Typography } from '@mui/material';
import { motion } from 'framer-motion';

type Props = PropsWithChildren<{
    title: string;
    maxWidth?: number;               // default = 520 px
}>;

const AnimatedFormShell: React.FC<Props> = ({
                                                title,
                                                maxWidth = 520,
                                                children,
                                            }) => (
    <Box
        sx={{
            position: 'relative',
            minHeight: '85vh',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
        }}
    >
        {/* blurred pastel background */}
        <Box
            sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(120deg,#dfe9f3 0%,#ffffff 100%)',
                filter: 'blur(8px)',
                transform: 'scale(1.1)',
                zIndex: -1,
            }}
        />

        {/* entrance animation */}
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.45 }}
            style={{ width: '100%', maxWidth }}
        >
            <Card
                elevation={8}
                sx={{
                    backdropFilter: 'blur(4px)',
                    backgroundColor: 'rgba(255,255,255,0.75)',
                    borderRadius: 4,
                    p: { xs: 2, sm: 3 },
                }}
            >
                <Typography variant="h5" align="center" gutterBottom>
                    {title}
                </Typography>

                {children}
            </Card>
        </motion.div>
    </Box>
);

export default AnimatedFormShell;
