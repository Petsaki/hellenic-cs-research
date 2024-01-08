import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
    IFilterSlice,
    addDepartment,
    setAcademicPos,
    setMaxYearsRange,
    setYearsFilters,
} from '../slices/filtersSlice';
import {
    YearsValidation,
    isYearsArray,
    isYearsFilters,
    isyearRangeMaxValue,
    stringToYearArray,
} from '../untils/yearsRange';
import { academicPosValidation, isAcademicPos } from '../untils/academicPos';
import {
    DepartmentId,
    YearsArray,
} from '../../models/api/response/departments/departments.data';
import { departmentValidation, isDepartment } from '../untils/departments';
import useDynamicSelector from './useDynamicSelector';
import { YearsFilters } from '../../components/Filters/YearsSlider';

import { RootState } from '../store';

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
    | string[]
    | IFilterSlice
    | YearsFilters
    | YearsArray
    | DepartmentId[];

export interface ICheckBoxValue {
    id: string;
    checked: boolean;
}
export interface IInputValue {
    yearsFilters?: YearsFilters;
    checkbox?: ICheckBoxValue;
    checkboxList2?: Array<DepartmentId | string>;
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
    const paramSlice = useDynamicSelector(name);

    const [searchParams, setSearchParams] = useSearchParams();
    const [paramValue, setParamValue] = useState<string | null>('');
    const selectedYears = useSelector(
        (state: RootState) => state.filtersSlice.yearsFilters.yearsRange
    );

    const param = searchParams.get(name);

    // UPDATE - UNKNOWN YEAR
    const updateUnknownYearSlice = (value: boolean) => {
        dispatch(setYearsFilters({ unknownYear: value }));
    };

    // UPDATE - YEARS RANGE
    const updateYearsRangeSlice = (value: string, unknownValue: boolean) => {
        const yearsRangeArray = stringToYearArray(value);
        dispatch(
            setYearsFilters({
                yearsRange: [
                    yearsRangeArray[0],
                    yearsRangeArray[yearsRangeArray.length - 1],
                ],
                unknownYear: unknownValue,
            })
        );
    };

    const updateYearsRangeURL = (
        years?: string,
        unknownYear?: boolean
    ): void => {
        if (isYearsFilters(paramSlice) && isYearsArray(data) && years) {
            if (isyearRangeMaxValue(years, data)) {
                searchParams.delete(name);
                if (unknownYear) {
                    searchParams.set(
                        ParamNames.UnknownYear,
                        unknownYear.toString().toLowerCase()
                    );
                } else {
                    searchParams.delete(ParamNames.UnknownYear);
                }
                setSearchParams(searchParams);
            } else if (years !== param) {
                setSearchParams((prevSearchParams) => {
                    prevSearchParams.delete(ParamNames.UnknownYear);
                    prevSearchParams.set(name, years);
                    return prevSearchParams;
                });
            }
            if (years !== paramSlice.yearsRange.join('-')) {
                updateYearsRangeSlice(
                    years,
                    (isyearRangeMaxValue(years, data) && unknownYear) ?? false
                );
            }
        }
    };

    // UPDATE - ACADEMIC POSITIONS
    const updateAcademicPosSlice = (value: string[]) => {
        dispatch(setAcademicPos(value));
    };

    const updateAcademicPosURL = (academicPos?: string[]): void => {
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

    const handleInputChange = (value: IInputValue) => {
        switch (name) {
            case ParamNames.YearsRange:
                updateYearsRangeURL(
                    value.yearsFilters?.yearsRange.toString().replace(',', '-'),
                    value.yearsFilters?.unknownYear
                );
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
        if (
            isYearsFilters(paramSlice) &&
            isYearsArray(data) &&
            isYearsArray(paramSlice.yearsRange)
        ) {
            if (param) {
                const validyearData = YearsValidation(param, data);
                handleInputChange({
                    yearsFilters: {
                        yearsRange: stringToYearArray(validyearData),
                        unknownYear: false,
                    },
                });

                const createYearsFilterObject: YearsFilters = {
                    yearsRange: stringToYearArray(validyearData),
                    unknownYear: false,
                };
                setParamValue(JSON.stringify(createYearsFilterObject));
            } else if (
                !isyearRangeMaxValue(paramSlice.yearsRange.join('-'), data)
            ) {
                const unknownYearUrl = searchParams.get(ParamNames.UnknownYear);

                dispatch(
                    setYearsFilters({
                        yearsRange: [data[0], data[data.length - 1]],
                        ...(unknownYearUrl?.toLocaleLowerCase() === 'true' && {
                            unknownYear: true,
                        }),
                    })
                );
                const createYearsFilterObject: YearsFilters = {
                    yearsRange: [data[0], data[data.length - 1]],
                    unknownYear: unknownYearUrl?.toLocaleLowerCase() === 'true',
                };
                setParamValue(JSON.stringify(createYearsFilterObject));
            }
            dispatch(setMaxYearsRange([data[0], data[data.length - 1]]));
        }
    };

    const resetYearsRange = (): void => {
        if (isYearsArray(data)) {
            const defaultyearData = `${data[0]}-${data[data.length - 1]}`;

            const unknownYearUrl = searchParams.get(ParamNames.UnknownYear);
            const createYearsFilterObject: YearsFilters = {
                yearsRange:
                    paramValue &&
                    (JSON.parse(paramValue) as YearsFilters).yearsRange.length
                        ? []
                        : stringToYearArray(defaultyearData),
                unknownYear: unknownYearUrl?.toLocaleLowerCase() === 'true',
            };

            setParamValue(JSON.stringify(createYearsFilterObject));
            // setParamValue((prevValue) => (prevValue ? null : defaultyearData));
            updateYearsRangeSlice(
                defaultyearData,
                unknownYearUrl?.toLocaleLowerCase() === 'true'
            );
        }
    };

    // INIT/RESET - ACADEMIC POSITION
    const initAcademicPos = (): void => {
        if (isAcademicPos(data) && isAcademicPos(paramSlice)) {
            if (param) {
                const validAcademicPosData: string[] = academicPosValidation(
                    param,
                    data
                );

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

    useEffect(() => {
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
                    if (!isYearsArray(data)) return;
                    if (
                        isYearsFilters(paramSlice) &&
                        !isyearRangeMaxValue(
                            paramSlice.yearsRange.join('-'),
                            data
                        )
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
                    setParamValue('false');
                    updateUnknownYearSlice(false);
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
                        isYearsFilters(paramSlice) &&
                        !(!param && !paramSlice.yearsRange.join('-')) &&
                        paramSlice.yearsRange.join('-') !== param
                    ) {
                        if (isYearsArray(data)) {
                            const validyearData = YearsValidation(param, data);

                            const unknownYearValue = searchParams.get(
                                ParamNames.UnknownYear
                            );

                            const createYearsFilterObject = {
                                yearsRange:
                                    stringToYearArray(validyearData) ||
                                    (paramValue &&
                                    (
                                        JSON.parse(paramValue) as YearsFilters
                                    ).yearsRange.toString() === ''
                                        ? [0]
                                        : []),
                                unknownYear:
                                    paramValue &&
                                    (JSON.parse(paramValue) as YearsFilters)
                                        .unknownYear === false
                                        ? null
                                        : false,
                            };
                            setParamValue(
                                JSON.stringify(createYearsFilterObject)
                            );

                            updateYearsRangeSlice(validyearData, false);
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
                    // eslint-disable-next-line no-case-declarations
                    const urlYears =
                        searchParams.get(ParamNames.YearsRange) ?? '';
                    if (
                        (isYearsArray(data) &&
                            isyearRangeMaxValue(urlYears.toString(), data)) ||
                        !urlYears
                    ) {
                        setParamValue(
                            JSON.stringify(param.toLocaleLowerCase() === 'true')
                        );
                        updateUnknownYearSlice(
                            param.toLocaleLowerCase() === 'true'
                        );
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
