export const Apis: IGeneralApis = {
    // Departments
    GetDepartments: '/departments',
    GetDeparmentById: (id: string) => `/departments/${id}`,

    // Publications
    getPublications: '/publications',
    getPublicationsYears: '/publications/yearsRange',

    // Academic Staff
    getAcademicPositions: '/academic-staff/positions',
    getPositionsByDepartments: '/academic-staff/positionsSumByDepartment',
};

export interface IGeneralApis extends IApis {
    // Departments
    GetDepartments: string;
    GetDeparmentById: ApiResolverFn;
    // Publications
    getPublications: string;
    getPublicationsYears: string;
    // Academic Staff
    getAcademicPositions: string;
    getPositionsByDepartments: string;
}

export interface IApis {
    [property: string]: string | ApiResolverFn;
}

// TODO: Make a type when i will know the parameters that i will accept
export type ApiResolverFn = (...args: any[]) => string;
