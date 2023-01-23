import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { departmentApi } from '../services/departmentApi';
import { publicationApi } from '../services/publicationApi';
import testSliceReducer from './slices/testSlice';

const store = configureStore({
    reducer: {
        [departmentApi.reducerPath]: departmentApi.reducer,
        [publicationApi.reducerPath]: publicationApi.reducer,
        testSlice: testSliceReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            departmentApi.middleware,
            publicationApi.middleware
        ),
});
// It will fetch after on internet reconnect or on mount
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
