import Grid2 from '@mui/material/Unstable_Grid2';
import Statistics from '../components/Statistics';
import { ParamNames } from '../app/hooks/useUrlParams';
import MessageComponent from '../components/MessageComponent';
import PositionsPieChart from '../components/Charts/PositionsPieChart';
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
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <PositionsPieChart />
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
