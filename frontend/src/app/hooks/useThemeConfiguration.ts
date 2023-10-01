import { PaletteMode, createTheme, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { amber, deepOrange, grey } from '@mui/material/colors';

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
            components: {
                // This is a example to how to customize components. At the end i didnt want it but is a good example for the feature
                MuiSnackbar: {
                    styleOverrides: {
                        root: {
                            '& .MuiPaper-root': {
                                // backgroundColor:
                                //     muiTheme.palette.error.main,
                                // color: '#fff',
                                // add your custom styles here
                                // [muiTheme.breakpoints.down('md')]: {
                                //     backgroundColor:
                                //         muiTheme.palette.error.main,
                                // },
                                // [muiTheme.breakpoints.up('md')]: {
                                //     backgroundColor:
                                //         muiTheme.palette.primary.main,
                                //     top: '82px',
                                // },
                                '& .MuiAlert-icon': {
                                    alignItems: 'center',
                                    // color: '#fff',
                                },
                            },
                            // [muiTheme.breakpoints.down('md')]: {
                            //     top: 'auto',

                            // },
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
                        // Name of the component ⚛️ / style sheet
                        root: {
                            paddingBottom: '0.5rem',
                            paddingTop: '0.8rem',
                            '&.Mui-focused': {
                                // increase the specificity for the pseudo class
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
            },
        });

        return theme;
    }, [mode, muiTheme.breakpoints]);
};

export default useThemeConfiguration;
