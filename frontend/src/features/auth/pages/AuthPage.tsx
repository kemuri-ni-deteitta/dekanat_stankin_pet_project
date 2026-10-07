import React, { useState } from 'react';
import {
    Box,
    CssBaseline,
    Paper,
    Tabs,
    Tab,
    Typography,
    Stack,
} from '@mui/material';
import LoginForm from "../components/LoginForm.tsx";
import RegisterForm from "../components/RegisterForm.tsx";

export default function AuthPage() {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
    };

    return (
        <>
            <CssBaseline />
            <Stack
                minHeight="100vh"
                alignItems="center"
                justifyContent="center"
            >
                {/* Оформление вынесено сюда */}
                <Paper elevation={3} sx={{ width: 400, p: 4 }}>
                    <Typography variant="h4" textAlign="center" mb={2}>
                        Добро пожаловать
                    </Typography>
                    <Tabs value={tabIndex} onChange={handleTabChange} centered>
                        <Tab label="Вход" />
                        <Tab label="Регистрация" />
                    </Tabs>
                    <Box mt={3}>
                        {tabIndex === 0 ? <LoginForm /> : <RegisterForm />}
                    </Box>
                </Paper>
            </Stack>
        </>
    );
}
