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
    isBoolean,
    isYearsArray,
    isYearsFilters,
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
        console.log(paramSlice);

        dispatch(setYearsFilters({ unknownYear: value }));
    };

    // const updateUnknownYearURL = (unknownYear?: boolean): void => {
    //     if (
    //         typeof unknownYear === 'boolean' &&
    //         isBoolean(paramSlice) &&
    //         unknownYear !== paramSlice
    //     ) {
    //         if (unknownYear) {
    //             if (unknownYear.toString() === param) return;
    //             setSearchParams((prevSearchParams) => {
    //                 prevSearchParams.set(name, unknownYear.toString());
    //                 return prevSearchParams;
    //             });
    //         } else {
    //             searchParams.delete(name);
    //             setSearchParams(searchParams);
    //         }
    //         updateUnknownYearSlice(unknownYear);
    //     }
    // };

    // UPDATE - YEARS RANGE
    const updateYearsRangeSlice = (value: string, unknownValue: boolean) => {
        console.log('updateYearsRangeSlice', value);
        console.log(unknownValue);
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
        console.log('updateYearsRangeURL');
        console.log(years);
        // console.log((paramSlice as number[]).join('-'));
        console.log(param);
        console.log(isYearsArray(data));
        console.log(unknownYear);

        if (isYearsFilters(paramSlice) && isYearsArray(data) && years) {
            if (isyearRangeMaxValue(years, data)) {
                console.log('isyearRangeMaxValue(years, data)');
                console.log(searchParams.get(name));

                searchParams.delete(name);
                if (unknownYear) {
                    searchParams.set(
                        ParamNames.UnknownYear,
                        unknownYear.toString().toLowerCase()
                    );
                } else {
                    searchParams.delete(ParamNames.UnknownYear);
                }
                // if (unknownYear !== undefined) {
                //     updateUnknownYearSlice(unknownYear);
                // }
                setSearchParams(searchParams);
            } else if (years !== param) {
                console.log('(years !== param)');

                setSearchParams((prevSearchParams) => {
                    prevSearchParams.delete(ParamNames.UnknownYear);
                    prevSearchParams.set(name, years);
                    return prevSearchParams;
                });
            }
            if (years !== paramSlice.yearsRange.join('-')) {
                console.log('years !== paramSlice.yearsRange.join');

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

    const handleInputChange = (value: IInputValue) => {
        console.log(value);
        console.log(paramSlice);
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
            // case ParamNames.UnknownYear:
            //     updateUnknownYearURL(value.unknownYear);
            //     break;
            default:
                break;
        }
    };

    // INIT/RESET - YEARS RANGE
    const initYearsRange = (): void => {
        console.log('KANW INIT GAMW?');
        console.log(isYearsArray(data));
        console.log(paramSlice);

        console.log(isYearsArray(paramSlice));

        if (
            isYearsFilters(paramSlice) &&
            isYearsArray(data) &&
            isYearsArray(paramSlice.yearsRange)
        ) {
            console.log(
                'if (isYearsArray(data) && isYearsArray(paramSlice)) {'
            );

            if (param) {
                console.log('if (param) {');

                const validyearData = YearsValidation(param, data);
                handleInputChange({
                    yearsFilters: {
                        yearsRange: stringToYearArray(validyearData),
                        // Για τώρα απλά θα παίρνω το value από το url.
                        // Εάν είναι διαφορετικό από το max years τότε πρέπει να το βγάζω από το url!
                        // Αλλά να μην το αλλάζω το value του, που δεν ξέρω από που θα το ξέρω :/
                        // ΞΈΧΝΑ ΤΑ ΌΛΑ
                        // Είναι το Init, οπότε απλά θα το χτίζω σύμφωνα με το εάν υπάρχει ή όχι στο url αλλά
                        // Θα πρέπει να κάνω όμως τον έλεγχο εάν θα πρέπει να υπάρχει το unknown year αφού ο χρήστης μπορεί να βάλει ότι θέλει
                        // Και αφού κάνει init το value του θα είναι false εκτός άμα υπάρχει και έαν το yearRange είναι ίσο με το max!!
                        unknownYear: false,
                    },
                });
                console.log('console.log 1', validyearData);
                // Πρέπει να κάνω σωστά έλεγχο για το τι value θα δώσω εδώ στο paramValue κατά πάσα πιθανότητα ότι γράφω επάνω
                // θα πρέπει να περάσω και εδώ
                const createYearsFilterObject: YearsFilters = {
                    yearsRange: stringToYearArray(validyearData),
                    unknownYear: false,
                };
                setParamValue(JSON.stringify(createYearsFilterObject));
            } else if (
                !isyearRangeMaxValue(paramSlice.yearsRange.join('-'), data)
            ) {
                const unknownYearUrl = searchParams.get(ParamNames.UnknownYear);
                console.log(unknownYearUrl);
                console.log(unknownYearUrl?.toLocaleLowerCase() === 'true');

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
            console.log(defaultyearData);
            console.log('console.log 2', defaultyearData);
            // Μπορεί να έχω θέμα εδώ γιατί δεν το περνάω σαν null αλλά σαν []
            const unknownYearUrl = searchParams.get(ParamNames.UnknownYear);
            const createYearsFilterObject: YearsFilters = {
                yearsRange:
                    paramValue &&
                    (JSON.parse(paramValue) as YearsFilters).yearsRange.length
                        ? []
                        : stringToYearArray(defaultyearData),
                unknownYear: unknownYearUrl?.toLocaleLowerCase() === 'true',
            };
            console.log(createYearsFilterObject);
            console.log(JSON.stringify(createYearsFilterObject));

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
    // const initUnknownYear = (): void => {
    //     if (isBoolean(paramSlice)) {
    //         if (param) {
    //             const validUnknownYear = param.toLocaleLowerCase() === 'true';
    //             setParamValue(validUnknownYear.toString());
    //             if (validUnknownYear) {
    //                 if (paramSlice !== validUnknownYear) {
    //                     dispatch(
    //                         setYearsFilters({ unknownYear: validUnknownYear })
    //                     );
    //                 }
    //             } else {
    //                 searchParams.delete(name);
    //                 setSearchParams(searchParams);
    //             }
    //         }
    //     }
    // };

    // const resetUnknownYear = (): void => {
    //     console.log('console.log 3', paramValue);
    //     const createYearsFilterObject: YearsFilters = {
    //         // Και εδώ θα έχω σίγουρα θέμα γιατί δεν γίνεται να το περάσω έτσι
    //         // θα πρέπει νομίζω να τσεκάρω και έαν είναι 2 length ακριβώς1!!
    //         yearsRange: paramValue &&
    //          (JSON.parse(paramValue) as YearsFilters).yearsRange.toString() === '' ? [0] : [],
    //         unknownYear: false,
    //     };
    //     setParamValue(JSON.stringify(createYearsFilterObject));
    //     // setParamValue(paramValue === null ? '' : null);
    //     updateUnknownYearSlice(false);
    // };

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
            // case ParamNames.UnknownYear:
            //     initUnknownYear();
            //     break;
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
                    console.log('UnknownYear XWRIS VALUE');
                    console.log(param);
                    console.log(searchParams.get(ParamNames.YearsRange));
                    console.log(selectedYears);
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
                            console.log(
                                'console.log 4',
                                paramValue,
                                '  ',
                                validyearData
                            );
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
                                // TODO - Εδώ μπορεί να έχω λάθος, ίσως πρέπει και εδώ να κοιτάω από το yearRange είναι ίσο με το maxYearsRnage
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
                            // setParamValue(
                            //     validyearData ||
                            //         (paramValue === null ? '' : null)
                            // );
                            // TODO - Εδώ μπορεί να έχω λάθος, ίσως πρέπει και εδώ να κοιτάω από το yearRange είναι ίσο με το maxYearsRnage

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
                // case ParamNames.UnknownYear:
                //     if (
                //         isBoolean(paramSlice) &&
                //         paramSlice.toString() !== param.toLocaleLowerCase()
                //     ) {
                //         const validUnknownYear =
                //             param.toLocaleLowerCase() === 'true';
                //         console.log('console.log 5', validUnknownYear.toString());
                //         setParamValue(validUnknownYear.toString());
                //         updateUnknownYearSlice(validUnknownYear);
                //     }

                //     break;
                case ParamNames.UnknownYear:
                    console.log('UnknownYear ME VALUE');
                    console.log(param);
                    console.log(searchParams.get(ParamNames.YearsRange));
                    // eslint-disable-next-line no-case-declarations
                    const urlYears =
                        searchParams.get(ParamNames.YearsRange) ?? '';
                    console.log(selectedYears);
                    console.log(isYearsArray(data));
                    if (isYearsArray(data)) {
                        console.log(
                            isyearRangeMaxValue(urlYears.toString(), data)
                        );
                    }

                    if (
                        (isYearsArray(data) &&
                            isyearRangeMaxValue(urlYears.toString(), data)) ||
                        !urlYears
                    ) {
                        console.log('mphka mphka!');

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
