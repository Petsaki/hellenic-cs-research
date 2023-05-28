import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Apis } from '../models/api/apis.enum';
import { AcademicStaffPosition } from '../models/api/response/academicStaff/academicStaff.data';
import { ResponseData } from '../models/api/response/response.data';

export const academicStaffApi = createApi({
    reducerPath: 'academicStaffApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
    endpoints: (builder) => ({
        getAcademicStaffPositions: builder.query<
            ResponseData<AcademicStaffPosition[]>,
            void
        >({
            query: () => Apis.getAcademicPositions,
        }),
    }),
});

export const { useGetAcademicStaffPositionsQuery } = academicStaffApi;
