import { register, login } from '../authSlice';
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
import { useAppDispatch } from "../../../hooks/useAppDispatch.ts";
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        
        try {
            const registerResult = await dispatch(register({ email, password })).unwrap();
            console.log('Регистрация успешна:', registerResult);

            const loginResult = await dispatch(login({ email, password })).unwrap();
            console.log('Логин успешен:', loginResult);

            navigate('/');
        } catch (error) {
            console.error('Ошибка при регистрации или логине:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'background.default',
                p: 2
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    width: '100%',
                    maxWidth: 450,
                    borderRadius: 2
                }}
            >
                <Typography 
                    variant="h5" 
                    component="h1" 
                    align="center" 
                    gutterBottom 
                    sx={{ 
                        mb: 3, 
                        fontWeight: 'medium',
                        color: 'primary.main'
                    }}
                >
                    Регистрация
                </Typography>
                
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3
                    }}
                >
                    <FormControl fullWidth>
                        <FormLabel sx={{ mb: 1, fontWeight: 'medium', color: 'text.primary' }}>
                            Электронная почта
                        </FormLabel>
                        <TextField
                            name="email"
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            variant="outlined"
                            size="medium"
                            placeholder="example@example.com"
                            InputProps={{
                                sx: { borderRadius: 2 }
                            }}
                        />
                    </FormControl>

                    <FormControl fullWidth>
                        <FormLabel sx={{ mb: 1, fontWeight: 'medium', color: 'text.primary' }}>
                            Пароль
                        </FormLabel>
                        <TextField
                            name="password"
                            required
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            variant="outlined"
                            size="medium"
                            placeholder="Не менее 6 символов"
                            InputProps={{
                                sx: { borderRadius: 2 },
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
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
                        sx={{
                            mt: 2,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 'medium',
                            bgcolor: 'primary.main',
                            '&:hover': {
                                bgcolor: 'primary.dark'
                            }
                        }}
                    >
                        {isLoading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Зарегистрироваться'
                        )}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}