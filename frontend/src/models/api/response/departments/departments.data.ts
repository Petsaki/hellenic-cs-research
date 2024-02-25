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
    url: string;
    deptname: string;
    university: string;
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
    deptname: string;
    university: string;
    hindex: number;
    publications: CountPerYear[];
    citations: CountPerYear[];
    hindex5: number;
    citations5: number;
    publications5: number;
    citation_total: number;
    publication_total: number;
    average_publication: number;
    average_citation: number;
}

export interface IAcademicStaffData {
    academic_data: AcademicData[];
    years_range: number[];
    count: number;
}

// Departments Data Analytics
export interface IDepartmentData {
    inst: string;
    deptname: string;
    university: string;
    total_citations: number;
    total_publications: number;
    staff_count: number;
    avg_publications_per_staff: number;
    avg_citations_per_staff: number;
    max_publications_count: number;
    min_publications_count: number;
    max_citations_count: number;
    min_citations_count: number;
    cv_publications: number;
    cv_citations: number;
    avg_h_index: number;
    min_h_index: number;
    max_h_index: number;
}

export interface IDepartments {
    [departmentId: string]: IDepartmentData;
}

// getAcademicPositionTotals
export interface ResearchPerPosition {
    position: string;
    citations: number;
    publications: number;
}

export interface IAcademicPositionTotals {
    inst: string;
    research_per_position: ResearchPerPosition[];
}

// getAcademicStaffResearchSummary
export interface StaffResearchSummary {
    id: string;
    name: string;
    publications: number;
    citations: number;
}

export interface IAcademicStaffResearchSummary {
    inst: string;
    research: StaffResearchSummary[];
}

export type YearsArray = number[];
