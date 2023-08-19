import { LinearProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useGetYearsRangeQuery } from '../services/yearsRangeApi';
import { useGetAcademicStaffPositionsQuery } from '../services/academicStaffApi';
import { useGetJesusQuery } from '../services/departmentApi';

const TheProgressBar = () => {
    const theme = useTheme();

    const [progressValue, setProgressValue] = useState(0);

    const {
        data: yearsData,
        isLoading: isYearsDataLoading,
        isError: isYearsDataError,
    } = useGetYearsRangeQuery();

    const {
        data: positionsData,
        isLoading: isPositionsDataLoading,
        isError: isPositionsDataError,
    } = useGetAcademicStaffPositionsQuery();

    const {
        data: departmenentData,
        isLoading: isDepartmenentDataLoading,
        isError: isDepartmenentDataError,
    } = useGetJesusQuery({
        filter: 'id',
    });
    // #cfcfcf

    useEffect(() => {
        let newValue = 0;

        if (isDepartmenentDataLoading || departmenentData) {
            newValue += 33;
        }
        if (isPositionsDataLoading || positionsData) {
            newValue += 33;
        }
        if (isYearsDataLoading || yearsData) {
            newValue += 34;
        }
        if (
            isYearsDataError ||
            isPositionsDataError ||
            isDepartmenentDataError
        ) {
            newValue = 100;
        }

        setProgressValue(newValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDepartmenentDataLoading, isPositionsDataLoading, isYearsDataLoading]);

    return (
        <LinearProgress
            value={progressValue}
            variant="determinate"
            color="inherit"
            sx={{
                color:
                    theme.palette.mode === 'dark'
                        ? theme.palette.primary.main
                        : 'white',
                position: 'fixed',
                zIndex: '9999',
                width: '100%',
                display:
                    isDepartmenentDataLoading ||
                    isPositionsDataLoading ||
                    isYearsDataLoading
                        ? 'block'
                        : 'none',
            }}
        />
    );
};

export default TheProgressBar;
