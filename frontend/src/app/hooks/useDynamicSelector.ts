import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { ParamNames } from './useUrlParams';

const useDynamicSelector = (name: ParamNames) => {
    const filtersSliceData = useSelector(
        (state: RootState) => state.filtersSlice
    );

    switch (name) {
        case ParamNames.YearsRange:
        case ParamNames.UnknownYear:
            return filtersSliceData.yearsFilters;
        case ParamNames.AcademicPos:
            return filtersSliceData.academicPos;
        case ParamNames.Departments:
            return filtersSliceData.departments;
        default:
            return filtersSliceData;
    }
};

export default useDynamicSelector;
