import Box from '@mui/material/Box/Box';
import Typography from '@mui/material/Typography/Typography';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { SxProps, useTheme } from '@mui/material';

const title: SxProps = {
    fontWeight: 'bold',
    letterSpacing: '0.03rem',
    fontSize: { xs: '2.5rem', md: '3rem' },
};

const NotFound = () => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box
                sx={{
                    mt: { xs: '24px', md: '64px' },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <QuestionMarkIcon
                    sx={{
                        fontSize: { xs: '16rem', md: '22rem' },
                        color:
                            theme.palette.mode === 'dark'
                                ? '#90caf9'
                                : '#55a1e5',
                    }}
                />

                <Typography variant="h3" sx={title} gutterBottom align="center">
                    Page not found
                </Typography>
            </Box>
        </Box>
    );
};

export default NotFound;
