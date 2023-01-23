import { createContext, useMemo, useState } from 'react';
import './App.css';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { amber, deepOrange, grey } from '@mui/material/colors';
import Paths from './routes';

export const ColorModeContext = createContext({
    toggleColorMode: () => {},
});

function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [mode, setMode] = useState<'light' | 'dark'>(
        prefersDarkMode ? 'dark' : 'light'
    );

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) =>
                    prevMode === 'light' ? 'dark' : 'light'
                );
            },
        }),
        []
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    // ...(mode === 'light'
                    //     ? {
                    //           // palette values for light mode
                    //           primary: amber,
                    //           divider: amber[200],
                    //           text: {
                    //               primary: grey[900],
                    //               secondary: grey[800],
                    //           },
                    //       }
                    //     : {
                    //           // palette values for dark mode
                    //           primary: deepOrange,
                    //           divider: deepOrange[700],
                    //           background: {
                    //               default: deepOrange[900],
                    //               paper: deepOrange[900],
                    //           },
                    //           text: {
                    //               primary: '#fff',
                    //               secondary: grey[500],
                    //           },
                    //       }),
                },
            }),
        [mode]
    );
    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Paths />
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
