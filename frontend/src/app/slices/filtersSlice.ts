import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { YearsFilters } from '../../components/Filters/YearsSlider';

export interface IFilterSlice {
    yearsFilters: YearsFilters;
    academicPos: string[];
    departments: string[];
    maxYearsRange: number[];
}

const initialState: IFilterSlice = {
    yearsFilters: { yearsRange: [], unknownYear: false },
    academicPos: [],
    departments: [],
    maxYearsRange: [],
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
            console.log(payload);
            console.log({
                ...state.yearsFilters,
                ...payload.payload,
            });

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
    },
});

export const {
    reset,
    setYearsFilters,
    setMaxYearsRange,
    setAcademicPos,
    addDepartment,
} = filtersSlice.actions;

export default filtersSlice.reducer;
