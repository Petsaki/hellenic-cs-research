import {
    ForwardRefRenderFunction,
    ForwardedRef,
    forwardRef,
    useContext,
    useEffect,
    useState,
} from 'react';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Box from '@mui/material/Box';
import { Button, Container, useMediaQuery } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import omeaLogo from '../assets/omea_logo.png';
import { ColorModeContext } from '../App';

const headerButton: SxProps<Theme> = (theme) => ({
    color: 'white',
    backgroundColor: 'transparent',
    textAlign: 'center',
    ':hover': {
        backgroundColor: {
            xs: 'transparent',
            md: theme.palette.mode === 'dark' ? '#383838' : '#137cb8',
        },
    },
});

interface IDynamicLinkButton {
    to: string;
    text: string;
}

const Header: ForwardRefRenderFunction<HTMLDivElement> = (
    props,
    ref: ForwardedRef<HTMLDivElement>
) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const colorMode = useContext(ColorModeContext);

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const location = useLocation();
    const [buttonConfig, setButtonConfig] = useState<IDynamicLinkButton>({
        to: '/',
        text: 'Departments Stats',
    });

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const openAPIDoc = () => {
        window.open(`${import.meta.env.VITE_BASE_URL}/docs`, '_blank');
        handleCloseNavMenu();
    };

    useEffect(() => {
        if (location.pathname === '/citations') {
            setButtonConfig({
                to: '/departments',
                text: 'Departments Stats',
            });
        } else if (location.pathname === '/departments') {
            setButtonConfig({
                to: 'citations',
                text: 'Citations Stats',
            });
        } else {
            setButtonConfig({
                to: 'citations',
                text: 'Citations Stats',
            });
        }
    }, [location.pathname]);

    useEffect(() => {
        if (!isMobile) setAnchorElNav(null);
    }, [isMobile]);

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
            }}
        >
            <Container maxWidth="xl" disableGutters>
                <Toolbar
                    sx={{
                        paddingX: { xs: '8px', sm: '16px' },
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            display: { xs: 'flex', md: 'none' },
                        }}
                    >
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            sx={{ color: 'white' }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            <MenuItem
                                onClick={handleCloseNavMenu}
                                component={Link}
                                to={buttonConfig.to}
                            >
                                {buttonConfig.text}
                            </MenuItem>
                            <MenuItem onClick={openAPIDoc}>API Doc</MenuItem>
                        </Menu>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flex: 1,
                            justifyContent: { xs: 'center', sm: 'start' },
                        }}
                    >
                        <IconButton
                            component={Link}
                            to="/citations"
                            size="large"
                            edge={isMobile ? false : 'start'}
                            color="inherit"
                            aria-label="open drawer"
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
                            HellenicCSResearch
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            flex: 1,
                            gap: { xs: '0.8rem', md: '2rem' },
                        }}
                    >
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                gap: '1rem',
                            }}
                        >
                            <Button
                                component={Link}
                                to={buttonConfig.to}
                                sx={headerButton(theme)}
                            >
                                {buttonConfig.text}
                            </Button>
                            <Button
                                onClick={openAPIDoc}
                                sx={headerButton(theme)}
                            >
                                API Doc
                            </Button>
                        </Box>
                        <IconButton
                            sx={{ color: 'white' }}
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
