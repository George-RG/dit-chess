import React, { useState, useMemo} from 'react';
import './App.css'
import Arena from './Arena';
import Tournament from './Tournament';
import { lightTheme, darkTheme } from './configs/themes';
import { ThemeProvider } from "@mui/material/styles";
// import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";
import {Routes, Route} from 'react-router-dom';
import Box from '@mui/material/Box';

import Header from './components/Header/Header';
import MobileFooter from './components/Footers/MobileFooter';
import DesktopFooter from './components/Footers/DesktopFooter';

const ThemePaletteModeContext = React.createContext({
  toggleThemePaletteMode: () => { }
});

const baseUrl = import.meta.env.BASE_URL;

const App: React.FC = () => {

  // const isSystemDarkMode = useMediaQuery("(prefers-color-scheme: dark)")
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
    <ThemePaletteModeContext.Provider value={themePaletteModeContextProvider}>
      <ThemeProvider theme={themeProvider}>
        <CssBaseline />
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

          <Header/>
          <Routes>
            <Route path={baseUrl} element={<Arena />} />
            <Route path={baseUrl+"arena"} element={<Arena />} />
            <Route path={baseUrl+"tournament"} element={<Tournament />} />
          </Routes>

          <Box sx={{ display: {xs : 'flex', md: 'none'}}}>
            {/* Add some more room */}
            <Box sx={{ height: '50px' }} />
            <MobileFooter />
          </Box>
          <Box sx={{ display: {xs : 'none', md: 'flex'}, widht:"100%"}}>
            <DesktopFooter />
          </Box>
        </Box>
    </ThemeProvider>
    </ThemePaletteModeContext.Provider >
  );
}

export default App;

export { ThemePaletteModeContext };