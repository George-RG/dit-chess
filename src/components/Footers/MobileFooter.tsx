import { Link } from 'react-router-dom'; // Import necessary routing hooks
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { useState } from 'react';
import { baseUrl } from '../../configs/constants';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChess, faPlay, faTrophy } from '@fortawesome/free-solid-svg-icons';


function MobileFooter() {
  const [value, setValue] = useState(0);
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={10}>
    <BottomNavigation
      showLabels
      value={value}
      onChange={(_, newValue) => {
        setValue(newValue);
      }}
      sx={{width: "100%"}}
    >
      <BottomNavigationAction
        label="1v1 Arena"
        icon={<FontAwesomeIcon icon={faChess} />}
        component={Link}
        to={{baseUrl} + "arena"}
      />
      <BottomNavigationAction
        label="Tournament"
        icon={<FontAwesomeIcon icon={faTrophy}/>}
        component={Link}
        to={baseUrl + "tournament"}
      />
      <BottomNavigationAction
        label="Live"
        icon={<FontAwesomeIcon icon={faPlay}/>}
        component={Link}
        to={baseUrl + "live"}
        disabled
      />
    </BottomNavigation>
    </Paper>
  );
};
export default MobileFooter;