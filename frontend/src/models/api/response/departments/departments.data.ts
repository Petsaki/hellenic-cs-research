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

// Academic Staff Data

export interface CountPerYear {
    year: number;
    count: number;
}

export interface AcademicData {
    id: string;
    name: string;
    position: string;
    inst: string;
    hindex: number;
    publications: CountPerYear[];
    citations: CountPerYear[];
    hindex5: number;
    citations5: number;
    publications5: number;
}

export interface IAcademicStaffData {
    academic_data: AcademicData[];
    years_range: number[];
}
