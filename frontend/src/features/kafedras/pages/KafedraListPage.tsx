/* --------------------------------------------------------------------
   KafedraListPage.tsx – lean page that only shows the table
   ------------------------------------------------------------------ */

import React from 'react';
import { Box, Typography } from '@mui/material';
import KafedraTable from '../components/KafedraTable';

const KafedraListPage: React.FC = () => (
    <Box>
        {/* top heading kept for consistency with other sections */}
        <Typography variant="h3" mb={4}>
            Кафедры
        </Typography>

        {/* the table now contains its own “Добавить кафедру” button */}
        <KafedraTable />
    </Box>
);

export default KafedraListPage;
