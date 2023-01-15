import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Apis } from '../models/api/apis.enum';
import { DepartmentsData } from '../models/api/response/departments/departments.data';
import { ResponseData } from '../models/api/response/response.data';

export const departmentApi = createApi({
    reducerPath: 'departmentApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
    endpoints: (builder) => ({
        // query<any,any>, the first generic is the type of data response and the second generic is the request data
        getDeparment: builder.query<ResponseData<DepartmentsData[]>, void>({
            query: () => Apis.GetDepartments,
        }),
        getDeparmentId: builder.query<ResponseData<DepartmentsData>, string>({
            query: (departmentId: string) =>
                Apis.GetDeparmentById(departmentId),
        }),
    }),
});

export const { useGetDeparmentQuery, useGetDeparmentIdQuery } = departmentApi;
