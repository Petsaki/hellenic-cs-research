/* eslint-disable import/prefer-default-export */

import React, {
    ReactElement,
    forwardRef,
    useEffect,
    useRef,
    useState,
} from 'react';
import TuneIcon from '@mui/icons-material/Tune';
import Container from '@mui/material/Container/Container';
import SpeedDial from '@mui/material/SpeedDial/SpeedDial';
import Toolbar from '@mui/material/Toolbar/Toolbar';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import useScrollTrigger from '@mui/material/useScrollTrigger/useScrollTrigger';
import Slide from '@mui/material/Slide/Slide';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Filters from '../components/Filters/Filters';
import Header from '../components/Header';
import FixFilters from '../components/fixMui/FixFilter';
import YearsChart from '../components/Charts/YearsChart';
import TheChipArray from '../components/TheChipArray';
import { setAcademicPos, setYearsRange } from '../app/slices/testSlice';
import { AcademicStaffPosition } from '../models/api/response/academicStaff/academicStaff.data';

// A component only to hide the header element
const HideOnScroll = forwardRef<HTMLDivElement, { children: ReactElement }>(
    function HideOnScroll(props, ref) {
        const theme = useTheme();
        const isMobile = useMediaQuery(theme.breakpoints.down('md'));
        const { children } = props;
        const trigger = useScrollTrigger();

        return (
            <Slide appear={false} direction="down" in={!trigger || isMobile}>
                {React.cloneElement(children, { ref })}
            </Slide>
        );
    }
);

const unaryOp = (value: string): number => {
    return +value;
};

export const FixMui = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);
    const [searchParams] = useSearchParams();
    const firstRenderRef = useRef(true);
    const yearsRange = searchParams.get('yearsRange');
    const academicPositions = searchParams.get('academicPositions');
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('O XRISTOS KAI H MANA TOU RE TI KANEIS');
    }, []);

    useEffect(() => {
        // if (firstRenderRef.current) {
        //     firstRenderRef.current = false;
        //     return;
        // }
        // console.log(yearsRange);
        // if (yearsRange) {
        //     const yearsRangeArray = yearsRange.split('-').map(unaryOp);
        //     if (
        //         yearsRangeArray.length === 2 &&
        //         !Number.isNaN(yearsRangeArray[0]) &&
        //         !Number.isNaN(yearsRangeArray[1])
        //     ) {
        //         dispatch(setYearsRange(yearsRangeArray));
        //     }
        // }
        if (academicPositions) {
            console.log(academicPositions.split(','));
            const academicPos: AcademicStaffPosition[] = academicPositions
                .split(',')
                .map((position) => {
                    return {
                        position,
                    };
                });
            console.log(academicPos);

            dispatch(setAcademicPos(academicPos));
        } else {
            dispatch(setAcademicPos([]));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [academicPositions]);

    return (
        <>
            <HideOnScroll ref={headerRef}>
                <Header onChangeDrawer={() => {}} ref={headerRef} />
            </HideOnScroll>
            <Toolbar sx={{ display: { xs: 'none', md: 'flex' } }} />
            <Container
                // disableGutters
                maxWidth="xl"
                sx={{
                    mt: { xs: 1, md: 2, lg: 3 },
                    padding: { xs: '8px', sm: '12px', lg: '24px' },
                }}
            >
                <Grid2 container columnSpacing={{ xs: 0, md: 3 }}>
                    <Grid2
                        sx={{
                            display: { sx: 'none', md: 'block' },
                            width: { sx: '0px', md: '280px' },
                        }}
                    >
                        <FixFilters drawerStatus={drawerOpen} />
                    </Grid2>
                    <Grid2
                        xs
                        container
                        direction="column"
                        rowSpacing={2}
                        sx={{
                            padding: '0',
                            margin: '0',
                        }}
                    >
                        <Grid2
                            sx={{
                                width: '100%',
                                p: 0,
                            }}
                        >
                            <TheChipArray />
                        </Grid2>
                        <Grid2 xs>
                            <YearsChart />
                        </Grid2>
                    </Grid2>
                </Grid2>
            </Container>

            <SpeedDial
                open={false}
                ariaLabel="Opens the filter menu"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    display: { md: 'none' },
                }}
                onClick={() =>
                    setDrawerOpen((currentDrawerOpen) => !currentDrawerOpen)
                }
                icon={<TuneIcon sx={{ transform: 'rotate(-90deg)' }} />}
            />
        </>
    );
};
