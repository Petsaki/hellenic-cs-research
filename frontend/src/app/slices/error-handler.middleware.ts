import { isRejectedWithValue } from '@reduxjs/toolkit';
import type { MiddlewareAPI, Middleware } from '@reduxjs/toolkit';
import { setAlert } from './alertSlice';

const rtkQueryErrorLogger: Middleware =
    (api: MiddlewareAPI) => (next) => (action) => {
        if (isRejectedWithValue(action)) {
            if (action?.payload?.status === 'FETCH_ERROR') {
                api.dispatch(
                    setAlert({
                        message: "Couldn't connect to the server",
                        type: 'error',
                    })
                );
            }
        }

        return next(action);
    };

export default rtkQueryErrorLogger;
