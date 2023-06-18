import React, {
    ForwardRefRenderFunction,
    ForwardedRef,
    forwardRef,
    useContext,
    useEffect,
    useState,
} from 'react';
import { styled, alpha, useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Box from '@mui/material/Box';
import {
    Alert,
    Autocomplete,
    CircularProgress,
    Container,
    Icon,
    Snackbar,
    TextField,
    useMediaQuery,
} from '@mui/material';
import omeaLogo from '../assets/omea_logo.png';
import { ColorModeContext } from '../App';
import { useGetJesusQuery } from '../services/departmentApi';
import { DepartmentsData } from '../models/api/response/departments/departments.data';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '420px',
    maxWidth: '420px',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
    },
}));

export interface HeaderProps {
    onChangeDrawer: () => void;
}

const Header: ForwardRefRenderFunction<HTMLDivElement, HeaderProps> = (
    { onChangeDrawer }: HeaderProps,
    ref: ForwardedRef<HTMLDivElement>
) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const colorMode = useContext(ColorModeContext);
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<readonly DepartmentsData[]>(
        []
    );

    const {
        data: departmenentData,
        isLoading: isDepartmenentDataFetching,
        isError: isDepartmenentDataError,
    } = useGetJesusQuery({
        filter: 'id',
    });

    useEffect(() => {
        if (departmenentData?.data) {
            setOptions([...departmenentData.data]);
        }
    }, [departmenentData?.data]);

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
                        {/* <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={() => onChangeDrawer()}
                            sx={{ mr: 2, display: { md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton> */}
                        <IconButton
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
                                alt="The house from the offer."
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
                            }}
                        >
                            OMEA Citations
                        </Typography>
                    </Box>
                    <Autocomplete
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
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            flexGrow: 1,
                        }}
                    >
                        <IconButton
                            sx={{ ml: 1 }}
                            onClick={colorMode.toggleColorMode}
                            color="inherit"
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
