import { useSelector } from 'react-redux';
import { IFilterSlice } from '../slices/filtersSlice';
import { RootState } from '../store';

type UserPropertyType<T> = T extends keyof IFilterSlice
    ? IFilterSlice[T]
    : never;

const useDynamicSelector = <T extends keyof IFilterSlice>(
    name: T
): UserPropertyType<T> => {
    return useSelector(
        (state: RootState) => state.filtersSlice[name]
    ) as UserPropertyType<T>;
};

export default useDynamicSelector;
