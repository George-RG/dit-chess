import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { AppBar, Box, Button, Container, Toolbar } from '@mui/material';


import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Navbar: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElSignUp, setAnchorElSignUp] = React.useState<null | HTMLElement>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [profileName, setProfileName] = useState('');

  const pages = [
    {
      title: 'Γίνε νταντά',
      action: (event: React.MouseEvent) => {
        event.preventDefault();
        handleCloseNavMenu();
        setIsPopupOpen(true);
      },
    },
    {
      title: 'Βρες νταντά',
      action: (event: React.MouseEvent) => {
        event.preventDefault();
        handleCloseNavMenu();
        navigate('/find-nanny');
      }
    }
  ];


  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenSignUpMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElSignUp(event.currentTarget);
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseSignUpMenu = () => {
    setAnchorElSignUp(null);
  }


  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: theme.palette.primary.main,
          boxShadow: 'none',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth={false}>
          <Toolbar disableGutters>
            {/* Centered Menu Items */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                flexGrow: 1,
              }}
            >
              {pages.map((page, index) => (
                <Button
                  key={index}
                  color="inherit"
                  onClick={page.action}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    color: theme.palette.background.paper,
                    margin: theme.spacing(0, 1),
                    '&:hover': {
                      color: theme.palette.background.paper,
                    },
                  }}
                >
                  {page.title}
                </Button>
              ))}
            </Box>

            {/* Not Logged-In Section */}
            <Box
              gap={1}
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              <Button
                variant="contained"
                href="/sign-up"
                sx={{
                  bgcolor: theme.palette.success.main,
                  color: theme.palette.background.paper,
                  borderRadius: 5,
                  '&:hover': {
                    bgcolor: theme.palette.success.dark,
                    color: theme.palette.background.paper,
                  },
                }}
              >
                Εγγραφή
              </Button>
              <Button
                variant="contained"
                href="/login"
                sx={{
                  bgcolor: theme.palette.secondary.main,
                  color: theme.palette.background.paper,
                  borderRadius: 5,
                  '&:hover': {
                    bgcolor: theme.palette.secondary.dark,
                    color: theme.palette.background.paper,
                  },
                }}
              >
                Είσοδος
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Navbar;



