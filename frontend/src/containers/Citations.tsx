import Grid2 from '@mui/material/Unstable_Grid2';
import DepartmentStaff from '../components/Charts/DepartmentStaff';
import Statistics from '../components/Statistics';
import AcademicDataTable from '../components/DataTables/AcademicDataTable';
import { ParamNames } from '../app/hooks/useUrlParams';
import MessageComponent from '../components/MessageComponent';

const Citations = () => {
    return (
        <>
            <MessageComponent
                param={ParamNames.Departments}
                filter="department"
            />
            <Grid2
                xs
                sx={{
                    width: '100%',
                }}
            >
                <Statistics />
            </Grid2>
            <Grid2
                xs
                sx={{
                    width: '100%',
                }}
            >
                <DepartmentStaff />
            </Grid2>
            <Grid2
                xs
                sx={{
                    width: '100%',
                }}
            >
                <AcademicDataTable />
            </Grid2>
        </>
    );
};

export default Citations;
