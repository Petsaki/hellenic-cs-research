export const Apis: IGeneralApis = {
    // Departments
    GetDepartments: '/departments',
    GetDeparmentById: (id: string) => `/departments/${id}`,
};

export interface IGeneralApis extends IApis {
    // Departments
    GetDepartments: string;
    GetDeparmentById: ApiResolverFn;
}

export interface IApis {
    [property: string]: string | ApiResolverFn;
}

// TODO: Make a type when i will know the parameters that i will accept
export type ApiResolverFn = (...args: any[]) => string;
