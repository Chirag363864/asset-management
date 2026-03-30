import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  ListItemIcon
} from '@mui/material';
import { 
  AccountCircle, 
  LightMode, 
  DarkMode,
  Settings,
  Logout as LogoutIcon,
  TrendingUp
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import styles from '../styles/ui.module.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isRotating, setIsRotating] = React.useState(false);

  const handleThemeToggle = () => {
    setIsRotating(true);
    toggleTheme();
    setTimeout(() => setIsRotating(false), 600);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleClose();
  };

  return (
    <AppBar position="sticky" color="transparent" elevation={0} className={styles.navbar}>
      <Toolbar className={styles.navbarInner}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer', fontWeight: 700 }} onClick={() => navigate('/')}>
          FinanceAdvisor
        </Typography>
        
        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              color="inherit"
              onClick={() => navigate('/dashboard')}
              sx={{ 
                color: location.pathname === '/dashboard' ? 'primary.main' : 'text.primary',
                bgcolor: location.pathname === '/dashboard' ? 'rgba(25,118,210,0.08)' : 'transparent',
                borderRadius: 2
              }}
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/portfolio')}
              sx={{ 
                color: location.pathname === '/portfolio' ? 'primary.main' : 'text.primary',
                bgcolor: location.pathname === '/portfolio' ? 'rgba(25,118,210,0.08)' : 'transparent',
                borderRadius: 2
              }}
            >
              Portfolio
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/stocks')}
              sx={{ 
                color: location.pathname.startsWith('/stocks') ? 'primary.main' : 'text.primary',
                bgcolor: location.pathname.startsWith('/stocks') ? 'rgba(25,118,210,0.08)' : 'transparent',
                borderRadius: 2
              }}
            >
              Live Stocks
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate('/invest')}
              sx={{ 
                color: location.pathname === '/invest' ? 'primary.main' : 'text.primary',
                bgcolor: location.pathname === '/invest' ? 'rgba(25,118,210,0.08)' : 'transparent',
                borderRadius: 2
              }}
            >
              Invest More
            </Button>
            <IconButton
              onClick={handleThemeToggle}
              className={styles.themeToggle}
              aria-label="toggle theme"
            >
              {mode === 'dark' ? (
                <LightMode className={`${styles.themeToggleIcon} ${isRotating ? styles.rotating : ''}`} />
              ) : (
                <DarkMode className={`${styles.themeToggleIcon} ${isRotating ? styles.rotating : ''}`} />
              )}
            </IconButton>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              sx={{
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, var(--primary-dark), var(--secondary-dark))'
                }
              }}
            >
              <Avatar sx={{ width: 32, height: 32, fontSize: '1rem' }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  borderRadius: '12px',
                  minWidth: 200,
                  background: 'var(--surface)',
                  backdropFilter: 'var(--glass-blur)',
                  boxShadow: 'var(--shadow-lg)'
                }
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {user?.name || 'User'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email || 'user@example.com'}
                </Typography>
              </Box>
              <Divider />
              <MenuItem 
                onClick={() => {
                  navigate('/settings');
                  handleClose();
                }}
                sx={{ gap: 1.5, py: 1.5 }}
              >
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <Divider />
              <MenuItem 
                onClick={handleLogout}
                sx={{ gap: 1.5, py: 1.5, color: 'error.main' }}
              >
                <ListItemIcon>
                  <LogoutIcon fontSize="small" color="error" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton
              onClick={handleThemeToggle}
              className={styles.themeToggle}
              aria-label="toggle theme"
            >
              {mode === 'dark' ? (
                <LightMode className={`${styles.themeToggleIcon} ${isRotating ? styles.rotating : ''}`} />
              ) : (
                <DarkMode className={`${styles.themeToggleIcon} ${isRotating ? styles.rotating : ''}`} />
              )}
            </IconButton>
            <Button variant="text" onClick={() => navigate('/login')}>Login</Button>
            <Button variant="contained" onClick={() => navigate('/signup')}>Sign Up</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;