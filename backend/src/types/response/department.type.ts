// Academic staff data interfaces
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
    citationTotal: number;
    publicationTotal: number;
    averagePublication: number;
    averageCitation: number;
}

export interface IAcademicStaffData {
    academic_data: AcademicData[];
    years_range: number[];
    count: number;
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

export interface IStatisticsPerDepartment extends IStatistics {
    inst: string;
}

// getAcademicPositionTotals
export interface ResearchPerPosition {
    position: string;
    citations: number;
    publications: number;
}

export interface IAcademicPositionTotals {
    inst: string;
    researchPerPosition: ResearchPerPosition[];
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

// getDepartmentsAnalyticsData
export interface DepartmentsStaticStats {
    staffCount: number,
    avgPublicationsPerStaff: number,
    avgCitationsPerStaff: number,
    cvPublications: number,
    cvCitations: number,
    avgHIndex: number,
    minHIndex: number,
    maxHIndex: number,
    inst: string;
}

export interface DepartmentsDynamicStats {
    totalCitations: number,
    totalPublications: number,
    maxPublicationsCount: number,
    minPublicationsCount: number,
    maxCitationsCount: number,
    minCitationsCount: number
}

export interface DepartmentsStats extends DepartmentsStaticStats, DepartmentsDynamicStats { }