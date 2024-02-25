import Box from '@mui/material/Box/Box';
import Typography from '@mui/material/Typography/Typography';
import React from 'react';
import ErrorIcon from '@mui/icons-material/Error';
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import { useMediaQuery, useTheme, SxProps, Theme } from '@mui/material';
import useDynamicSelector from '../app/hooks/useDynamicSelector';
import { ParamNames } from '../app/hooks/useUrlParams';
import { useGetDepartmentsQuery } from '../services/departmentApi';
import { useGetYearsRangeQuery } from '../services/yearsRangeApi';
import { useGetAcademicStaffPositionsQuery } from '../services/academicStaffApi';
import { isAcademicPos } from '../app/untils/academicPos';

const title: SxProps = {
    fontWeight: 'bold',
    letterSpacing: '0.03rem',
    fontSize: { xs: '2rem', md: '2.5rem' },
};

const colorThemeStyle: SxProps<Theme> = (theme) => ({
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#55a1e5',
});

const boxWrapperStyle = (isSmallScreen: boolean): SxProps => ({
    mt: isSmallScreen ? '0px' : '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
});

const errorIconStyle = (isSmallScreen: boolean): SxProps => ({
    width: 'auto',
    height: 'auto',
    maxWidth: '1em',
    minWidth: '0.8em',
    fontSize: isSmallScreen ? '16rem' : '22rem',
    color: '#d32f2f',
});

const southEastIconStyle: SxProps = {
    fontSize: '16rem',
    width: 'auto',
    height: 'auto',
    maxWidth: '1em',
    minWidth: '0.8em',
};

const subdirectoryArrowLeftIconStyle: SxProps = {
    fontSize: '22rem',
    transform: 'translateX(-25%)',
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
    const paramSlice = useDynamicSelector(param);

    const {
        isLoading: isDepartmenentDataLoading,
        isError: isDepartmenentDataError,
    } = useGetDepartmentsQuery({
        filter: ['id', 'url', 'deptname', 'university'],
    });

    const { isLoading: isYearsDataLoading, isError: isYearsDataError } =
        useGetYearsRangeQuery();

    const { isLoading: isPositionsDataLoading, isError: isPositionsDataError } =
        useGetAcademicStaffPositionsQuery();

    if (isYearsDataError || isPositionsDataError || isDepartmenentDataError)
        return (
            <Box sx={boxWrapperStyle(isSmallScreen)}>
                <Typography variant="h4" sx={title} gutterBottom align="center">
                    Couldn&#39;t connect to the server
                </Typography>

                <ErrorIcon sx={errorIconStyle(isSmallScreen)} />
            </Box>
        );

    if (
        isDepartmenentDataLoading ||
        isYearsDataLoading ||
        isPositionsDataLoading
    )
        return null;

    if (isAcademicPos(paramSlice) && !paramSlice.length) {
        return (
            <Box sx={boxWrapperStyle(isSmallScreen)}>
                <Typography variant="h4" sx={title} gutterBottom align="center">
                    Select a{' '}
                    <Box component="span" sx={colorThemeStyle(theme)}>
                        {filter}
                    </Box>{' '}
                    from the filters to see the data!
                </Typography>
                {isSmallScreen ? (
                    <SouthEastIcon
                        sx={{
                            ...colorThemeStyle(theme),
                            ...southEastIconStyle,
                        }}
                    />
                ) : (
                    <SubdirectoryArrowLeftIcon
                        sx={{
                            ...subdirectoryArrowLeftIconStyle,
                            ...colorThemeStyle(theme),
                        }}
                    />
                )}
            </Box>
        );
    }
    return null;
};

export default MessageComponent;
