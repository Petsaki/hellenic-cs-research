import Grid2 from '@mui/material/Unstable_Grid2';
import DepartmentStaff from '../components/Charts/DepartmentStaff';
import Statistics from '../components/Statistics';
import { ParamNames } from '../app/hooks/useUrlParams';
import MessageComponent from '../components/MessageComponent';
import TestPieChart from '../components/Charts/TestPieChart';
import TestVerticalChart from '../components/Charts/TestVerticalChart';
import CitationsTableGroup from '../components/CitationsTableGroup';

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
                <TestPieChart />
                <TestVerticalChart />
            </Grid2>
            <Grid2
                xs
                sx={{
                    width: '100%',
                }}
            >
                <CitationsTableGroup />
            </Grid2>
        </>
    );
};

export default Citations;
