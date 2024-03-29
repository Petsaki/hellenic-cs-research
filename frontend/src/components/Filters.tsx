import {
    Typography,
    Box,
    Drawer,
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
import ClearButton from './ClearButton';

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

    const { data: yearsData, isLoading: isYearsDataLoading } =
        useGetYearsRangeQuery();

    const { data: positionsData, isLoading: isPositionsDataLoading } =
        useGetAcademicStaffPositionsQuery();

    const { data: departmenentData, isLoading: isDepartmenentDataFetching } =
        useGetDepartmentsQuery({
            filter: ['id', 'url', 'deptname', 'university'],
        });

    const location = useLocation();

    // Check if the pathname is a specific value
    const isCitations = location.pathname === '/citations';

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
                        gap: '0.75rem',
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
                    <ClearButton
                        onClick={() => {
                            setSearchParams({});
                        }}
                    >
                        Clear
                    </ClearButton>
                </Box>
                <FixSlide data={yearsData.data} />
                <Divider sx={filterDivider} />
                <>
                    <DepartmentCheckboxes
                        data={departmenentData.data}
                        isCitations={isCitations}
                    />
                    <Divider sx={filterDivider} />
                </>
                <PositionCheckboxes data={positionsData.data} />
            </Box>
        );

    if (
        isYearsDataLoading &&
        isPositionsDataLoading &&
        isDepartmenentDataFetching
    )
        return null;

    return (
        <Drawer
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
            {drawer}
        </Drawer>
    );
};

export default Filters;
