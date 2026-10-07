import React, { useState } from 'react';
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
  Box,
  Menu,
  MenuItem,
  Typography,
  useTheme,
  useMediaQuery,
  Button,
  alpha,
  styled,
  Stack,
  Avatar,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { logoutApi } from '../../features/auth/authSlice';

interface SidebarSubItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  roles?: string[];
}

interface SidebarItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  subItems?: SidebarSubItem[];
  roles?: string[];
}

interface SidebarProps {
  items: SidebarItem[];
  width?: number;
}

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
    boxShadow: theme.shadows[3],
    background: theme.palette.background.default,
    borderRight: 'none',
  },
}));

const NavItem = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1, 2),
  margin: theme.spacing(0.5, 1.5),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
  '&.active': {
    backgroundColor: alpha(theme.palette.primary.main, 0.12),
    '& .MuiListItemText-primary': {
      fontWeight: theme.typography.fontWeightMedium,
    },
  },
}));

const SubNavItem = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  paddingLeft: theme.spacing(5),
  margin: theme.spacing(0.5, 1.5),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
  '&.active': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
}));

const Sidebar: React.FC<SidebarProps> = ({ items, width = 260 }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.auth.user);
  const userRoles = user?.roles || [];

  const toggleDrawer = () => setMobileOpen(!mobileOpen);
  const toggleSubmenu = (label: string) => {
    setOpenItems(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const hasAccess = (itemRoles?: unknown) => {
    if (!Array.isArray(itemRoles) || itemRoles.length === 0) return true;
    return itemRoles.some(role => userRoles.includes(role));
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
      console.error('Logout error:', error);
    }
    handleClose();
  };

  const drawerContent = (
    <Box 
      display="flex" 
      flexDirection="column" 
      height="100%"
      sx={{
        background: theme.palette.background.paper,
      }}
    >
      {/* Header */}
      <Box 
        px={2} 
        py={1.5} 
        display="flex" 
        alignItems="center" 
        justifyContent="space-between"
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Виртуальный деканат
        </Typography>
        {!isDesktop && (
          <IconButton onClick={toggleDrawer} size="small">
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* Navigation */}
      <Box flexGrow={1} sx={{ overflowY: 'auto', py: 1 }}>
        <List disablePadding>
          {items.filter(hasAccess).map((item, index) => (
            <React.Fragment key={index}>
              {item.subItems ? (
                <>
                  <NavItem onClick={() => toggleSubmenu(item.label)}>
                    {item.icon && (
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {item.icon}
                      </ListItemIcon>
                    )}
                    <ListItemText 
                      primary={item.label} 
                      primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: 'medium',
                      }}
                    />
                    {openItems[item.label] ? (
                      <ExpandLessIcon fontSize="small" />
                    ) : (
                      <ExpandMoreIcon fontSize="small" />
                    )}
                  </NavItem>
                  <Collapse in={openItems[item.label]} timeout="auto" unmountOnExit>
                    <List disablePadding>
                      {item.subItems.filter(hasAccess).map((subItem, subIndex) => (
                        <SubNavItem
                          key={subIndex}
                          component={RouterLink}
                          to={subItem.href!}
                        >
                          {subItem.icon && (
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {subItem.icon}
                            </ListItemIcon>
                          )}
                          <ListItemText 
                            primary={subItem.label} 
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </SubNavItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
                <NavItem 
                  component={RouterLink} 
                  to={item.href!}
                >
                  {item.icon && (
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {item.icon}
                    </ListItemIcon>
                  )}
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: 'medium',
                    }}
                  />
                </NavItem>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* User Profile */}
      <Box 
        p={2} 
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          background: alpha(theme.palette.background.default, 0.6),
        }}
      >
        {user ? (
          <Box>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                }}
              >
                {user.email.charAt(0).toUpperCase()}
              </Avatar>
              <Box flexGrow={1} minWidth={0}>
                <Typography 
                  variant="subtitle2" 
                  fontWeight={500}
                  noWrap
                >
                  {user.email}
                </Typography>
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  noWrap
                >
                  {user.roles.join(', ')}
                </Typography>
              </Box>
              <Tooltip title="Account settings">
                <IconButton 
                  size="small" 
                  onClick={handleMenu}
                  sx={{
                    '&:hover': {
                      background: alpha(theme.palette.primary.main, 0.1),
                    }
                  }}
                >
                  <ExpandMoreIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
            <Menu 
              anchorEl={anchorEl} 
              open={Boolean(anchorEl)} 
              onClose={handleClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              PaperProps={{
                elevation: 3,
                sx: {
                  minWidth: 200,
                  borderRadius: 2,
                  mt: 1,
                  py: 0.5,
                }
              }}
            >
              {user.roles.includes('ADMIN') && (
                <MenuItem 
                  onClick={handleClose} 
                  component={RouterLink} 
                  to="/admin"
                  sx={{ py: 1 }}
                >
                  Admin Panel
                </MenuItem>
              )}
              <MenuItem 
                onClick={handleLogout}
                sx={{ 
                  py: 1,
                  color: theme.palette.error.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.error.main, 0.08),
                  }
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Button 
            fullWidth 
            variant="contained" 
            component={RouterLink} 
            to="/auth"
            size="small"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500,
              py: 1,
            }}
          >
            Войти
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      {!isDesktop && (
        <IconButton 
          onClick={toggleDrawer} 
          sx={{ 
            position: 'fixed',
            top: 12,
            left: 12,
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: theme.palette.background.paper,
            boxShadow: theme.shadows[2],
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            }
          }}
        >
          <MenuIcon />
        </IconButton>
      )}
      <StyledDrawer
        variant={isDesktop ? 'permanent' : 'temporary'}
        open={isDesktop || mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{
          keepMounted: true,
          BackdropProps: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)',
            }
          }
        }}
        PaperProps={{
          sx: {
            width,
            boxSizing: 'border-box',
          }
        }}
      >
        {drawerContent}
      </StyledDrawer>
    </>
  );
};

export default Sidebar;