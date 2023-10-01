import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the alert state interface
export interface AlertState {
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
    duration?: number;
    isOpen?: boolean;
}

// Initial state for the alert slice
const initialState: AlertState = {
    message: '',
    type: 'info',
    duration: 5000,
    isOpen: false,
};

const alertSlice = createSlice({
    name: 'alertSlice',
    initialState,
    reducers: {
        setAlert: (state, action: PayloadAction<AlertState>) => {
            return action.payload;
        },
    },
});

export const { setAlert } = alertSlice.actions;

export default alertSlice.reducer;
