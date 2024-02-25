import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { YearsFilters } from '../../components/Filters/YearsSlider';

export interface IFilterSlice {
    yearsFilters: YearsFilters;
    academicPos: string[];
    departments: string[];
    maxYearsRange: number[];
    showDepFullName: boolean;
}

const initialState: IFilterSlice = {
    yearsFilters: { yearsRange: [], unknownYear: false },
    academicPos: [],
    departments: [],
    maxYearsRange: [],
    showDepFullName: false,
};

const resetState = (yearsRange: number[]): IFilterSlice => {
    const tempInitialState = { ...initialState };
    tempInitialState.yearsFilters.yearsRange = yearsRange;
    tempInitialState.maxYearsRange = yearsRange;
    return tempInitialState;
};
export const filtersSlice = createSlice({
    name: 'filtersSlice',
    initialState,
    reducers: {
        reset: (state, yearsRange: PayloadAction<number[]>) =>
            resetState(yearsRange.payload),
        setYearsFilters: (
            state,
            payload: PayloadAction<Partial<YearsFilters>>
        ) => {
            state.yearsFilters = {
                ...state.yearsFilters,
                ...payload.payload,
            };
        },
        setMaxYearsRange: (state, maxYearsRange: PayloadAction<number[]>) => {
            state.maxYearsRange = maxYearsRange.payload;
        },
        setAcademicPos: (state, academicPos: PayloadAction<Array<string>>) => {
            state.academicPos = academicPos.payload;
        },
        addDepartment: (state, departments: PayloadAction<Array<string>>) => {
            state.departments = departments.payload;
        },
        setShowDepFullName: (
            state,
            showDepFullName: PayloadAction<boolean>
        ) => {
            state.showDepFullName = showDepFullName.payload;
            localStorage.setItem(
                'ShowDepFullName',
                showDepFullName.payload.toString()
            );
        },
    },
});

export const {
    reset,
    setYearsFilters,
    setMaxYearsRange,
    setAcademicPos,
    addDepartment,
    setShowDepFullName,
} = filtersSlice.actions;

export default filtersSlice.reducer;
