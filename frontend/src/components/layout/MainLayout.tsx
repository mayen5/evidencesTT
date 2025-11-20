import React, { useState } from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar.tsx';
import Sidebar from './Sidebar.tsx';

interface MainLayoutProps {
    children: React.ReactNode;
}

const DRAWER_WIDTH = 240;

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const [ sidebarOpen, setSidebarOpen ] = useState(true);

    const handleDrawerToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5', width: '100vw' }}>
            <Navbar drawerWidth={DRAWER_WIDTH} onMenuClick={handleDrawerToggle} open={sidebarOpen} />
            <Sidebar drawerWidth={DRAWER_WIDTH} open={sidebarOpen} onClose={handleDrawerToggle} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    marginTop: '64px',
                    minHeight: 'calc(100vh - 64px)',
                    overflow: 'auto',
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default MainLayout;
