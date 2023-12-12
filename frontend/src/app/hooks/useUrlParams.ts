import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import {
    addDepartment,
    setAcademicPos,
    setMaxYearsRange,
    setUnknownYear,
    setYearsRange,
} from '../slices/filtersSlice';
import {
    YearsValidation,
    isBoolean,
    isYearsArray,
    isyearRangeMaxValue,
    stringToYearArray,
} from '../untils/yearsRange';
import { AcademicStaffPosition } from '../../models/api/response/academicStaff/academicStaff.data';
import { academicPosValidation, isAcademicPos } from '../untils/academicPos';
import {
    DepartmentId,
    YearsArray,
} from '../../models/api/response/departments/departments.data';
import { departmentValidation, isDepartment } from '../untils/departments';
import useDynamicSelector from './useDynamicSelector';

const compareTwoArrays = (
    array1: Array<string | number>,
    array2: Array<string | number>
) => {
    return JSON.stringify(array1) === JSON.stringify(array2);
};

export const isStringArray = (data: FilterData): data is string[] => {
    return Array.isArray(data);
};

export enum ParamNames {
    YearsRange = 'yearsRange',
    AcademicPos = 'academicPos',
    Departments = 'departments',
    UnknownYear = 'unknownYear',
}

export type FilterData =
    | YearsArray
    | string[]
    | DepartmentId[]
    | ParamNames
    | boolean;

export interface ICheckBoxValue {
    id: string;
    checked: boolean;
}
export interface IInputValue {
    years?: string;
    checkbox?: ICheckBoxValue;
    checkboxList2?: Array<DepartmentId | string>;
    checkboxList?: Array<string>;
    unknownYear?: boolean;
}

export interface SearchParamProp {
    name: ParamNames;
    data: FilterData;
}

const useUrlParams = ({
    name,
    data,
}: SearchParamProp): [string | null, (value: IInputValue) => void] => {
    const dispatch = useDispatch();
    const paramSlice = useDynamicSelector(name);

    const [searchParams, setSearchParams] = useSearchParams();
    const [paramValue, setParamValue] = useState<string | null>('');

    const param = searchParams.get(name);

    // UPDATE - YEARS RANGE
    const updateYearsRangeSlice = (value: string) => {
        const yearsRangeArray = stringToYearArray(value);
        dispatch(
            setYearsRange([
                yearsRangeArray[0],
                yearsRangeArray[yearsRangeArray.length - 1],
            ])
        );
    };

    const updateYearsRangeURL = (years?: string): void => {
        console.log('updateYearsRangeURL');
        console.log(years);
        console.log((paramSlice as number[]).join('-'));
        console.log(param);

        if (isYearsArray(data) && years) {
            if (isyearRangeMaxValue(years, data)) {
                searchParams.delete(name);
                setSearchParams(searchParams);
            } else if (years !== param) {
                setSearchParams((prevSearchParams) => {
                    prevSearchParams.set(name, years);
                    return prevSearchParams;
                });
            }
            if (isYearsArray(paramSlice) && years !== paramSlice.join('-')) {
                updateYearsRangeSlice(years);
            }
        }
    };

    // UPDATE - ACADEMIC POSITIONS
    const updateAcademicPosSlice = (value: string[]) => {
        dispatch(setAcademicPos(value));
    };

    const updateAcademicPosURL = (academicPos?: string[]): void => {
        console.log('updateAcademicPosURL');

        if (
            isAcademicPos(data) &&
            isAcademicPos(paramSlice) &&
            academicPos &&
            !compareTwoArrays(paramSlice, academicPos)
        ) {
            if (
                academicPos.toString() === param ||
                (!param && !academicPos.toString())
            )
                return;
            if (academicPos.length) {
                setSearchParams((prevSearchParams) => {
                    prevSearchParams.set(name, academicPos.toString());
                    return prevSearchParams;
                });
            } else {
                searchParams.delete(name);
                setSearchParams(searchParams);
            }
            updateAcademicPosSlice(academicPos);
        }
    };

    // UPDATE - DEPARTMENTS
    const updateDepartmentSlice = (value: string[]) => {
        dispatch(addDepartment(value));
    };

    const updateDepartmentsURL = (department?: string[]): void => {
        if (
            isDepartment(data) &&
            isStringArray(paramSlice) &&
            department &&
            !compareTwoArrays(paramSlice, department)
        ) {
            if (
                department.toString() === param ||
                (!param && !department.toString())
            )
                return;
            if (department.length) {
                setSearchParams((prevSearchParams) => {
                    prevSearchParams.set(name, department.toString());
                    return prevSearchParams;
                });
            } else {
                searchParams.delete(name);
                setSearchParams(searchParams);
            }
            updateDepartmentSlice(department);
        }
    };

    // UPDATE - UNKNOWN YEAR
    const updateUnknownYearSlice = (value: boolean) => {
        dispatch(setUnknownYear(value));
    };

    const updateUnknownYearURL = (unknownYear?: boolean): void => {
        if (
            typeof unknownYear === 'boolean' &&
            isBoolean(paramSlice) &&
            unknownYear !== paramSlice
        ) {
            if (unknownYear) {
                if (unknownYear.toString() === param) return;
                setSearchParams((prevSearchParams) => {
                    prevSearchParams.set(name, unknownYear.toString());
                    return prevSearchParams;
                });
            } else {
                searchParams.delete(name);
                setSearchParams(searchParams);
            }
            updateUnknownYearSlice(unknownYear);
        }
    };

    const handleInputChange = (value: IInputValue) => {
        console.log(value);
        console.log(paramSlice);
        switch (name) {
            case ParamNames.YearsRange:
                updateYearsRangeURL(value.years);
                break;
            case ParamNames.AcademicPos:
                updateAcademicPosURL(value.checkboxList);
                break;
            case ParamNames.Departments:
                updateDepartmentsURL(value.checkboxList);
                break;
            case ParamNames.UnknownYear:
                updateUnknownYearURL(value.unknownYear);
                break;
            default:
                break;
        }
    };

    // INIT/RESET - YEARS RANGE
    const initYearsRange = (): void => {
        if (isYearsArray(data) && isYearsArray(paramSlice)) {
            if (param) {
                const validyearData = YearsValidation(param, data);
                handleInputChange({ years: validyearData });
                setParamValue(validyearData);
            } else if (!isyearRangeMaxValue(paramSlice.join('-'), data)) {
                dispatch(setYearsRange([data[0], data[data.length - 1]]));
            }
            dispatch(setMaxYearsRange([data[0], data[data.length - 1]]));
        }
    };

    const resetYearsRange = (): void => {
        if (isYearsArray(data)) {
            const defaultyearData = `${data[0]}-${data[data.length - 1]}`;
            console.log(defaultyearData);
            setParamValue((prevValue) => (prevValue ? null : defaultyearData));
            updateYearsRangeSlice(defaultyearData);
        }
    };

    // INIT/RESET - ACADEMIC POSITION
    const initAcademicPos = (): void => {
        console.log('initAcademicPos');

        if (isAcademicPos(data) && isAcademicPos(paramSlice)) {
            console.log(param);

            if (param) {
                const validAcademicPosData: string[] = academicPosValidation(
                    param,
                    data
                );
                console.log('initAcademicPos', validAcademicPosData);
                if (validAcademicPosData.length) {
                    setParamValue(validAcademicPosData.join(','));
                    if (!compareTwoArrays(paramSlice, validAcademicPosData)) {
                        dispatch(setAcademicPos(validAcademicPosData));
                    }
                } else {
                    searchParams.delete(name);
                    setSearchParams(searchParams);
                }
            }
        }
    };

    // INIT/RESET - DEPARTMENTS
    const initDepartments = (): void => {
        if (isDepartment(data) && isStringArray(paramSlice)) {
            if (param) {
                const validDepartmentData = departmentValidation(param, data);
                console.log('initDepartments', validDepartmentData);
                if (validDepartmentData.length) {
                    setParamValue(validDepartmentData.join(','));
                    if (!compareTwoArrays(paramSlice, validDepartmentData)) {
                        dispatch(addDepartment(validDepartmentData));
                    }
                } else {
                    searchParams.delete(name);
                    setSearchParams(searchParams);
                }
            }
        }
    };

    // INIT/RESET - UNKNOWN YEAR
    const initUnknownYear = (): void => {
        if (isBoolean(paramSlice)) {
            if (param) {
                const validUnknownYear = param.toLocaleLowerCase() === 'true';
                setParamValue(validUnknownYear.toString());
                if (validUnknownYear) {
                    if (paramSlice !== validUnknownYear) {
                        dispatch(setUnknownYear(validUnknownYear));
                    }
                } else {
                    searchParams.delete(name);
                    setSearchParams(searchParams);
                }
            }
        }
    };

    const resetUnknownYear = (): void => {
        setParamValue('false');
        updateUnknownYearSlice(false);
    };

    useEffect(() => {
        console.log(param);
        console.log(data);
        console.log('useUrlParams useEffect []');
        switch (name) {
            case ParamNames.YearsRange:
                initYearsRange();
                break;
            case ParamNames.AcademicPos:
                initAcademicPos();
                break;
            case ParamNames.Departments:
                initDepartments();
                break;
            case ParamNames.UnknownYear:
                initUnknownYear();
                break;
            default:
                break;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!param) {
            switch (name) {
                case ParamNames.YearsRange:
                    if (!isYearsArray(data)) return;
                    if (
                        isYearsArray(paramSlice) &&
                        !isyearRangeMaxValue(paramSlice.join('-'), data)
                    ) {
                        resetYearsRange();
                    }
                    break;
                case ParamNames.AcademicPos:
                    /* The expression `!(!param && !paramSlice.join(','))` is checking if either `param`
                        or `paramSlice` is not empty.
                        A NAND LOGIC GATE */
                    if (
                        isAcademicPos(paramSlice) &&
                        !(!param && !paramSlice.join(',')) &&
                        paramSlice.join(',') !== param
                    ) {
                        if (isAcademicPos(data)) {
                            const validAcademicPosData = academicPosValidation(
                                param,
                                data
                            ).join(',');

                            setParamValue(
                                validAcademicPosData ||
                                    (paramValue === null ? '' : null)
                            );
                            updateAcademicPosSlice(
                                validAcademicPosData
                                    ? validAcademicPosData.split(',')
                                    : []
                            );
                        }
                    }

                    break;
                case ParamNames.Departments:
                    /* The expression `!(!param && !paramSlice.join(','))` is checking if either `param`
                        or `paramSlice` is not empty.
                        A NAND LOGIC GATE */
                    if (
                        isStringArray(paramSlice) &&
                        !(!param && !paramSlice.join(',')) &&
                        paramSlice.join(',') !== param
                    ) {
                        if (isDepartment(data)) {
                            const validDepartmentData = departmentValidation(
                                param,
                                data
                            ).join(',');

                            setParamValue(
                                validDepartmentData ||
                                    (paramValue === null ? '' : null)
                            );
                            updateDepartmentSlice(
                                validDepartmentData
                                    ? validDepartmentData.split(',')
                                    : []
                            );
                        }
                    }
                    break;
                case ParamNames.UnknownYear:
                    if (isBoolean(paramSlice)) {
                        resetUnknownYear();
                    }
                    break;
                default:
                    break;
            }
        } else {
            switch (name) {
                case ParamNames.YearsRange:
                    /* The expression `!(!param && !paramSlice.join(','))` is checking if either `param`
                    or `paramSlice` is not empty.
                    A NAND LOGIC GATE */
                    if (
                        isYearsArray(paramSlice) &&
                        !(!param && !paramSlice.join('-')) &&
                        paramSlice.join('-') !== param
                    ) {
                        if (isYearsArray(data)) {
                            const validyearData = YearsValidation(param, data);
                            setParamValue(
                                validyearData ||
                                    (paramValue === null ? '' : null)
                            );
                            updateYearsRangeSlice(validyearData);
                        }
                    }

                    break;
                case ParamNames.AcademicPos:
                    /* The expression `!(!param && !paramSlice.join(','))` is checking if either `param`
                    or `paramSlice` is not empty.
                    A NAND LOGIC GATE */
                    if (
                        isAcademicPos(paramSlice) &&
                        !(!param && !paramSlice.join(',')) &&
                        paramSlice.join(',') !== param
                    ) {
                        if (isAcademicPos(data)) {
                            const validAcademicPosData = academicPosValidation(
                                param,
                                data
                            ).join(',');

                            setParamValue(
                                validAcademicPosData ||
                                    (paramValue === null ? '' : null)
                            );
                            updateAcademicPosSlice(
                                validAcademicPosData
                                    ? validAcademicPosData.split(',')
                                    : []
                            );
                        }
                    }

                    break;
                case ParamNames.Departments:
                    /* The expression `!(!param && !paramSlice.join(','))` is checking if either `param`
                    or `paramSlice` is not empty.
                    A NAND LOGIC GATE */
                    if (
                        isStringArray(paramSlice) &&
                        !(!param && !paramSlice.join(',')) &&
                        paramSlice.join(',') !== param
                    ) {
                        if (isDepartment(data)) {
                            const validDepartmentData = departmentValidation(
                                param,
                                data
                            ).join(',');

                            setParamValue(
                                validDepartmentData ||
                                    (paramValue === null ? '' : null)
                            );
                            updateDepartmentSlice(
                                validDepartmentData
                                    ? validDepartmentData.split(',')
                                    : []
                            );
                        }
                    }
                    break;
                case ParamNames.UnknownYear:
                    if (
                        isBoolean(paramSlice) &&
                        paramSlice.toString() !== param.toLocaleLowerCase()
                    ) {
                        const validUnknownYear =
                            param.toLocaleLowerCase() === 'true';
                        setParamValue(validUnknownYear.toString());
                        updateUnknownYearSlice(validUnknownYear);
                    }

                    break;
                default:
                    break;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [param]);

    return [paramValue, handleInputChange];
};

export default useUrlParams;
