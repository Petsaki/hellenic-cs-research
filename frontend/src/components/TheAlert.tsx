import React, { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert/Alert';
import Snackbar from '@mui/material/Snackbar/Snackbar';
import useTheme from '@mui/material/styles/useTheme';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

const TheAlert = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const [open, setOpen] = useState(false);

    const alertData = useSelector((state: RootState) => state.testSlice.alert);

    useEffect(() => {
        setOpen(alertData.isOpen ?? true);
    }, [alertData]);

    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: string
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={alertData.duration ?? 6000}
            onClose={handleClose}
            anchorOrigin={{
                vertical: isSmallScreen ? 'bottom' : 'top',
                horizontal: isSmallScreen ? 'center' : 'right',
            }}
        >
            <Alert
                onClose={handleClose}
                severity={alertData.type}
                // filled is very important to show the color base of severity
                variant="filled"
                sx={{ width: '100%' }}
            >
                {alertData.message}
            </Alert>
        </Snackbar>
    );
};

export default TheAlert;
