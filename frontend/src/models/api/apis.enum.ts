export const Apis: IGeneralApis = {
    // Departments
    GetDepartments: '/departments',
    GetDeparmentById: (id: string) => `/departments/${id}`,
    GetStatistics: '/departments/statistics',
    GetAcademicStaffData: '/departments/academicStaffData/byDepartmentIds',
    GetDepartmentsData: '/departments/departmentAnalytics',
    getAcademicPositionTotals: '/departments/academicPositionTotals',
    getAcademicStaffResearchSummary:
        '/departments/academicStaffResearchSummary',

    // Publications
    getPublications: '/publications',
    getPublicationsYears: '/publications/yearsRange',

    // Academic Staff
    getAcademicPositions: '/academicStaff/positions',
    getPositionsByDepartments: '/academicStaff/positionsSumByDepartment',

    // Years Range
    getYearsRange: 'yearsRange',
};

export interface IGeneralApis extends IApis {
    // Departments
    GetDepartments: string;
    GetDeparmentById: ApiResolverFn;
    GetStatistics: string;
    GetAcademicStaffData: string;
    GetDepartmentsData: string;
    getAcademicPositionTotals: string;
    getAcademicStaffResearchSummary: string;
    // Publications
    getPublications: string;
    getPublicationsYears: string;
    // Academic Staff
    getAcademicPositions: string;
    getPositionsByDepartments: string;
    getYearsRange: string;
}

export interface IApis {
    [property: string]: string | ApiResolverFn;
}

export type ApiResolverFn = (...args: any[]) => string;
