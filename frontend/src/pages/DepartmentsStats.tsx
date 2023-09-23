import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addDepartment } from '../app/slices/testSlice';
import DepartmentDataTable from '../components/DepartmentDataTable';

const DepartmentsStats = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(addDepartment([]));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <DepartmentDataTable />;
};

export default DepartmentsStats;
