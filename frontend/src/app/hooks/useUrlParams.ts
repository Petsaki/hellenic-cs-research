import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { PublicationsYear } from '../../models/api/response/publications/publications.data';
import {
    addDepartment,
    setAcademicPos,
    setMaxYearsRange,
    setYearsRange,
} from '../slices/filtersSlice';
import {
    PublicationsYearValidation,
    isPublicationsYear,
    isyearRangeMaxValue,
    stringToYearArray,
} from '../untils/yearsRange';
import { AcademicStaffPosition } from '../../models/api/response/academicStaff/academicStaff.data';
import { academicPosValidation, isAcademicPos } from '../untils/academicPos';
import { DepartmentId } from '../../models/api/response/departments/departments.data';
import { departmentValidation, isDepartment } from '../untils/departments';
import useDynamicSelector from './useDynamicSelector';

const compareTwoArrays = (
    array1: Array<string | number>,
    array2: Array<string | number>
) => {
    return JSON.stringify(array1) === JSON.stringify(array2);
};

export enum ParamNames {
    YearsRange = 'yearsRange',
    AcademicPos = 'academicPos',
    Departments = 'departments',
}

export type FilterData =
    | PublicationsYear[]
    | AcademicStaffPosition[]
    | DepartmentId[]
    | ParamNames;

export interface ICheckBoxValue {
    id: string;
    checked: boolean;
}
export interface IInputValue {
    years?: string;
    checkbox?: ICheckBoxValue;
    checkboxList2?: Array<DepartmentId | AcademicStaffPosition>;
    checkboxList?: Array<string>;
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
    const paraSlice = useDynamicSelector(name);

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
        console.log(paraSlice.join('-'));
        console.log(param);

        if (isPublicationsYear(data) && years) {
            if (isyearRangeMaxValue(years, data)) {
                searchParams.delete(name);
                setSearchParams(searchParams);
            } else if (years !== param) {
                setSearchParams((prevSearchParams) => {
                    prevSearchParams.set(name, years);
                    return prevSearchParams;
                });
            }
            if (years !== paraSlice.join('-')) {
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
            academicPos &&
            !compareTwoArrays(paraSlice, academicPos)
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
            department &&
            !compareTwoArrays(paraSlice, department)
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

    const handleInputChange = (value: IInputValue) => {
        console.log(value);
        console.log(paraSlice);
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
            default:
                break;
        }
    };

    // INIT/RESET - YEARS RANGE
    const initYearsRange = (): void => {
        if (isPublicationsYear(data)) {
            if (param) {
                const validyearData = PublicationsYearValidation(param, data);
                handleInputChange({ years: validyearData });
                setParamValue(validyearData);
            } else if (!isyearRangeMaxValue(paraSlice.join('-'), data)) {
                dispatch(
                    setYearsRange([data[0].year, data[data.length - 1].year])
                );
            }
            dispatch(
                setMaxYearsRange([data[0].year, data[data.length - 1].year])
            );
        }
    };

    const resetYearsRange = (): void => {
        if (isPublicationsYear(data)) {
            const defaultyearData = `${data[0].year}-${
                data[data.length - 1].year
            }`;
            console.log(defaultyearData);
            setParamValue((prevValue) => (prevValue ? null : defaultyearData));
            updateYearsRangeSlice(defaultyearData);
        }
    };

    // INIT/RESET - ACADEMIC POSITION
    const initAcademicPos = (): void => {
        console.log('initAcademicPos');

        if (isAcademicPos(data)) {
            console.log(param);

            if (param) {
                const validAcademicPosData: string[] = academicPosValidation(
                    param,
                    data
                );
                console.log('initAcademicPos', validAcademicPosData);
                if (validAcademicPosData.length) {
                    setParamValue(validAcademicPosData.join(','));
                    if (!compareTwoArrays(paraSlice, validAcademicPosData)) {
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
        if (isDepartment(data)) {
            if (param) {
                const validDepartmentData = departmentValidation(param, data);
                console.log('initDepartments', validDepartmentData);
                if (validDepartmentData.length) {
                    setParamValue(validDepartmentData.join(','));
                    if (!compareTwoArrays(paraSlice, validDepartmentData)) {
                        dispatch(addDepartment(validDepartmentData));
                    }
                } else {
                    searchParams.delete(name);
                    setSearchParams(searchParams);
                }
            }
        }
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
            default:
                break;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!param) {
            switch (name) {
                case ParamNames.YearsRange:
                    if (!isPublicationsYear(data)) return;
                    if (!isyearRangeMaxValue(paraSlice.join('-'), data)) {
                        resetYearsRange();
                    }
                    break;
                case ParamNames.AcademicPos:
                    /* The expression `!(!param && !paraSlice.join(','))` is checking if either `param`
                        or `paraSlice` is not empty.
                        A NAND LOGIC GATE */
                    if (
                        !(!param && !paraSlice.join(',')) &&
                        paraSlice.join(',') !== param
                    ) {
                        setParamValue(
                            param || (paramValue === null ? '' : null)
                        );
                        updateAcademicPosSlice(param ? param.split(',') : []);
                    }

                    break;
                case ParamNames.Departments:
                    /* The expression `!(!param && !paraSlice.join(','))` is checking if either `param`
                        or `paraSlice` is not empty.
                        A NAND LOGIC GATE */
                    if (
                        !(!param && !paraSlice.join(',')) &&
                        paraSlice.join(',') !== param
                    ) {
                        setParamValue(
                            param || (paramValue === null ? '' : null)
                        );
                        updateDepartmentSlice(param ? param.split(',') : []);
                    }
                    break;
                default:
                    break;
            }
        } else {
            switch (name) {
                case ParamNames.YearsRange:
                    /* The expression `!(!param && !paraSlice.join(','))` is checking if either `param`
                    or `paraSlice` is not empty.
                    A NAND LOGIC GATE */
                    if (
                        !(!param && !paraSlice.join('-')) &&
                        paraSlice.join('-') !== param
                    ) {
                        if (isPublicationsYear(data)) {
                            setParamValue(
                                param || (paramValue === null ? '' : null)
                            );
                            updateYearsRangeSlice(
                                PublicationsYearValidation(param, data)
                            );
                        }
                    }

                    break;
                case ParamNames.AcademicPos:
                    /* The expression `!(!param && !paraSlice.join(','))` is checking if either `param`
                    or `paraSlice` is not empty.
                    A NAND LOGIC GATE */
                    if (
                        !(!param && !paraSlice.join(',')) &&
                        paraSlice.join(',') !== param
                    ) {
                        setParamValue(
                            param || (paramValue === null ? '' : null)
                        );
                        updateAcademicPosSlice(param ? param.split(',') : []);
                    }

                    break;
                case ParamNames.Departments:
                    /* The expression `!(!param && !paraSlice.join(','))` is checking if either `param`
                    or `paraSlice` is not empty.
                    A NAND LOGIC GATE */
                    if (
                        !(!param && !paraSlice.join(',')) &&
                        paraSlice.join(',') !== param
                    ) {
                        setParamValue(
                            param || (paramValue === null ? '' : null)
                        );
                        updateDepartmentSlice(param ? param.split(',') : []);
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
