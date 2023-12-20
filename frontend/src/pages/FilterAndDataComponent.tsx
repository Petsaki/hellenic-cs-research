import { useEffect, useRef, useState } from 'react';
import SpeedDial from '@mui/material/SpeedDial/SpeedDial';
import TuneIcon from '@mui/icons-material/Tune';
import {
    Box,
    Collapse,
    Container,
    Divider,
    IconButton,
    SxProps,
    Theme,
    useTheme,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { Outlet, useLocation } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import { useSelector } from 'react-redux';
import TheChipArray from '../components/TheChipArray';
import Filters from '../components/Filters';
import { useGetYearsRangeQuery } from '../services/yearsRangeApi';
import { useGetAcademicStaffPositionsQuery } from '../services/academicStaffApi';
import { useGetDepartmentsQuery } from '../services/departmentApi';
import { RootState } from '../app/store';

const speedDial: SxProps<Theme> = (theme) => ({
    position: 'fixed',
    bottom: 16,
    right: 16,
    display: { md: 'none' },
    '& .MuiSvgIcon-root': {
        color: theme.palette.mode === 'dark' ? 'inherit' : 'white',
        transform: 'rotate(-90deg)',
    },
});

const collaspeButton: SxProps<Theme> = (theme) => ({
    color: 'white',
    top: '28px',
    height: 'fit-content',
    transform: 'translateX(-50%)',
    backgroundColor: theme.palette.mode === 'dark' ? '#272727' : '#55a1e5',
    borderRadius: '4px',
    zIndex: '1',
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? '#323232' : '#188acb',
    },
    '& .MuiSvgIcon-root': {
        width: '0.65em',
        height: '0.65em',
    },
});

const mainContainer: SxProps = {
    mt: { xs: 1, md: 2, lg: 3 },
    padding: { xs: '8px', sm: '12px', lg: '24px' },
    mb: 10,
};

const collapse: SxProps = {
    display: { xs: 'none', md: 'block' },
};

const collapseLineContainer: SxProps = {
    width: '0',
    overflow: 'visible',
    padding: '0',
    display: { xs: 'none', md: 'block' },
};

const FilterAndDataComponent = () => {
    const theme = useTheme();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const location = useLocation();

    const filtersSliceData = useSelector(
        (state: RootState) => state.filtersSlice
    );

    const [checked, setChecked] = useState(true);
    const [height, setHeight] = useState(0);
    const ref = useRef<HTMLDivElement | null>(null);

    const { isLoading: isYearsDataLoading, isError: isYearsDataError } =
        useGetYearsRangeQuery();

    const { isLoading: isPositionsDataLoading, isError: isPositionsDataError } =
        useGetAcademicStaffPositionsQuery();

    const {
        isLoading: isDepartmenentDataFetching,
        isError: isDepartmenentDataError,
    } = useGetDepartmentsQuery({
        filter: ['id', 'url'],
    });

    useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            entries.filter((entry) => {
                return setHeight(entry.contentRect.height);
            });
        });

        const node = ref.current;

        if (node) {
            resizeObserver.observe(node);
            setHeight(node.clientHeight);
        }

        return () => {
            if (node) {
                resizeObserver.unobserve(node);
            }
        };
    }, []);

    useEffect(() => {
        if (
            !filtersSliceData.academicPos.length &&
            !filtersSliceData.departments.length
        ) {
            setChecked(true);
        }
    }, [filtersSliceData]);

    const handleChange = () => {
        setChecked((prev) => !prev);
    };

    return (
        <>
            <Container
                // disableGutters
                maxWidth="xl"
                sx={mainContainer}
            >
                <Grid2
                    container
                    columnSpacing={{ xs: 0, md: 3 }}
                    sx={{ position: 'relative' }}
                >
                    <Collapse
                        orientation="horizontal"
                        in={checked}
                        collapsedSize={20}
                        sx={collapse}
                    >
                        <Grid2
                            ref={(node) => {
                                if (node !== null) {
                                    ref.current = node;
                                }
                            }}
                            sx={{
                                visibility: checked ? 'visible' : 'hidden',
                                width: { xs: '0px', md: '240px' },
                                transition: 'visibility 280ms',
                            }}
                        >
                            <Filters drawerStatus={drawerOpen} />
                        </Grid2>
                    </Collapse>
                    {!isYearsDataLoading &&
                    !isPositionsDataLoading &&
                    !isDepartmenentDataFetching &&
                    !isYearsDataError &&
                    !isPositionsDataError &&
                    !isDepartmenentDataError ? (
                        <>
                            <Grid2 sx={collapseLineContainer}>
                                <Divider
                                    orientation="vertical"
                                    sx={{
                                        height: ref?.current?.clientHeight,
                                        borderRightWidth: '2px',
                                    }}
                                />
                            </Grid2>
                            <Grid2 sx={collapseLineContainer}>
                                <Box
                                    sx={{ height: ref?.current?.clientHeight }}
                                >
                                    <IconButton
                                        sx={collaspeButton(theme)}
                                        onClick={handleChange}
                                        disableRipple
                                        disableTouchRipple
                                        size="small"
                                    >
                                        {checked ? (
                                            <ArrowBackIosNewIcon />
                                        ) : (
                                            <ArrowForwardIosIcon />
                                        )}
                                    </IconButton>
                                </Box>
                            </Grid2>
                        </>
                    ) : null}

                    <Grid2
                        xs
                        container
                        direction="column"
                        sx={{
                            marginBottom: { xs: '4rem', md: '0' },
                            marginRight: '0',
                            marginLeft: '0',
                        }}
                    >
                        <Grid2
                            sx={{
                                width: '100%',
                                pt: 0,
                                minHeight: '52px',
                            }}
                        >
                            <TheChipArray />
                        </Grid2>
                        <Grid2
                            container
                            direction="column"
                            rowSpacing={4}
                            sx={{
                                width: '100%',
                                justifyContent: 'center',
                                margin: '0',
                                padding: '0',
                            }}
                        >
                            <Outlet />
                        </Grid2>
                    </Grid2>
                </Grid2>
            </Container>

            <SpeedDial
                open={false}
                ariaLabel="Opens the filter menu"
                sx={speedDial(theme)}
                onClick={() =>
                    setDrawerOpen((currentDrawerOpen) => !currentDrawerOpen)
                }
                icon={<TuneIcon />}
            />
        </>
    );
};

export default FilterAndDataComponent;
