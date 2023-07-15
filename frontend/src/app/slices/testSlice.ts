import { createSlice, current, PayloadAction } from '@reduxjs/toolkit';
import { IAlert } from '../../models/api/model';

export interface IUser {
    yearsRange: number[];
    academicPos: string[];
    departments: string[];
    alert: IAlert;
    maxYearsRange: number[];
}

interface IAddDepartment {
    deps: string | string[];
    removeDeps?: boolean;
}

// const initialState: AuthState = {
//     user: null,
// };

const initialState: IUser = {
    yearsRange: [],
    academicPos: [],
    departments: [],
    alert: {
        message: 'Something gone wrong.',
        type: 'error',
        duration: 6000,
        isOpen: false,
    },
    maxYearsRange: [],
};

let testTimeout: any;

const getStatistics = () => {
    clearTimeout(testTimeout);
    testTimeout = setTimeout(function () {
        console.log('Hello World');
    }, 1200);
};

const resetState = (yearsRange: number[]): IUser => {
    const tempInitialState = { ...initialState };
    tempInitialState.yearsRange = yearsRange;
    tempInitialState.maxYearsRange = yearsRange;
    console.log(tempInitialState);
    return tempInitialState;
};
export const testSlice = createSlice({
    name: 'testSlice',
    initialState,
    reducers: {
        // ? Logout the user by returning the initial state
        reset: (state, yearsRange: PayloadAction<number[]>) =>
            resetState(yearsRange.payload),
        setYearsRange: (state, yearsRange: PayloadAction<number[]>) => {
            state.yearsRange = yearsRange.payload;
            // getStatistics();
        },
        setMaxYearsRange: (state, maxYearsRange: PayloadAction<number[]>) => {
            state.maxYearsRange = maxYearsRange.payload;
            // getStatistics();
        },
        setAcademicPos: (state, academicPos: PayloadAction<Array<string>>) => {
            console.log(academicPos.payload);

            state.academicPos = academicPos.payload;
            // getStatistics();
        },
        addDepartment: (state, departments: PayloadAction<Array<string>>) => {
            state.departments = departments.payload;
            // getStatistics();
        },
        deleteDepartment: (state, action: PayloadAction<string>) => {
            state.departments = state.departments.filter(
                (dep) => dep !== action.payload
            );
            console.log(state.departments);
            getStatistics();
        },
        setAlert: (state, action: PayloadAction<IAlert>) => {
            state.alert = action.payload;
        },
    },
});

export const {
    reset,
    setYearsRange,
    setMaxYearsRange,
    setAcademicPos,
    addDepartment,
    deleteDepartment,
    setAlert,
} = testSlice.actions;
// ? Export the testSlice.reducer to be included in the store.
export default testSlice.reducer;
