import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { PublicationsYear } from '../../models/api/response/publications/publications.data';
import { RootState } from '../store';
import {
    IUser,
    setAcademicPos,
    setMaxYearsRange,
    setYearsRange,
} from '../slices/testSlice';
import {
    PublicationsYearValidation,
    isPublicationsYear,
    isyearRangeMaxValue,
    stringToYearArray,
} from '../untils/yearsRange';
import { AcademicStaffPosition } from '../../models/api/response/academicStaff/academicStaff.data';
import {
    AcademicPosValidation,
    isAcademicPos,
    removeAcademicPosForUrlParam,
} from '../untils/academicPos';
import { DepartmentsData } from '../../models/api/response/departments/departments.data';

export enum ParamNames {
    YearsRange = 'yearsRange',
    AcademicPos = 'academicPos',
    Departments = 'departments',
}

export type FilterData =
    | PublicationsYear[]
    | AcademicStaffPosition[]
    | DepartmentsData[]
    | ParamNames;

export interface ICheckBoxValue {
    id: string;
    checked: boolean;
}
export interface IInputValue {
    years?: string;
    checkbox?: ICheckBoxValue;
}
type UserPropertyType<T> = T extends keyof IUser ? IUser[T] : never;

// Custom Hook for dynamic useSelector
const useDynamicSelector = <T extends keyof IUser>(
    name: T
): UserPropertyType<T> => {
    return useSelector(
        (state: RootState) => state.testSlice[name]
    ) as UserPropertyType<T>;
};

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
        if (isPublicationsYear(data) && years) {
            if (isyearRangeMaxValue(years, data)) {
                searchParams.delete(name);
                setSearchParams(searchParams);
            } else {
                setSearchParams((prevSearchParams) => {
                    prevSearchParams.set(name, years);
                    return prevSearchParams;
                });
            }
            updateYearsRangeSlice(years);
        }
    };

    // UPDATE - ACADEMIC POSITIONS
    const updateAcademicPosSlice = (value: string | null) => {
        dispatch(setAcademicPos(value ? value.split(',') : []));
    };

    const updateAcademicPosURL = (academicPos?: ICheckBoxValue): void => {
        if (isAcademicPos(data) && academicPos?.id) {
            let updatedValue = '';
            if (academicPos.checked) {
                updatedValue = param
                    ? `${param},${academicPos.id}`
                    : academicPos.id;
            } else {
                if (!param) return;
                updatedValue = removeAcademicPosForUrlParam(
                    param,
                    academicPos?.id
                );
            }
            if (updatedValue) {
                setSearchParams((prevSearchParams) => {
                    prevSearchParams.set(name, updatedValue);
                    return prevSearchParams;
                });
            } else {
                searchParams.delete(name);
                setSearchParams(searchParams);
            }
            updateAcademicPosSlice(updatedValue);
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
                updateAcademicPosURL(value.checkbox);
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
            } else {
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
        if (isAcademicPos(data)) {
            if (param) {
                const validAcademicPosData = AcademicPosValidation(param, data);
                console.log('initAcademicPos', validAcademicPosData);
                if (validAcademicPosData.length) {
                    setSearchParams((prevSearchParams) => {
                        prevSearchParams.set(
                            name,
                            validAcademicPosData.join(',')
                        );
                        return prevSearchParams;
                    });
                    setParamValue(validAcademicPosData.join(','));
                    dispatch(setAcademicPos(validAcademicPosData));
                } else {
                    searchParams.delete(name);
                    setSearchParams(searchParams);
                }
            } else {
                searchParams.delete(name);
                setSearchParams(searchParams);
            }
        }
    };

    useEffect(() => {
        console.log(param);
        console.log(data);
        console.log('MPHKA EDW useUrlParams useEffect []');
        switch (name) {
            case ParamNames.YearsRange:
                initYearsRange();
                break;
            case ParamNames.AcademicPos:
                initAcademicPos();
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
                    resetYearsRange();

                    break;

                default:
                    break;
            }
        }
        switch (name) {
            case ParamNames.AcademicPos:
                console.log(
                    'USEEFFECT THAT WILL RUN EVERY FCKING TIME. AGAIN AND AGAIN'
                );

                /* The expression `!(!param && !paraSlice.join(','))` is checking if either `param`
                or `paraSlice` is not empty.
                A NAND LOGIC GATE */
                if (
                    !(!param && !paraSlice.join(',')) &&
                    paraSlice.join(',') !== param
                ) {
                    setParamValue(param);
                }
                updateAcademicPosSlice(param);
                break;

            default:
                break;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [param]);

    return [paramValue, handleInputChange];
};

export default useUrlParams;
