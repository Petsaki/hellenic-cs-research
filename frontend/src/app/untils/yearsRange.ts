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
    console.log(data);
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

// Type guard
export const isYearsArray = (data: FilterData): data is YearsArray => {
    return Array.isArray(data);
};
