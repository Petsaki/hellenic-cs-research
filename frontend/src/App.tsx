import { createContext, useMemo, useState } from 'react';
import './App.css';
import useMediaQuery from '@mui/material/useMediaQuery';
import { CssBaseline, PaletteMode, ThemeProvider } from '@mui/material';
import Paths from './routes';
import TheAlert from './components/TheAlert';
import useThemeConfiguration from './app/hooks/useThemeConfiguration';

export const ColorModeContext = createContext({
    toggleColorMode: () => {},
});

function App() {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const isDarkMode = () => {
        const localTheme = localStorage.getItem('theme');
        if (localTheme) {
            return localTheme === 'dark';
        }
        return prefersDarkMode;
    };

    const [mode, setMode] = useState<PaletteMode>(
        isDarkMode() ? 'dark' : 'light'
    );

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const currentTheme =
                        prevMode === 'light' ? 'dark' : 'light';
                    localStorage.setItem('theme', currentTheme);
                    return currentTheme;
                });
            },
        }),
        []
    );

    const theme = useThemeConfiguration({ mode });

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Paths />
                <TheAlert />
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
}

export default App;
