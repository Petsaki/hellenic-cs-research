export interface IFilter {
    filter: string;
}

export interface IFDepartment {
    departments: string[] | string;
}

export interface IFStatistics {
    departments: string[] | string;
    positions?: string[] | string;
}
