import {
    Button,
    TextField,
    FormControl,
    FormLabel,
    Box,
    Typography,
    Paper,
    InputAdornment,
    IconButton,
    CircularProgress
} from '@mui/material';
import React, { useState } from 'react';
import { login } from '../authSlice.ts';
import { useAppDispatch } from "../../../hooks/useAppDispatch.ts";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function LoginForm() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            const resultAction = await dispatch(login({ email, password }));
            if (login.fulfilled.match(resultAction)) {
                navigate('/');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 450, borderRadius: 2 }}>
                <Typography variant="h5" component="h1" align="center" gutterBottom sx={{ mb: 3 }}>
                    Вход в систему
                </Typography>
                
                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <FormControl fullWidth>
                        <FormLabel sx={{ mb: 1 }}>Почта</FormLabel>
                        <TextField
                            name="email"
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            variant="outlined"
                            placeholder="example@mail.com"
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <FormLabel sx={{ mb: 1 }}>Пароль</FormLabel>
                        <TextField
                            name="password"
                            required
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            variant="outlined"
                            placeholder="Введите пароль"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleClickShowPassword} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </FormControl>

                    <Button
                        variant="contained"
                        type="submit"
                        size="large"
                        disabled={isLoading}
                        sx={{ mt: 2, py: 1.5 }}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Войти'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}