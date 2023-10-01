import {
    Typography,
    Box,
    Drawer,
    Button,
    useMediaQuery,
    useTheme,
    Divider,
    SxProps,
} from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useGetDepartmentsQuery } from '../services/departmentApi';
import FixSlide from './Filters/YearsSlider';
import { useGetAcademicStaffPositionsQuery } from '../services/academicStaffApi';
import { useGetYearsRangeQuery } from '../services/yearsRangeApi';
import DepartmentCheckboxes from './Filters/DepartmentCheckboxes';
import PositionCheckboxes from './Filters/PositionCheckboxes';

const drawerStyle: SxProps = {
    '& .MuiDrawer-paper': {
        boxSizing: 'border-box',
        width: { xs: '80%', sm: '55%', md: '100%' },
        display: 'flex',
        padding: { xs: '22px 15px', md: '0' },
        backgroundColor: { md: 'transparent' },
    },
    '& .MuiPaper-root': {
        position: { xs: 'fixed', md: 'relative' },
        zIndex: { xs: 1200, md: 1 },
        border: 'none',
    },
    '& .MuiGrid2-root': {
        padding: 0,
    },
};

const clearStyle: SxProps = {
    color: '#7096d6',
    fontSize: '0.8rem',
    p: 0,
    '&.MuiButtonBase-root:hover': {
        bgcolor: 'transparent',
        textDecoration: 'underline',
        filter: 'brightness(85%)',
    },
};

const filterDivider: SxProps = {
    marginX: '24px',
};

export interface FiltersProp {
    drawerStatus: boolean;
}

const Filters: React.FC<FiltersProp> = ({ drawerStatus }: FiltersProp) => {
    const theme = useTheme();
    const large = useMediaQuery(theme.breakpoints.up('md'));
    const [searchParams, setSearchParams] = useSearchParams();

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
        isLoading: isDepartmenentDataFetching,
        isError: isDepartmenentDataError,
    } = useGetDepartmentsQuery({
        filter: 'id',
    });

    const location = useLocation();

    // Check if the pathname is a specific value
    const isRewritePath = location.pathname === '/citations';

    const firstRenderRef = useRef(true);

    const [mobileOpen, setMobileOpen] = useState(drawerStatus);

    useEffect(() => {
        if (large) setMobileOpen(false);
    }, [large]);

    useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return;
        }
        setMobileOpen((currentDrawerStatus) => !currentDrawerStatus);
    }, [drawerStatus]);

    // TODO: Na balw tous elegxous kapou allou gia na exw kalitero loading screen?
    const drawer = yearsData?.data &&
        positionsData?.data &&
        departmenentData?.data && (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '22px',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '4px',
                        mb: 2,
                    }}
                >
                    <Typography
                        variant="h5"
                        noWrap
                        component="div"
                        sx={{
                            fontWeight: 'light',
                        }}
                    >
                        Filters
                    </Typography>
                    <Button
                        disableElevation
                        disableRipple
                        variant="text"
                        sx={clearStyle}
                        onClick={() => {
                            setSearchParams({});
                        }}
                    >
                        Clear
                    </Button>
                </Box>
                <FixSlide data={yearsData.data} />
                <Divider sx={filterDivider} />
                {isRewritePath && (
                    <>
                        <DepartmentCheckboxes data={departmenentData.data} />
                        <Divider sx={filterDivider} />
                    </>
                )}
                <PositionCheckboxes data={positionsData.data} />
            </Box>
        );

    if (
        isYearsDataLoading &&
        isPositionsDataLoading &&
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

    return (
        <>
            {/* TODO: Na krathsw mono to ena drawer kai tha allazw dinamika to variant analoga to width kai kapoia css gia na fainetai swsta sthn megalh othonh! */}
            <Drawer
                // container={container}
                variant={large ? 'persistent' : 'temporary'}
                open={large ? true : mobileOpen}
                onClose={(event: Event, reason: string) => {
                    if (reason === 'backdropClick' && !mobileOpen) return;
                    setMobileOpen((currentMobileOpen) => !currentMobileOpen);
                }}
                transitionDuration={large ? 0 : undefined}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={drawerStyle}
            >
                {/* It was if i want to show at filter and error message */}
                {/* {isYearsDataError ||
                isPositionsDataError ||
                isDepartmenentDataError ? (
                    <h1>ERROR</h1>
                ) : (
                    drawer
                )} */}
                {drawer}
            </Drawer>
        </>
    );
};

export default Filters;
