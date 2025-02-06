import React from 'react';

import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon Icon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun Icon

import { Box, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';

import { ThemePaletteModeContext } from '../../App';

const ToggleThemePaletteMode = () => {
    const theme = useTheme();
    const themePaletteModeContext = React.useContext(ThemePaletteModeContext);
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "left",
          color: theme.palette.background.paper,
        }}
      >
        <Tooltip title="Toggle light/dark theme" placement="bottom">
          <IconButton
              onClick={themePaletteModeContext.toggleThemePaletteMode}
              color="inherit"
              sx={{
                  ml: 1,
                  border: 0,
                  outline: "none",
                  boxShadow: 0,
                  borderColor: "transparent",
              }}
          >
            {theme.palette.mode === "dark" ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

export const ThemeSelector: React.FC = () => {
    return (
        <ToggleThemePaletteMode />
    );
};

export default ThemeSelector;