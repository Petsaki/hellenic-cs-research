import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addDepartment } from '../app/slices/filtersSlice';
import DepartmentDataTable from '../components/DataTables/DepartmentDataTable';
import { ParamNames } from '../app/hooks/useUrlParams';
import MessageComponent from '../components/MessageComponent';

const DepartmentsStats = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(addDepartment([]));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <MessageComponent
                param={ParamNames.AcademicPos}
                filter="Academic Position"
            />
            <DepartmentDataTable />
        </>
    );
};

export default DepartmentsStats;
