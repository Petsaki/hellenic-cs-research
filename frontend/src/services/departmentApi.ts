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

// I haven't included invalidatesTags, so it performs caching, which is appropriate for this application because
// the data in the database is not expected to change.
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
        // From what I remember, this is what I want instead of a mutation, I want a regular query.
        // Because I wanted it to run with the first. With the mutation, I had to call it
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
