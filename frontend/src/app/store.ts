import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { academicStaffApi } from '../services/academicStaffApi';
import { departmentApi } from '../services/departmentApi';
import { publicationApi } from '../services/publicationApi';
import testSliceReducer from './slices/testSlice';
import rtkQueryErrorLogger from './slices/error-handler.middleware';
import { yearsRangeApi } from '../services/yearsRangeApi';

const store = configureStore({
    reducer: {
        [departmentApi.reducerPath]: departmentApi.reducer,
        [publicationApi.reducerPath]: publicationApi.reducer,
        [academicStaffApi.reducerPath]: academicStaffApi.reducer,
        [yearsRangeApi.reducerPath]: yearsRangeApi.reducer,
        testSlice: testSliceReducer,
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

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
