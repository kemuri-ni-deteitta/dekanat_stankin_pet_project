import {
    AppBar,
    Box,
    Toolbar,
    Button,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from 'react-router-dom';
import { logoutApi } from '../../features/auth/authSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useEffect, useState } from 'react';

export default function SidebarWithDropdown() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.auth.user);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const toggleDrawer = (open: boolean) => () => {
        setDrawerOpen(open);
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await dispatch(logoutApi()).unwrap();
            navigate('/auth');
        } catch (error) {
            console.error('Ошибка выхода:', error);
        }
        handleClose();
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    {user && (
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer(true)}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Добро пожаловать{user ? `, ${user.name}` : ''}
                    </Typography>
                    {user ? (
                        <div>
                            <IconButton
                                size="large"
                                edge="end"
                                color="inherit"
                                onClick={handleMenu}
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                            >
                                {user.roles.includes('ADMIN') && (
                                    <MenuItem
                                        onClick={handleClose}
                                        component={Link}
                                        to="/admin"
                                    >
                                        Панель администратора
                                    </MenuItem>
                                )}
                                <MenuItem onClick={handleLogout}>Выйти</MenuItem>
                            </Menu>
                        </div>
                    ) : (
                        <Button color="inherit" component={Link} to="/auth">
                            Войти
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <List>
                        <ListItem button component={Link} to="/">
                            <ListItemText primary="Главная" />
                        </ListItem>
                        <ListItem button component={Link} to="/profile">
                            <ListItemText primary="Профиль" />
                        </ListItem>
                        {user?.roles.includes('ADMIN') && (
                            <ListItem button component={Link} to="/admin">
                                <ListItemText primary="Админка" />
                            </ListItem>
                        )}
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
}
