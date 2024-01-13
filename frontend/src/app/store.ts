import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { academicStaffApi } from '../services/academicStaffApi';
import { departmentApi } from '../services/departmentApi';
import { publicationApi } from '../services/publicationApi';
import filtersSliceReducer from './slices/filtersSlice';
import alertSliceReducer from './slices/alertSlice';
import rtkQueryErrorLogger from './slices/error-handler.middleware';
import { yearsRangeApi } from '../services/yearsRangeApi';

const store = configureStore({
    reducer: {
        [departmentApi.reducerPath]: departmentApi.reducer,
        [publicationApi.reducerPath]: publicationApi.reducer,
        [academicStaffApi.reducerPath]: academicStaffApi.reducer,
        [yearsRangeApi.reducerPath]: yearsRangeApi.reducer,
        filtersSlice: filtersSliceReducer,
        alertSlice: alertSliceReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            departmentApi.middleware,
            publicationApi.middleware,
            academicStaffApi.middleware,
            yearsRangeApi.middleware,
            rtkQueryErrorLogger
        ),
});
// It will fetch after on internet reconnect or on mount
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
