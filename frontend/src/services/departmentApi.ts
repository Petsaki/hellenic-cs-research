import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Apis } from '../models/api/apis.enum';
import {
    DepartmentsData,
    IAcademicPositionTotals,
    IAcademicStaffData,
    IAcademicStaffResearchSummary,
    IDepartments,
    IStatistics,
} from '../models/api/response/departments/departments.data';
import { ResponseData } from '../models/api/response/response.data';
import {
    IFAcademicPositionTotals,
    IFAcademicStaff,
    IFDepartmentsData,
    IFStatistics,
    IFilter,
} from '../models/api/request/filters.data';

// Δεν έχω βάλει invalidatesTags, οπότε κάνει caching, δηλαδή ότι πρέπει για αυτήν την εφαρμογή γιατί
// τα δεδομένα στην βάση δεν πρόκειτε να αλλάξουν
export const departmentApi = createApi({
    reducerPath: 'departmentApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
    endpoints: (builder) => ({
        // query<any,any>, the first generic is the type of data response and the second generic is the request data
        getDepartment: builder.mutation<
            ResponseData<DepartmentsData[]>,
            Partial<IFilter>
        >({
            query: (body) => ({
                url: Apis.GetDepartments,
                method: 'POST',
                body,
            }),
        }),
        getDepartmentId: builder.query<ResponseData<DepartmentsData>, string>({
            query: (departmentId: string) =>
                Apis.GetDeparmentById(departmentId),
        }),
        // Apo oti thimame auto einai pou thelw, anti gia mutation thelw kanoniko query
        // Giati nomizw oti ithela na trexei me tin prwth. Me to mutation eprepe na to kalesw egw
        getDepartments: builder.query<
            ResponseData<DepartmentsData[]>,
            Partial<IFilter>
        >({
            query: ({ filter }) => ({
                url: `${Apis.GetDepartments}${
                    filter
                        ? `?filter=${
                              Array.isArray(filter) ? filter.join(',') : filter
                          }`
                        : ''
                }`,
                method: 'GET',
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
        getAcademicStaffData: builder.mutation<
            ResponseData<IAcademicStaffData>,
            Partial<IFAcademicStaff>
        >({
            query: ({ departments, page, positions, size, years }) => ({
                url: `${Apis.GetAcademicStaffData}?departments=${
                    Array.isArray(departments)
                        ? departments.join(',')
                        : departments
                }&positions=${
                    Array.isArray(positions) ? positions.join(',') : positions
                }${years && `&years=${years.join(',')}`}&page=${page}${
                    size != null && `&size=${size}`
                }`,
                method: 'GET',
            }),
        }),
        getDepartmentsData: builder.mutation<
            ResponseData<IDepartments>,
            Partial<IFDepartmentsData>
        >({
            query: (body) => ({
                url: Apis.GetDepartmentsData,
                method: 'POST',
                body,
            }),
        }),
        getAcademicPositionTotals: builder.query<
            ResponseData<IAcademicPositionTotals[]>,
            IFAcademicPositionTotals
        >({
            query: ({ departments, positions, years }) => ({
                url: `${Apis.getAcademicPositionTotals}?departments=${
                    Array.isArray(departments)
                        ? departments.join(',')
                        : departments
                }&positions=${
                    Array.isArray(positions) ? positions.join(',') : positions
                }&years=${years.join(',')}`,
                method: 'GET',
            }),
        }),
        getResearchSummary: builder.query<
            ResponseData<IAcademicStaffResearchSummary[]>,
            IFAcademicPositionTotals
        >({
            query: ({ departments, positions, years }) => ({
                url: `${Apis.getAcademicStaffResearchSummary}?departments=${
                    Array.isArray(departments)
                        ? departments.join(',')
                        : departments
                }&positions=${
                    Array.isArray(positions) ? positions.join(',') : positions
                }&years=${years.join(',')}`,
                method: 'GET',
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
    useGetDepartmentMutation,
    useGetDepartmentIdQuery,
    useGetDepartmentsQuery,
    useGetStatisticsMutation,
    useGetAcademicStaffDataMutation,
    useGetDepartmentsDataMutation,
    useGetAcademicPositionTotalsQuery,
    useGetResearchSummaryQuery,
} = departmentApi;
