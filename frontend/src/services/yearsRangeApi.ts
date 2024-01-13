import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Apis } from '../models/api/apis.enum';
import { ResponseData } from '../models/api/response/response.data';

export const yearsRangeApi = createApi({
    reducerPath: 'yearsRangeApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
    endpoints: (builder) => ({
        getYearsRange: builder.query<ResponseData<number[]>, void>({
            query: () => Apis.getYearsRange,
        }),
    }),
});

export const { useGetYearsRangeQuery } = yearsRangeApi;
