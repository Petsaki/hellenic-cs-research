import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Apis } from '../models/api/apis.enum';
import {
    AcademicStaffPosition,
    PositionsByDepartment,
} from '../models/api/response/academicStaff/academicStaff.data';
import { ResponseData } from '../models/api/response/response.data';
import { IFDepartment } from '../models/api/request/filters.data';

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
        getPositionsByDepartments: builder.mutation<
            ResponseData<PositionsByDepartment[]>,
            Partial<IFDepartment>
        >({
            query: ({ departments }) => ({
                url: `${Apis.getPositionsByDepartments}?departments=${
                    Array.isArray(departments)
                        ? departments.join(',')
                        : departments
                }`,
                method: 'GET',
            }),
        }),
    }),
});

export const {
    useGetAcademicStaffPositionsQuery,
    useGetPositionsByDepartmentsMutation,
} = academicStaffApi;
