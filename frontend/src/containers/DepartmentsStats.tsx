import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Grid2 from '@mui/material/Unstable_Grid2';
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
            <Grid2
                xs
                sx={{
                    width: '100%',
                }}
            >
                <DepartmentDataTable />
            </Grid2>
        </>
    );
};

export default DepartmentsStats;
