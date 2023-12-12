import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IFilterSlice {
    yearsRange: number[];
    academicPos: string[];
    departments: string[];
    maxYearsRange: number[];
    unknownYear: boolean;
}

const initialState: IFilterSlice = {
    yearsRange: [],
    academicPos: [],
    departments: [],
    maxYearsRange: [],
    unknownYear: false,
};

const resetState = (yearsRange: number[]): IFilterSlice => {
    const tempInitialState = { ...initialState };
    tempInitialState.yearsRange = yearsRange;
    tempInitialState.maxYearsRange = yearsRange;
    return tempInitialState;
};
export const filtersSlice = createSlice({
    name: 'filtersSlice',
    initialState,
    reducers: {
        reset: (state, yearsRange: PayloadAction<number[]>) =>
            resetState(yearsRange.payload),
        setYearsRange: (state, yearsRange: PayloadAction<number[]>) => {
            state.yearsRange = yearsRange.payload;
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
        setUnknownYear: (state, unknownYear: PayloadAction<boolean>) => {
            state.unknownYear = unknownYear.payload;
        },
    },
});

export const {
    reset,
    setYearsRange,
    setMaxYearsRange,
    setAcademicPos,
    addDepartment,
    setUnknownYear,
} = filtersSlice.actions;

export default filtersSlice.reducer;
