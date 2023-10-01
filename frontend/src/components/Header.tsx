import {
    ForwardRefRenderFunction,
    ForwardedRef,
    forwardRef,
    useContext,
} from 'react';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Box from '@mui/material/Box';
import { Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import omeaLogo from '../assets/omea_logo.png';
import { ColorModeContext } from '../App';

const Header: ForwardRefRenderFunction<HTMLDivElement> = (
    props,
    ref: ForwardedRef<HTMLDivElement>
) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const colorMode = useContext(ColorModeContext);

    return (
        <AppBar
            ref={ref}
            sx={{
                position: { xs: 'relative', md: 'fixed' },
                ...(isDarkMode
                    ? {}
                    : {
                          background:
                              'linear-gradient(126deg,#007cbb,#7096d6 30%,#7096d6 70%,#007cbb)',
                      }),
                // background:
                //     'linear-gradient(126deg,#007cbb,#5383d6 30%,#5383d6 70%,#007cbb)',
            }}
        >
            <Container maxWidth="xl" disableGutters>
                <Toolbar>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexGrow: 1,
                        }}
                    >
                        <IconButton
                            component={Link}
                            to="/citations"
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{ mr: 2 }}
                        >
                            <Box
                                component="img"
                                sx={{
                                    height: 38,
                                    width: 38,
                                }}
                                alt="Omea Logo"
                                src={omeaLogo}
                            />
                        </IconButton>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{
                                display: { xs: 'none', sm: 'block' },
                                fontWeight: 'bold',
                                color: 'white',
                            }}
                        >
                            OMEA Citations
                        </Typography>
                    </Box>
                    {/* Search component for the feature */}
                    {/* <Autocomplete
                        disableClearable
                        sx={{
                            width: 300,
                        }}
                        open={open}
                        onOpen={() => {
                            setOpen(true);
                        }}
                        onClose={() => {
                            setOpen(false);
                        }}
                        isOptionEqualToValue={(
                            option: DepartmentsData,
                            value: DepartmentsData
                        ) => option.id === value.id}
                        getOptionLabel={(option: DepartmentsData) => option.id}
                        options={options}
                        loading={isDepartmenentDataFetching}
                        renderInput={(params) => (
                            <TextField
                                sx={{
                                    '& .MuiInputBase-root': {
                                        borderRadius: '8px',
                                        '& .MuiInputBase-input': {
                                            color: 'white',
                                        },
                                    },
                                }}
                                hiddenLabel
                                variant="filled"
                                {...params}
                                placeholder="Search for Department"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {isDepartmenentDataFetching ? (
                                                <CircularProgress
                                                    color="inherit"
                                                    size={20}
                                                />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                    disableUnderline: true,
                                }}
                            />
                        )}
                    /> */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            flexGrow: 1,
                            gap: { sx: '0.8rem', md: '2rem' },
                        }}
                    >
                        <Button
                            component={Link}
                            to="/departments-stats"
                            sx={{
                                color: 'white',
                                backgroundColor: 'transparent',
                                ':hover': {
                                    backgroundColor:
                                        theme.palette.mode === 'dark'
                                            ? '#383838'
                                            : '#137cb8',
                                },
                            }}
                        >
                            Departments Stat&#39;s
                        </Button>
                        {/* <Button
                            component={Link}
                            to="/about"
                            sx={{
                                color: 'white',
                                backgroundColor: 'transparent',
                                ':hover': {
                                    backgroundColor:
                                        theme.palette.mode === 'dark'
                                            ? '#383838'
                                            : '#137cb8',
                                },
                            }}
                        >
                            About
                        </Button> */}
                        <IconButton
                            sx={{ ml: 1, color: 'white' }}
                            onClick={colorMode.toggleColorMode}
                        >
                            {theme.palette.mode === 'dark' ? (
                                <Brightness7Icon />
                            ) : (
                                <Brightness4Icon />
                            )}
                        </IconButton>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default forwardRef(Header);
