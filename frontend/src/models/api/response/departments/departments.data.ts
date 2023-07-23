export interface DepartmentsData {
    id: string;
    deptname: string;
    university: string;
    urldep: string;
    urledip: string;
    url: string;
}

export interface DepartmentId {
    id: string;
}

export interface IStatistics {
    avg_hindex: number;
    sum_publications: number;
    sum_citations: number;
    avg_hindex5: number;
    sum_publications5: number;
    sum_citations5: number;
    avg_publications_per_staff: number;
    avg_citations_per_staff: number;
    avg_publications_per_staff_per_year: number;
    avg_citations_per_staff_per_year: number;
}
