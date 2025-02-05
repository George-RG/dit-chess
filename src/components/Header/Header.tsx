import { useLocation, Link } from 'react-router-dom'; // Import necessary routing hooks
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ChessLogo from '../../assets/logo.png';
import { Container } from '@mui/material';
import Stack from '@mui/material/Stack';

const pages = [
  { name: '1v1 Arena', path: '/', disabled: false },
  { name: 'Tournament', path: '/tournament', disabled: true },
  { name: 'Live', path: '/live', disabled: true },
];

function DesktopHeader() {
  const location = useLocation(); // Get the current path

  return (
    <AppBar position="static" sx={{ width: '100%' }}>
      <Container maxWidth={false}>
        <Toolbar>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Stack direction="row" spacing={0} display="flex" alignItems="center">
              <Link to="/">
                <img
                  src={ChessLogo}
                  alt="Dit Chess Logo"
                  style={{ height: '50px', marginRight: '8px' }}
                />
              </Link>

              <Typography
                variant="h5"
                noWrap
                component={Link}
                to="/" // Link to the home page
                sx={{
                  mr: 2,
                  fontFamily: 'Inter',
                  fontWeight: 700,
                  color: 'inherit',
                  textDecoration: 'none',
                  "&:hover": { color: 'inherit' }
                }}
              >
                Dit Chess
              </Typography>
            </Stack>
          </Box>

          <Box width="100%" sx={{display: { xs: 'flex', md: 'none' } }} justifyContent="center">
            <Stack direction="row" spacing={0} display="flex" alignItems="center">
              <Link to="/">
                <img
                  src={ChessLogo}
                  alt="Dit Chess Logo"
                  style={{ height: '50px', marginRight: '8px' }}
                />
              </Link>

              <Typography
                variant="h5"
                noWrap
                component={Link}
                to="/" // Link to the home page
                sx={{
                  mr: 2,
                  fontFamily: 'Inter',
                  fontWeight: 700,
                  color: 'inherit',
                  textDecoration: 'none',
                  "&:hover": { color: 'inherit' }
                }}
              >
                Dit Chess
              </Typography>
            </Stack>
          </Box>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, marginLeft: "10px" }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.path}
                disabled={page.disabled}
                color={location.pathname === page.path ? 'secondary' : 'inherit'}
                sx={{
                  my: 2,
                  display: 'block',
                  fontSize: "16px",
                  marginRight: "10px",
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default DesktopHeader;