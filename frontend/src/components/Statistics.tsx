import { SxProps, Box, useTheme, Theme } from '@mui/material';
import Typography from '@mui/material/Typography/Typography';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Grid2 from '@mui/material/Unstable_Grid2';
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import useMediaQuery from '@mui/material/useMediaQuery';
import ErrorIcon from '@mui/icons-material/Error';
import StatisticCard from './StatisticCard';
import { RootState } from '../app/store';
import {
    useGetJesusQuery,
    useGetStatisticsMutation,
} from '../services/departmentApi';
import { IStatistics } from '../models/api/response/departments/departments.data';
import { useGetYearsRangeQuery } from '../services/yearsRangeApi';
import { useGetAcademicStaffPositionsQuery } from '../services/academicStaffApi';

const title: SxProps = {
    fontWeight: 'bold',
    letterSpacing: '0.03rem',
};

const Statistics = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
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

    const { isLoading: isYearsDataLoading, isError: isYearsDataError } =
        useGetYearsRangeQuery();

    const { isLoading: isPositionsDataLoading, isError: isPositionsDataError } =
        useGetAcademicStaffPositionsQuery();

    const {
        isLoading: isDepartmenentDataFetching,
        isError: isDepartmenentDataError,
    } = useGetJesusQuery({
        filter: 'id',
    });

    useEffect(() => {
        if (!selectedDeps.length) return;

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

    if (
        isYearsDataLoading ||
        isPositionsDataLoading ||
        isDepartmenentDataFetching
    )
        // return (
        //     <Skeleton
        //         animation="wave"
        //         variant="rounded"
        //         width="100%"
        //         height={1000}
        //     />
        // );
        return null;

    if (isYearsDataError || isPositionsDataError || isDepartmenentDataError)
        return (
            <Box
                sx={{
                    mt: isSmallScreen ? '0px' : '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h4" sx={title} gutterBottom align="center">
                    Couldn&#39;t connect to the server
                </Typography>

                <ErrorIcon
                    sx={{
                        fontSize: isSmallScreen ? '18rem' : '24rem',
                        color: '#d32f2f',
                    }}
                />
            </Box>
        );

    if (!selectedDeps.length) {
        return (
            <Box
                sx={{
                    mt: isSmallScreen ? '0px' : '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h4" sx={title} gutterBottom align="center">
                    Select a{' '}
                    <Box
                        component="span"
                        sx={{
                            color:
                                theme.palette.mode === 'dark'
                                    ? '#90caf9'
                                    : '#55a1e5',
                        }}
                    >
                        department
                    </Box>{' '}
                    from the filters to see the data!
                </Typography>
                {isSmallScreen ? (
                    <SouthEastIcon
                        sx={{
                            fontSize: '18rem',
                            color:
                                theme.palette.mode === 'dark'
                                    ? '#90caf9'
                                    : '#55a1e5',
                        }}
                    />
                ) : (
                    <SubdirectoryArrowLeftIcon
                        sx={{
                            fontSize: '24rem',
                            color:
                                theme.palette.mode === 'dark'
                                    ? '#90caf9'
                                    : '#55a1e5',
                            transform: 'translateX(-25%)',
                        }}
                    />
                )}
            </Box>
        );
    }
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
