export interface AcademicStaffData {
    id: string;
    name: string;
    position: string;
    inst: string;
    hindex: number;
    publications: number;
    citations: number;
    hindex5: number;
    citations5: number;
    publications5: number;
}

export interface AcademicStaffPosition {
    position: string;
}

export interface PositionsByDepartment {
    inst: string;
    positions: Record<string, number>;
}
