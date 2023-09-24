import Box from '@mui/material/Box/Box';
import Typography from '@mui/material/Typography/Typography';
import React from 'react';
import ErrorIcon from '@mui/icons-material/Error';
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import { useMediaQuery, useTheme, SxProps } from '@mui/material';
import useDynamicSelector from '../app/hooks/useDynamicSelector';
import { ParamNames } from '../app/hooks/useUrlParams';
import { useGetJesusQuery } from '../services/departmentApi';
import { useGetYearsRangeQuery } from '../services/yearsRangeApi';
import { useGetAcademicStaffPositionsQuery } from '../services/academicStaffApi';

const title: SxProps = {
    fontWeight: 'bold',
    letterSpacing: '0.03rem',
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

    const { isError: isDepartmenentDataError } = useGetJesusQuery({
        filter: 'id',
    });

    const { isError: isYearsDataError } = useGetYearsRangeQuery();

    const { isError: isPositionsDataError } =
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
                        fontSize: isSmallScreen ? '18rem' : '24rem',
                        color: '#d32f2f',
                    }}
                />
            </Box>
        );

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
    return null;
};

export default MessageComponent;
