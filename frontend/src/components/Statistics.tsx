import { SxProps, Box } from '@mui/material';
import Typography from '@mui/material/Typography/Typography';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Grid2 from '@mui/material/Unstable_Grid2';
import StatisticCard from './StatisticCard';
import { RootState } from '../app/store';
import { useGetStatisticsMutation } from '../services/departmentApi';
import { IStatistics } from '../models/api/response/departments/departments.data';

const title: SxProps = {
    fontWeight: 'bold',
    letterSpacing: '0.03rem',
};

const Statistics = () => {
    const [statistics, setStatistics] = useState<IStatistics>();
    const selectedDeps = useSelector(
        (state: RootState) => state.testSlice.departments
    );
    const selectedPositions = useSelector(
        (state: RootState) => state.testSlice.academicPos
    );
    const [
        statisticsFilters,
        { data: statisticsData, isLoading: isStatisticsLoading },
    ] = useGetStatisticsMutation();

    useEffect(() => {
        statisticsFilters({
            departments: selectedDeps,
            positions: selectedPositions,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedDeps.length) {
            statisticsFilters({
                departments: selectedDeps,
                positions: selectedPositions,
            });
        } else {
            setStatistics(undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDeps, selectedPositions]);

    useEffect(() => {
        if (statisticsData?.data) {
            setStatistics(statisticsData?.data);
        }
    }, [statisticsData]);

    return (
        <Box sx={{ mb: '12px' }}>
            {selectedDeps.length > 0 && (
                <Typography variant="h4" sx={title} gutterBottom align="center">
                    Statistics
                </Typography>
            )}

            <Grid2
                container
                rowSpacing={{ xs: 1.5, sm: 2, lg: 2.5 }}
                columnSpacing={{ xs: 1.5, sm: 2, lg: 2.5 }}
                justifyContent="center"
                alignItems="center"
            >
                {selectedDeps.length > 0 &&
                    statistics &&
                    Object.entries(statistics).map(([key, value]) => (
                        <Grid2 key={key} xs={6} sm={3} md={3} lg={2.4}>
                            <StatisticCard keyMap={key} value={value} />
                        </Grid2>
                    ))}
                {!statistics &&
                    selectedDeps.length > 0 &&
                    [...Array(10).keys()].map((key) => (
                        <Grid2 key={key} xs={6} sm={3} md={3} lg={2.4}>
                            <StatisticCard skeleton />
                        </Grid2>
                    ))}
            </Grid2>
        </Box>
    );
};

export default Statistics;