import React, { useState, useMemo} from 'react';
import './App.css'
import Header from './Header'
import Arena from './Arena';
import { lightTheme, darkTheme } from './configs/themes';
import { ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";
import {Routes, Route} from 'react-router-dom';
import Box from '@mui/material/Box';

import Navbar from './Elements/Headers/DesktopHeader';
import MobileHeader from './Elements/Headers/MobileHeader';
import DesktopHeader from './Elements/Headers/DesktopHeader';

const ThemePaletteModeContext = React.createContext({
  toggleThemePaletteMode: () => { }
});

const App: React.FC = () => {

  const isSystemDarkMode = useMediaQuery("(prefers-color-scheme: dark)")
  const [themePaletteMode, setThemePaletteMode] = useState(
    'light'
  );
  // create a darkTheme function to handle dark theme using createTheme
  const themePaletteModeContextProvider = useMemo(
    () => ({
      toggleThemePaletteMode: () => {
        setThemePaletteMode((prevMode) =>
          prevMode === 'light' ? 'dark' : 'light',
        );
      },
    }),
    []
  );

  const themeProvider = useMemo(
    () =>
      themePaletteMode === 'dark' ? darkTheme : lightTheme,
    [themePaletteMode]
  );

  return (
    // <ThemePaletteModeContext.Provider value={themePaletteModeContextProvider}>
    //   <ThemeProvider theme={themeProvider}>
    //     <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
          <DesktopHeader/>
          {/* <Routes>
            <Route path="/" element={<Arena />} />
          </Routes> */}
        </Box>
    // </ThemeProvider>
    // </ThemePaletteModeContext.Provider >
  );
}

export default App;

export { ThemePaletteModeContext };