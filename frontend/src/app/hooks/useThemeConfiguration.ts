import { PaletteMode, createTheme, useTheme } from '@mui/material';
import { useMemo } from 'react';

export interface ThemeConfiguration {
    mode: PaletteMode;
}

const useThemeConfiguration = ({ mode }: ThemeConfiguration) => {
    const muiTheme = useTheme();

    return useMemo(() => {
        const theme = createTheme({
            palette: {
                mode,
                ...(mode === 'light'
                    ? {
                          primary: {
                              main: '#55a1e5',
                          },
                          background: {
                              default: '#f1f1f1',
                          },
                      }
                    : {}),
            },
            components: {
                // This is a example to how to customize components. At the end i didnt want it but is a good example for the feature
                MuiSnackbar: {
                    styleOverrides: {
                        root: {
                            '& .MuiPaper-root': {
                                '& .MuiAlert-icon': {
                                    alignItems: 'center',
                                },
                            },
                            [muiTheme.breakpoints.up('sm')]: {
                                top: '82px',
                                maxWidth: '500px',
                            },
                            [muiTheme.breakpoints.down('sm')]: {
                                bottom: '84px',
                            },
                        },
                    },
                },
                MuiCssBaseline: {
                    styleOverrides: `
                        ::-webkit-scrollbar {
                        width: 8px;
                        height: 8px;
                        }
                        ::-webkit-scrollbar-thumb {
                        background-color: rgba(128, 128, 128, 0.3);
                        border-radius: 2px;
                        }
                        ::-webkit-scrollbar-thumb:hover {
                        background-color: rgba(128, 128, 128, 0.5);
                        }
                    `,
                },
                MuiAlert: {
                    styleOverrides: {
                        root: {
                            // add your custom styles here
                        },
                    },
                },
                MuiFormLabel: {
                    styleOverrides: {
                        root: {
                            paddingBottom: '0.5rem',
                            paddingTop: '0.8rem',
                            '&.Mui-focused': {
                                color:
                                    mode === 'light'
                                        ? '#00000099'
                                        : '#ffffffb3',
                            },
                        },
                    },
                },
                MuiFormControlLabel: {
                    styleOverrides: {
                        root: {
                            marginLeft: '12px',
                        },
                    },
                },
                MuiToggleButton: {
                    styleOverrides: {
                        root: {
                            '&.Mui-selected': {
                                color: 'white',
                                backgroundColor:
                                    mode === 'light' ? '#55a1e5' : 'auto',
                                ':hover': {
                                    backgroundColor:
                                        mode === 'dark' ? '#383838' : '#188acb',
                                },
                            },
                        },
                    },
                },
                MuiAppBar: {
                    styleOverrides: {
                        root: {
                            paddingRight: '0px !important',
                        },
                    },
                },
            },
            breakpoints: {
                values: {
                    xs: 0,
                    sm: 600,
                    md: 900,
                    lg: 1200,
                    xl: 2036,
                },
            },
        });

        return theme;
    }, [mode, muiTheme.breakpoints]);
};

export default useThemeConfiguration;
