import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Toolbar,
    Box,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    FolderOpen as FolderOpenIcon,
    Description as DescriptionIcon,
    People as PeopleIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
    drawerWidth: number;
    open: boolean;
    onClose: () => void;
}

interface MenuItem {
    text: string;
    icon: React.ReactElement;
    path: string;
    roles?: number[]; // Si no se especifica, está disponible para todos
}

const menuItems: MenuItem[] = [
    {
        text: 'Dashboard',
        icon: <DashboardIcon />,
        path: '/dashboard',
    },
    {
        text: 'Expedientes',
        icon: <FolderOpenIcon />,
        path: '/case-files',
    },
    {
        text: 'Evidencias',
        icon: <DescriptionIcon />,
        path: '/case-files', // Redirecciona a expedientes
    },
    {
        text: 'Usuarios',
        icon: <PeopleIcon />,
        path: '/users',
        roles: [ 1 ], // Solo administradores
    },
];

const Sidebar: React.FC<SidebarProps> = ({ drawerWidth, open, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    const isMenuItemVisible = (item: MenuItem): boolean => {
        if (!item.roles) return true; // Visible para todos
        return user?.roleId ? item.roles.includes(user.roleId) : false;
    };

    const drawer = (
        <>
            <Toolbar>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        py: 1,
                    }}
                >
                    <DescriptionIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                </Box>
            </Toolbar>
            <Divider />
            <List>
                {menuItems
                    .filter(isMenuItemVisible)
                    .map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                selected={location.pathname === item.path}
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: 'primary.light',
                                        '&:hover': {
                                            backgroundColor: 'primary.light',
                                        },
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: location.pathname === item.path ? 'primary.main' : 'inherit',
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
            </List>
        </>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { sm: open ? drawerWidth : 0 }, flexShrink: { sm: 0 } }}
        >
            <Drawer
                variant="temporary"
                open={open}
                onClose={onClose}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                    },
                }}
            >
                {drawer}
            </Drawer>
            <Drawer
                variant="persistent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                    },
                }}
                open={open}
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

export default Sidebar;
