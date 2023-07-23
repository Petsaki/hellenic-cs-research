import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Apis } from '../models/api/apis.enum';
import {
    DepartmentsData,
    IStatistics,
} from '../models/api/response/departments/departments.data';
import { ResponseData } from '../models/api/response/response.data';
import { IFStatistics, IFilter } from '../models/api/request/filters.data';

// Δεν έχω βάλει invalidatesTags, οπότε κάνει caching, δηλαδή ότι πρέπει για αυτήν την εφαρμογή γιατί
// τα δεδομένα στην βάση δεν πρόκειτε να αλλάξουν
export const departmentApi = createApi({
    reducerPath: 'departmentApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
    endpoints: (builder) => ({
        // query<any,any>, the first generic is the type of data response and the second generic is the request data
        getDeparment: builder.mutation<
            ResponseData<DepartmentsData[]>,
            Partial<IFilter>
        >({
            query: (body) => ({
                url: Apis.GetDepartments,
                method: 'POST',
                body,
            }),
        }),
        getDeparmentId: builder.query<ResponseData<DepartmentsData>, string>({
            query: (departmentId: string) =>
                Apis.GetDeparmentById(departmentId),
        }),
        // Apo oti thimame auto einai pou thelw, anti gia mutation thelw kanoniko query
        // Giati nomizw oti ithela na trexei me tin prwth. Me to mutation eprepe na to kalesw egw
        getJesus: builder.query<
            ResponseData<DepartmentsData[]>,
            Partial<IFilter>
        >({
            query: (body) => ({
                url: Apis.GetDepartments,
                method: 'POST',
                body,
            }),
        }),
        getStatistics: builder.mutation<
            ResponseData<IStatistics>,
            Partial<IFStatistics>
        >({
            query: (body) => ({
                url: Apis.GetStatistics,
                method: 'POST',
                body,
            }),
        }),
    }),
});

// transformResponse?(
//     baseQueryReturnValue: BaseQueryResult<BaseQuery>,
//     meta: BaseQueryMeta<BaseQuery>,
//     arg: QueryArg
//   ): ResultType | Promise<ResultType>

export const {
    useGetDeparmentMutation,
    useGetDeparmentIdQuery,
    useGetJesusQuery,
    useGetStatisticsMutation,
} = departmentApi;
