import { Alert, useMediaQuery, useTheme } from '@mui/material';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar/Snackbar';
import * as React from 'react';
import { SyntheticEvent } from 'react';

export type WithStatusMessagesProps = {
    openSnackbar: (message: React.ReactNode) => void;
};

function getDisplayName<P>(WrappedComponent: React.ComponentType<P>): string {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function withStatusMessages<P extends object>(
    WrappedComponent: React.ComponentType<P>
): React.FunctionComponent<P & WithStatusMessagesProps> {
    const WithStatusMessages: React.FunctionComponent<
        P & WithStatusMessagesProps
    > = (props) => {
        const theme = useTheme();
        const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
        const [snackbarOpen, setSnackbarOpen] = React.useState(false);
        const [snackbarMessage, setSnackbarMessage] =
            React.useState<React.ReactNode>('');
        const handleSnackbarClose = (
            e: Event | SyntheticEvent<any, Event>,
            reason: SnackbarCloseReason
        ) => {
            console.log(e);
            console.log(reason);
            if (reason === 'clickaway') return;
            setSnackbarOpen(false);
        };

        const handleAlertClose = () => {
            setSnackbarOpen(false);
        };

        const openSnackbar = (message: React.ReactNode) => {
            setSnackbarMessage(message);
            setSnackbarOpen(true);
        };

        return (
            <>
                <WrappedComponent {...props} openSnackbar={openSnackbar} />
                <Snackbar
                    // open={open}
                    // open
                    autoHideDuration={6000}
                    open={snackbarOpen}
                    message={snackbarMessage}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{
                        vertical: isSmallScreen ? 'bottom' : 'top',
                        horizontal: isSmallScreen ? 'center' : 'right',
                    }}
                >
                    <Alert
                        onClose={handleAlertClose}
                        severity="error"
                        // filled is very important to show the color base of severity
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        This is a success message!
                    </Alert>
                </Snackbar>
            </>
        );
    };

    WithStatusMessages.displayName = `WithStatusMessages(${getDisplayName(
        WrappedComponent
    )})`;

    return WithStatusMessages;
}

export default withStatusMessages;
