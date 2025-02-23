import { Typography, useTheme } from '@mui/material';
import { Box } from '@mui/material';
import { Link } from 'react-router-dom';

function DesktopFooter() {
  const theme = useTheme();
  return (
    <Box
      display={{ xs: 'none', md: 'flex' }}
      bgcolor={theme.palette.background.footer}
      sx={{
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
      <Typography variant="body1" color={theme.palette.text.primary} sx={{ mt: 2 }}>
        Made with ❤ by  &nbsp;
        <Link
          to="https://github.com/George-RG/"
          style={{ color: theme.palette.text.footerMuted }}
        >
          GeorgeRG
        </Link>
        &nbsp;
        &
        &nbsp;
        <Link 
          to="https://github.com/DPorichis/"
          style={{ color: theme.palette.text.footerMuted }}
        >
          DPorichis
        </Link>
      </Typography>
      <Typography variant="body1" color={theme.palette.text.primary} sx={{ mt: 2 }}>
        For the IP class of 2024
      </Typography>

    </Box>
  );
};
export default DesktopFooter;



