import * as React from 'react';
import { useLocation, Link } from 'react-router-dom'; // Import necessary routing hooks
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useState } from 'react';

import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";

function MobileFooter() {
  const [value, setValue] = useState(0);
  return (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      sx={{width: "100%"}}
    >
      <BottomNavigationAction
        label="1v1 Arena"
        icon={<RestoreIcon />}
        component={Link}
        to="/arena"
      />
      <BottomNavigationAction
        label="Tournament"
        icon={<FavoriteIcon />}
        component={Link}
        to="/tournament"
        disabled
      />
      <BottomNavigationAction
        label="Live"
        icon={<LocationOnIcon />}
        component={Link}
        to="/live"
        disabled
      />
    </BottomNavigation>
  );
};
export default MobileFooter;