import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import LogoutIcon from '@mui/icons-material/Logout';
import useMediaQuery from '@mui/material/useMediaQuery';
import useAuth from '../hooks/useAuth';
import { clearSession } from '../services/authService';
import logoImg from '../assets/logo.png';

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountAnchor, setAccountAnchor] = useState(null);
  const { authenticated: isLoggedIn } = useAuth();

  // Check if screen width is below 1000px
  const isMobile = useMediaQuery('(max-width:1000px)');

  const isActive = path => currentPath === path;

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  const accountMenuOpen = Boolean(accountAnchor);
  const handleAccountOpen = event => setAccountAnchor(event.currentTarget);
  const handleAccountClose = () => setAccountAnchor(null);

  const handleGoToPasskeys = () => {
    handleAccountClose();
    navigate('/passkeys');
  };

  const handleMenuLogout = () => {
    handleAccountClose();
    handleLogout();
  };

  const drawerContent = (
    <Box sx={{ width: 250, backgroundColor: '#1E3C72', height: '100%', color: 'white' }} role="presentation">
      <Box
        component={Link}
        to="/"
        onClick={handleDrawerToggle}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          p: 2,
          textDecoration: 'none',
          color: 'white',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <Box
          component="img"
          src={logoImg}
          alt="EMS Logo"
          sx={{ width: 38, height: 38, borderRadius: '8px', objectFit: 'cover' }}
        />
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            EMS Portal
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>
            Enterprise HR Suite
          </Typography>
        </Box>
      </Box>
      <List>
        <ListItem button component={Link} to="/" selected={isActive('/')} onClick={handleDrawerToggle}>
          <ListItemText primary="Home" sx={{ color: isActive('/') ? '#ff9800' : 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/dashboard" selected={isActive('/dashboard')} onClick={handleDrawerToggle}>
          <ListItemText primary="Dashboard" sx={{ color: isActive('/dashboard') ? '#ff9800' : 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/employees" selected={isActive('/employees')} onClick={handleDrawerToggle}>
          <ListItemText primary="Employees" sx={{ color: isActive('/employees') ? '#ff9800' : 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/departments" selected={isActive('/departments')} onClick={handleDrawerToggle}>
          <ListItemText primary="Departments" sx={{ color: isActive('/departments') ? '#ff9800' : 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/attendance" selected={isActive('/attendance')} onClick={handleDrawerToggle}>
          <ListItemText primary="Attendance & Leaves" sx={{ color: isActive('/attendance') ? '#ff9800' : 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/payroll" selected={isActive('/payroll')} onClick={handleDrawerToggle}>
          <ListItemText primary="Payroll & Salary" sx={{ color: isActive('/payroll') ? '#ff9800' : 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/smart-onboard" selected={isActive('/smart-onboard')} onClick={handleDrawerToggle}>
          <ListItemText primary="AI Onboard" sx={{ color: isActive('/smart-onboard') ? '#ff9800' : 'white' }} />
        </ListItem>
        <ListItem button component={Link} to="/profile" selected={isActive('/profile')} onClick={handleDrawerToggle}>
          <ListItemText primary="Profile" sx={{ color: isActive('/profile') ? '#ff9800' : 'white' }} />
        </ListItem>

        {isLoggedIn ? (
          <>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 1 }} />
            <ListItem button component={Link} to="/passkeys" selected={isActive('/passkeys')} onClick={handleDrawerToggle}>
              <ListItemIcon sx={{ color: isActive('/passkeys') ? '#ff9800' : 'white', minWidth: 40 }}>
                <FingerprintIcon />
              </ListItemIcon>
              <ListItemText primary="Passkeys" sx={{ color: isActive('/passkeys') ? '#ff9800' : 'white' }} />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                handleDrawerToggle();
                handleLogout();
              }}
            >
              <ListItemIcon sx={{ color: 'red', minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Log Out" sx={{ color: 'red' }} />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem button component={Link} to="/login" selected={isActive('/login')} onClick={handleDrawerToggle}>
              <ListItemText primary="Login" sx={{ color: isActive('/login') ? '#ff9800' : 'white' }} />
            </ListItem>
            <ListItem button component={Link} to="/register" selected={isActive('/register')} onClick={handleDrawerToggle}>
              <ListItemText primary="Register" sx={{ color: isActive('/register') ? '#ff9800' : 'white' }} />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(135deg, #1E3C72 0%, #2A5298 100%)',
          padding: '0.5rem 0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          borderRadius: 0,
        }}
      >
        <Toolbar>
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              flexGrow: 1,
              textDecoration: 'none',
              color: 'white',
            }}
          >
            <Box
              component="img"
              src={logoImg}
              alt="EMS Logo"
              sx={{
                width: 40,
                height: 40,
                borderRadius: '8px',
                objectFit: 'cover',
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                transition: 'transform 0.25s ease',
                '&:hover': { transform: 'scale(1.08)' },
              }}
            />
            <Box>
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontSize: { xs: '1.05rem', sm: '1.25rem', md: '1.4rem' },
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                }}
              >
                Employee Management System
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Enterprise Workspace
              </Typography>
            </Box>
          </Box>

          {/* Render drawer icon for mobile view */}
          {isMobile ? (
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          ) : (
            // Render full menu for desktop view
            <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <Button
                color={isActive('/') ? 'primary' : 'inherit'}
                component={Link}
                to="/"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: isActive('/') ? '#ff9800' : 'inherit',
                }}
              >
                Home
              </Button>
              <Button
                color={isActive('/dashboard') ? 'primary' : 'inherit'}
                component={Link}
                to="/dashboard"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: isActive('/dashboard') ? '#ff9800' : 'inherit',
                }}
              >
                Dashboard
              </Button>
              <Button
                color={isActive('/employees') ? 'primary' : 'inherit'}
                component={Link}
                to="/employees"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: isActive('/employees') ? '#ff9800' : 'inherit',
                }}
              >
                Employees
              </Button>
              <Button
                color={isActive('/departments') ? 'primary' : 'inherit'}
                component={Link}
                to="/departments"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: isActive('/departments') ? '#ff9800' : 'inherit',
                }}
              >
                Departments
              </Button>
              <Button
                color={isActive('/attendance') ? 'primary' : 'inherit'}
                component={Link}
                to="/attendance"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: isActive('/attendance') ? '#ff9800' : 'inherit',
                }}
              >
                Attendance
              </Button>
              <Button
                color={isActive('/payroll') ? 'primary' : 'inherit'}
                component={Link}
                to="/payroll"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: isActive('/payroll') ? '#ff9800' : 'inherit',
                }}
              >
                Payroll
              </Button>
              <Button
                color={isActive('/smart-onboard') ? 'primary' : 'inherit'}
                component={Link}
                to="/smart-onboard"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: isActive('/smart-onboard') ? '#ff9800' : '#ffb74d',
                  borderRadius: 2,
                  px: 1.5,
                  bgcolor: 'rgba(255, 152, 0, 0.15)',
                  '&:hover': { bgcolor: 'rgba(255, 152, 0, 0.25)' },
                }}
              >
                ✨ AI Onboard
              </Button>
              <Button
                color={isActive('/profile') ? 'primary' : 'inherit'}
                component={Link}
                to="/profile"
                sx={{
                  fontSize: '1rem',
                  fontWeight: 500,
                  color: isActive('/profile') ? '#ff9800' : 'inherit',
                }}
              >
                Profile
              </Button>

              {/* Account dropdown when signed in; Login + Register otherwise */}
              {isLoggedIn ? (
                <>
                  <Button
                    onClick={handleAccountOpen}
                    endIcon={<KeyboardArrowDownIcon />}
                    aria-haspopup="true"
                    aria-controls={accountMenuOpen ? 'account-menu' : undefined}
                    aria-expanded={accountMenuOpen ? 'true' : undefined}
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: isActive('/passkeys') ? '#ff9800' : 'inherit',
                    }}
                  >
                    Account
                  </Button>
                  <Menu
                    id="account-menu"
                    anchorEl={accountAnchor}
                    open={accountMenuOpen}
                    onClose={handleAccountClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    PaperProps={{
                      elevation: 4,
                      sx: { mt: 1, minWidth: 200, borderRadius: 2, overflow: 'hidden' },
                    }}
                  >
                    <MenuItem onClick={handleGoToPasskeys} selected={isActive('/passkeys')}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <FingerprintIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Passkeys</ListItemText>
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleMenuLogout} sx={{ color: 'error.main' }}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <LogoutIcon fontSize="small" sx={{ color: 'error.main' }} />
                      </ListItemIcon>
                      <ListItemText>Log Out</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    color={isActive('/login') ? 'primary' : 'inherit'}
                    component={Link}
                    to="/login"
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: isActive('/login') ? '#ff9800' : 'inherit',
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    color={isActive('/register') ? 'primary' : 'inherit'}
                    component={Link}
                    to="/register"
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 500,
                      color: isActive('/register') ? '#ff9800' : 'inherit',
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile view */}
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        {drawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;
