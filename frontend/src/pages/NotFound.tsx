import React from 'react';
import Box from '@mui/material/Box/Box';
import Typography from '@mui/material/Typography/Typography';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import { SxProps, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

const title: SxProps = {
    fontWeight: 'bold',
    letterSpacing: '0.03rem',
};

const NotFound = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

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
                    mt: isSmallScreen ? '24px' : '64px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <QuestionMarkIcon
                    sx={{
                        fontSize: isSmallScreen ? '18rem' : '24rem',
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
