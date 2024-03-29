import { DepartmentId } from '../../models/api/response/departments/departments.data';
import { FilterData } from '../hooks/useUrlParams';

export const removeDepartmentForUrlParam = (
    paramValue: string,
    academicToRemove: string
): string => {
    const departments = paramValue.split(',');
    const updatedDepartments = departments.filter(
        (academic) => academic !== academicToRemove
    );
    const updatedValue = updatedDepartments.join(',');
    return updatedValue;
};

export const departmentValidation = (
    param: string | null,
    data: DepartmentId[]
): string[] => {
    let validDepartmentData: string[] = [];
    if (param) {
        const departments = param.split(',');
        validDepartmentData = departments.filter((department) =>
            data.some((dataItem) => dataItem.id === department)
        );
    }
    return validDepartmentData;
};

// Type guards
export const isDepartment = (data: FilterData): data is DepartmentId[] => {
    return Array.isArray(data);
};
