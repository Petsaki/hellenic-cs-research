import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { PublicationsYear } from '../../models/api/response/publications/publications.data';
import { RootState } from '../store';
import { IUser, setMaxYearsRange, setYearsRange } from '../slices/testSlice';
import {
    PublicationsYearValidation,
    isPublicationsYear,
    isyearRangeMaxValue,
    stringToYearArray,
} from '../untils/yearsRange';

export enum ParamNames {
    YearsRange = 'yearsRange',
}

export type FilterData = PublicationsYear[] | ParamNames;

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
}: SearchParamProp): [string, boolean, (value: string) => void] => {
    const dispatch = useDispatch();
    const paraSlice = useDynamicSelector(name);

    const [searchParams, setSearchParams] = useSearchParams();
    const [paramValue, setParamValue] = useState<string>('');
    const [resetValue, setResetValue] = useState<boolean>(false);

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

    const updateYearsRangeURL = (years: string): void => {
        if (isPublicationsYear(data)) {
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

    const handleInputChange = (value: string) => {
        console.log(value);
        console.log(paraSlice);
        switch (name) {
            case ParamNames.YearsRange:
                updateYearsRangeURL(value);

                break;

            default:
                break;
        }

        setSearchParams((prevSearchParams) => {
            prevSearchParams.set(name, value);
            return prevSearchParams;
        });
    };

    // INIT/RESET - YEARS RANGE
    const initYearsRange = (): void => {
        if (isPublicationsYear(data)) {
            if (param) {
                const validyearData = PublicationsYearValidation(param, data);
                handleInputChange(validyearData);
                setParamValue(validyearData);
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
            setParamValue(defaultyearData);
            setResetValue((prevValue) => !prevValue);
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [param]);

    return [paramValue, resetValue, handleInputChange];
};

export default useUrlParams;
