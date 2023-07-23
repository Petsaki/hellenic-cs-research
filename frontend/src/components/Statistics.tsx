import { SxProps, Box } from '@mui/material';
import Typography from '@mui/material/Typography/Typography';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Grid2 from '@mui/material/Unstable_Grid2';
import StatisticCard from './StatisticCard';
import { RootState } from '../app/store';
import { useGetStatisticsMutation } from '../services/departmentApi';

const title: SxProps = {
    fontWeight: 'bold',
    letterSpacing: '0.03rem',
};

const Statistics = () => {
    const selectedDeps = useSelector(
        (state: RootState) => state.testSlice.departments
    );
    const selectedPositions = useSelector(
        (state: RootState) => state.testSlice.academicPos
    );
    const [
        statisticsFilters,
        {
            data: statisticsData,
            isLoading: isStatisticsLoading,
            isUninitialized,
        },
    ] = useGetStatisticsMutation();

    useEffect(() => {
        statisticsFilters({
            departments: selectedDeps,
            positions: selectedPositions,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDeps, selectedPositions]);

    return (
        <Box sx={{ mb: '12px' }}>
            {!(!isStatisticsLoading && !statisticsData?.data) && (
                <>
                    <Typography
                        variant="h4"
                        sx={title}
                        gutterBottom
                        align="center"
                    >
                        Statistics
                    </Typography>

                    <Grid2
                        container
                        rowSpacing={{ xs: 1.5, sm: 2, lg: 2.5 }}
                        columnSpacing={{ xs: 1.5, sm: 2, lg: 2.5 }}
                        justifyContent="center"
                        alignItems="center"
                    >
                        {statisticsData?.data &&
                            Object.entries(statisticsData.data).map(
                                ([key, value]) => (
                                    <Grid2
                                        key={key}
                                        xs={6}
                                        sm={3}
                                        md={3}
                                        lg={2.4}
                                    >
                                        <StatisticCard
                                            keyMap={key}
                                            value={value}
                                        />
                                    </Grid2>
                                )
                            )}
                        {isStatisticsLoading &&
                            [...Array(10).keys()].map((key) => (
                                <Grid2 key={key} xs={6} sm={3} md={3} lg={2.4}>
                                    <StatisticCard skeleton />
                                </Grid2>
                            ))}
                    </Grid2>
                </>
            )}
            {!isStatisticsLoading &&
                !statisticsData?.data &&
                // MARIOS - It is not good idea to have isUninitialized but it works
                !isUninitialized && (
                    <Typography variant="h4" sx={title} align="center">
                        Select one or more departments to see the statistics and
                        charts.
                    </Typography>
                )}
        </Box>
    );
};

export default Statistics;
