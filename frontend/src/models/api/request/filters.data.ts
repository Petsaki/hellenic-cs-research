export interface IFilter {
    filter: string[] | string;
}

export interface IFDepartment {
    departments: string[] | string;
}

export interface IFStatistics {
    departments: string[] | string;
    positions?: string[] | string;
}

export interface IFAcademicStaff {
    departments: string[] | string;
    positions?: string[] | string;
    years: number[];
    page: number;
    size?: number;
    unknown_year: boolean;
}

export interface IFDepartmentsData {
    positions?: string[] | string;
    years: number[];
    departments?: string[] | string;
}

export interface IFAcademicPositionTotals {
    departments: string[] | string;
    positions: string[] | string;
    years: number[];
}
