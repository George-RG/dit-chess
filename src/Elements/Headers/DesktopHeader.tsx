import * as React from 'react';
import { useLocation, Link } from 'react-router-dom'; // Import necessary routing hooks
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

const pages = [
  { name: '1v1 Arena', path: '/arena' },
  { name: 'Tournament', path: '/tournament' },
  { name: 'Live', path: '/live' },
];

function DesktopHeader() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const location = useLocation(); // Get the current path

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static" sx={{ width: '100%' }}>
      <Toolbar>
        <img 
        src="/chess-logo.png" 
        alt="Dit Chess Logo" 
        style={{ height: '50px', marginRight: '8px' }} 
        />
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/arena"
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'Inter',
            fontWeight: 700,
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          Dit Chess
        </Typography>

        {/* Desktop menu */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, marginLeft: "10px" }}>
          <Button
            key={"arena"}
            component={Link}
            to={'/arena'}
            sx={{
              my: 2,
              color: location.pathname === '/arena' || location.pathname === '/' ? "white" : "main.secondary",
              display: 'block',
              fontSize:"16px",
              marginRight: "10px"
            }}
          >
            1v1 Arena
          </Button>

          <Button
            key={"tournament"}
            component={Link}
            to={'/arena'}
            disabled
            sx={{
              my: 2,
              color: location.pathname === '/tournament' ? "white" : "#ddd",
              display: 'block',
              fontSize:"16px",
              marginRight: "10px"
            }}
          >
            Tournament
          </Button>

          <Button
            key={"arena"}
            component={Link}
            to={'/arena'}
            disabled
            sx={{
              my: 2,
              color: location.pathname === '/live' ? "white" : "#ddd",
              display: 'block',
              fontSize:"16px",
              marginRight: "10px"
            }}
          >
            Live
          </Button>
          
        </Box>
      </Toolbar>
    </AppBar>
  );
}
export default DesktopHeader;