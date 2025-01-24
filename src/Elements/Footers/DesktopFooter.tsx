import * as React from 'react';
import { useLocation, Link } from 'react-router-dom'; // Import necessary routing hooks
import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import { useState } from 'react';

import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";


function DesktopFooter() {
  return (
    <Box sx={{width: "100%",
        display: "flex",
        flexDirection:"column",
        justifyContent: "center",
        alignItems: "center"}}>
        <p>Made with ❤ by
        <a href="https://github.com/George-RG/"> GeorgeRG</a> & <a href="https://github.com/DPorichis/"> DPorichis</a>
        </p>
        <>For the IP class of 2024</>
    </Box>
  );
};
export default DesktopFooter;



