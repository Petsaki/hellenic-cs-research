import { YearsFilters } from '../../components/Filters/YearsSlider';
import { YearsArray } from '../../models/api/response/departments/departments.data';
import { FilterData } from '../hooks/useUrlParams';

export const stringToYearArray = (years: string): Array<number> => {
    return years
        .split('-')
        .map((value) => +value)
        .sort();
};

export const YearsValidation = (
    param: string | null,
    data: YearsArray
): string => {
    let validyearData = `${data[0]}-${data[data.length - 1]}`;
    if (param) {
        const yearsRangeArray = stringToYearArray(param);
        if (
            yearsRangeArray.length === 2 &&
            data.some((year) => year === yearsRangeArray[0]) &&
            data.some((year) => year === yearsRangeArray[1])
        ) {
            validyearData = `${yearsRangeArray[0]}-${
                yearsRangeArray[yearsRangeArray.length - 1]
            }`;
        }
    }

    return validyearData;
};

export const isyearRangeMaxValue = (value: string, data: YearsArray) => {
    const yearsRangeArray = stringToYearArray(value);
    return (
        yearsRangeArray[0] === data[0] &&
        yearsRangeArray[1] === data[data.length - 1]
    );
};

// Type guards
export const isYearsArray = (data: FilterData): data is YearsArray => {
    return Array.isArray(data);
};

export const isBoolean = (data: FilterData): boolean => {
    return typeof data === 'boolean';
};

export const isYearsFilters = (data: FilterData): data is YearsFilters => {
    return (
        typeof data === 'object' &&
        'yearsRange' in data &&
        'unknownYear' in data &&
        Array.isArray(data.yearsRange) &&
        typeof data.unknownYear === 'boolean'
    );
};
