import { useSelector } from 'react-redux';
import { IUser } from '../slices/testSlice';
import { RootState } from '../store';

type UserPropertyType<T> = T extends keyof IUser ? IUser[T] : never;

const useDynamicSelector = <T extends keyof IUser>(
    name: T
): UserPropertyType<T> => {
    return useSelector(
        (state: RootState) => state.testSlice[name]
    ) as UserPropertyType<T>;
};

export default useDynamicSelector;
