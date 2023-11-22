import { IDep } from "../types";

export const departmentsValidation = async (departments: string[] | string, cacheDepartments: {id: string}[]): Promise<void> => {
    const targetDepartments = Array.isArray(departments) ? departments : [departments];
    if (!targetDepartments.every((targetDepartment) => cacheDepartments.some((obj) => obj.id === targetDepartment))) {
        throw new Error(`Wrong departments ids.`);
    }
};

export const positionsValidation = (positions: string | string[], cachePositions: string[]) => {
    const targetPositions = Array.isArray(positions) ? positions : [positions];
    if (!targetPositions.every((targetPosition) => cachePositions.some((position) => position === targetPosition))) {
        throw new Error(`Wrong positions names.`);
    }
}

export const yearsValidation = (years: number[], cacheYears: number[]) => {
    if (!years.every((year) => cacheYears.includes(year))) {
        throw new Error(`No data for this years exists.`);
    }
}