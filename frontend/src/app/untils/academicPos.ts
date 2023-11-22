import { AcademicStaffPosition } from '../../models/api/response/academicStaff/academicStaff.data';
import { FilterData } from '../hooks/useUrlParams';

export const removeAcademicPosForUrlParam = (
    paramValue: string,
    academicToRemove: string
): string => {
    const academics = paramValue.split(',');
    const updatedAcademics = academics.filter(
        (academic) => academic !== academicToRemove
    );
    const updatedValue = updatedAcademics.join(',');
    return updatedValue;
};

export const academicPosValidation = (
    param: string | null,
    data: string[]
): string[] => {
    let validAcademisData: string[] = [];
    if (param) {
        const academics = param.split(',');
        validAcademisData = academics.filter((academic) =>
            data.some((position) => position === academic)
        );
    }
    return validAcademisData;
};

// Type guard
export const isAcademicPos = (data: FilterData): data is string[] => {
    return Array.isArray(data);
};
