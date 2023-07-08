import { PublicationsYear } from '../../models/api/response/publications/publications.data';
import { FilterData } from '../hooks/useUrlParams';

export const stringToYearArray = (years: string): Array<number> => {
    return years
        .split('-')
        .map((value) => +value)
        .sort();
};

export const PublicationsYearValidation = (
    param: string | null,
    data: PublicationsYear[]
): string => {
    console.log(data);
    let validyearData = `${data[0].year}-${data[data.length - 1].year}`;
    if (param) {
        const yearsRangeArray = stringToYearArray(param);
        if (
            yearsRangeArray.length === 2 &&
            data.some((year) => year.year === yearsRangeArray[0]) &&
            data.some((year) => year.year === yearsRangeArray[1])
        ) {
            validyearData = `${yearsRangeArray[0]}-${
                yearsRangeArray[yearsRangeArray.length - 1]
            }`;
        }
    }

    return validyearData;
};

export const isyearRangeMaxValue = (
    value: string,
    data: PublicationsYear[]
) => {
    const yearsRangeArray = stringToYearArray(value);
    return (
        yearsRangeArray[0] === data[0].year &&
        yearsRangeArray[1] === data[data.length - 1].year
    );
};

// Type guard
export const isPublicationsYear = (
    data: FilterData
): data is PublicationsYear[] => {
    return Array.isArray(data);
};
