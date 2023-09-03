import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ParamNames } from '../app/hooks/useUrlParams';
import { addDepartment } from '../app/slices/testSlice';

const DepartmentsStats = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(addDepartment([]));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div>DepartmentsStats</div>;
};

export default DepartmentsStats;
