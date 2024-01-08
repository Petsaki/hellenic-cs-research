import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Apis } from '../models/api/apis.enum';
import {
    DepartmentsData,
    IAcademicPositionTotals,
    IAcademicStaffData,
    IAcademicStaffResearchSummary,
    IDepartmentData,
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
import constructQueryString from '../app/untils/queryConstructor';

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
                url: `${Apis.GetDepartments}?${constructQueryString({
                    filter,
                })}`,
                method: 'GET',
            }),
        }),
        getStatistics: builder.mutation<
            ResponseData<IStatistics>,
            Partial<IFStatistics>
        >({
            query: ({ departments, positions }) => ({
                url: `${Apis.GetStatistics}?${constructQueryString({
                    departments,
                    positions,
                })}`,
                method: 'GET',
            }),
        }),
        getAcademicStaffData: builder.mutation<
            ResponseData<IAcademicStaffData>,
            Partial<IFAcademicStaff>
        >({
            query: ({
                departments,
                page,
                positions,
                size,
                years,
                unknown_year,
            }) => ({
                url: `${Apis.GetAcademicStaffData}?${constructQueryString({
                    departments,
                    positions,
                    years: years?.map(String),
                    unknown_year,
                    page: page?.toString(),
                    size: size?.toString(),
                })}`,
                method: 'GET',
            }),
        }),
        getDepartmentsData: builder.mutation<
            ResponseData<IDepartmentData[]>,
            Partial<IFDepartmentsData>
        >({
            query: ({ years, departments, positions, unknown_year }) => ({
                url: `${Apis.GetDepartmentsData}?${constructQueryString({
                    departments,
                    positions,
                    years: years?.map(String),
                    unknown_year,
                })}`,
                method: 'GET',
            }),
        }),
        getAcademicPositionTotals: builder.query<
            ResponseData<IAcademicPositionTotals[]>,
            IFAcademicPositionTotals
        >({
            query: ({ departments, positions, years, unknown_year }) => ({
                url: `${Apis.getAcademicPositionTotals}?${constructQueryString({
                    departments,
                    positions,
                    years: years?.map(String),
                    unknown_year,
                })}`,
                method: 'GET',
            }),
        }),
        getResearchSummary: builder.query<
            ResponseData<IAcademicStaffResearchSummary[]>,
            IFAcademicPositionTotals
        >({
            query: ({ departments, positions, years, unknown_year }) => ({
                url: `${
                    Apis.getAcademicStaffResearchSummary
                }?${constructQueryString({
                    departments,
                    positions,
                    years: years?.map(String),
                    unknown_year,
                })}`,
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
