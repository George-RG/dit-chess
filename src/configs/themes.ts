import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles/createPalette' {
    interface TypeText {
        darkerSecText: string;
        footer: string;
        footerMuted: string;
    }
    interface TypeBackground {
        footer: string;
    }
}

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#d9c093',
        },
        secondary: {
            main: '#3f51b5',
        },
        background: {
            default: '#1e1e1e',
            paper: '#383838',
            footer: '#121212',
        },
        text: {
            primary: '#f0f0f0',
            secondary: '#d9d9d9',
            darkerSecText: '#bfbfbf',
            footer: '#FFFFFF',
            footerMuted: '#999999',
        }
    },
    typography: {
        fontFamily: 'Poppins, sans-serif',
        button: {
            textTransform: 'none',
        },
    }
});

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#3C4A8C',
        },
        secondary: {
            main: '#C3D1F5',
        },
        background: {
            default: '#FFFFFF',
            paper: '#F0F4FF',
        },
        text: {
            primary: '#000000',
            secondary: '#757575',
            darkerSecText: '#555555',
            footer: '#FFFFFF',
            footerMuted: '#B8C5D3',
        }
    },
    typography: {
        fontFamily: 'Poppins, sans-serif',
        button: {
            textTransform: 'none',
        },
    }
});

export { darkTheme, lightTheme };
