import Box from '@mui/material/Box/Box';
import Typography from '@mui/material/Typography/Typography';
import React from 'react';
import ErrorIcon from '@mui/icons-material/Error';
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import { useMediaQuery, useTheme, SxProps } from '@mui/material';
import useDynamicSelector from '../app/hooks/useDynamicSelector';
import { ParamNames } from '../app/hooks/useUrlParams';
import { useGetDepartmentsQuery } from '../services/departmentApi';
import { useGetYearsRangeQuery } from '../services/yearsRangeApi';
import { useGetAcademicStaffPositionsQuery } from '../services/academicStaffApi';

const title: SxProps = {
    fontWeight: 'bold',
    letterSpacing: '0.03rem',
    fontSize: { xs: '2rem', md: '2.5rem' },
};

export interface MessageComponentProp {
    filter?: string;
    param: ParamNames;
}

const MessageComponent: React.FC<MessageComponentProp> = ({
    filter,
    param,
}: MessageComponentProp) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const paraSlice = useDynamicSelector(param);

    const {
        isLoading: isDepartmenentDataLoading,
        isError: isDepartmenentDataError,
    } = useGetDepartmentsQuery({
        filter: ['id', 'url'],
    });

    const { isLoading: isYearsDataLoading, isError: isYearsDataError } =
        useGetYearsRangeQuery();

    const { isLoading: isPositionsDataLoading, isError: isPositionsDataError } =
        useGetAcademicStaffPositionsQuery();

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
                        width: 'auto',
                        height: 'auto',
                        maxWidth: '1em',
                        minWidth: '0.8em',
                        fontSize: isSmallScreen ? '16rem' : '22rem',
                        color: '#d32f2f',
                    }}
                />
            </Box>
        );

    if (
        isDepartmenentDataLoading ||
        isYearsDataLoading ||
        isPositionsDataLoading
    )
        return null;

    if (!paraSlice.length) {
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
                        {filter}
                    </Box>{' '}
                    from the filters to see the data!
                </Typography>
                {isSmallScreen ? (
                    <SouthEastIcon
                        sx={{
                            fontSize: '16rem',
                            width: 'auto',
                            height: 'auto',
                            maxWidth: '1em',
                            minWidth: '0.8em',
                            color:
                                theme.palette.mode === 'dark'
                                    ? '#90caf9'
                                    : '#55a1e5',
                        }}
                    />
                ) : (
                    <SubdirectoryArrowLeftIcon
                        sx={{
                            fontSize: '22rem',
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
    return null;
};

export default MessageComponent;
