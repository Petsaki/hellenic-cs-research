import { configureStore } from '@reduxjs/toolkit';
import { departmentApi } from '../services/departmentApi';

export default configureStore({
    reducer: {
        [departmentApi.reducerPath]: departmentApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(departmentApi.middleware),
});
