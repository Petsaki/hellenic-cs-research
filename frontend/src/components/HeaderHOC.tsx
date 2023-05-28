import React, {
    ForwardRefRenderFunction,
    ForwardedRef,
    forwardRef,
    useContext,
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
import { Alert, Container, Icon, Snackbar, useMediaQuery } from '@mui/material';
import omeaLogo from '../assets/omea_logo.png';
import { ColorModeContext } from '../App';
import withStatusMessages, { WithStatusMessagesProps } from './SnackbarHOC';

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

export interface HeaderProps extends WithStatusMessagesProps {
    onChangeDrawer: () => void;
    headerRef?: React.Ref<HTMLDivElement>;
}

const Header = withStatusMessages(function Header({
    onChangeDrawer,
    headerRef,
    openSnackbar,
}: HeaderProps) {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [open, setOpen] = useState(false);

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleClick = () => {
        openSnackbar('Hello, world!');
    };

    return (
        <AppBar ref={headerRef}>
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
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={() => onChangeDrawer()}
                            sx={{ mr: 2, display: { md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <IconButton
                            size="large"
                            onClick={handleClick}
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
                    <Search
                        sx={{
                            flexGrow: 5,
                        }}
                    >
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search for departments"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
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
            {/* <Snackbar
                // open={open}
                open
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: isSmallScreen ? 'bottom' : 'top',
                    horizontal: isSmallScreen ? 'center' : 'right',
                }}
            >
                <Alert
                    onClose={handleClose}
                    severity="error"
                    // filled is very important to show the color base of severity
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    This is a success message!
                </Alert>
            </Snackbar> */}
        </AppBar>
    );
});

// export default forwardRef(Header);

// eslint-disable-next-line react/display-name
export default React.forwardRef<
    HTMLDivElement,
    HeaderProps & WithStatusMessagesProps
>((props, ref) => {
    return <Header {...props} headerRef={ref} />;
});
