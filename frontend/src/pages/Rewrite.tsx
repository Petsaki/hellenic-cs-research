import React, { useRef, useState } from 'react';
import Toolbar from '@mui/material/Toolbar/Toolbar';
import SpeedDial from '@mui/material/SpeedDial/SpeedDial';
import TuneIcon from '@mui/icons-material/Tune';
import { Container, SxProps, Theme, useTheme } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import HideOnScroll from '../components/Rewrite/HideOnScroll';
import Header from '../components/Header';
import YearsChart from '../components/Charts/YearsChart';
import TheChipArray from '../components/TheChipArray';
import FixFilters from '../components/fixMui/FixFilter';
import DepartmentStaff from '../components/Charts/DepartmentStaff';
import Statistics from '../components/Statistics';
import AcademicDataTable from '../components/AcademicDataTable';
import TheProgressBar from '../components/TheProgressBar';

const toolbar: SxProps = {
    display: { xs: 'none', md: 'flex' },
};

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

const mainContainer: SxProps = {
    mt: { xs: 1, md: 2, lg: 3 },
    padding: { xs: '8px', sm: '12px', lg: '24px' },
};

const Rewrite = () => {
    const theme = useTheme();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <TheProgressBar />
            <HideOnScroll ref={headerRef}>
                <Header onChangeDrawer={() => {}} ref={headerRef} />
            </HideOnScroll>
            <Toolbar sx={toolbar} />

            <Container
                // disableGutters
                maxWidth="xl"
                sx={mainContainer}
            >
                <Grid2 container columnSpacing={{ xs: 0, md: 3 }}>
                    <Grid2
                        sx={{
                            display: { sx: 'none', md: 'block' },
                            width: { sx: '0px', md: '240px' },
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
                                pt: 0,
                                minHeight: '52px',
                            }}
                        >
                            <TheChipArray />
                        </Grid2>
                        <Grid2
                            container
                            direction="column"
                            rowSpacing={2}
                            sx={{
                                width: '100%',
                                justifyContent: 'center',
                                margin: '0',
                                padding: '0',
                            }}
                        >
                            <Grid2
                                xs
                                sx={{
                                    width: '100%',
                                }}
                            >
                                <Statistics />
                            </Grid2>
                            <Grid2
                                xs
                                sx={{
                                    width: '100%',
                                }}
                            >
                                <DepartmentStaff />
                            </Grid2>
                            <Grid2
                                xs
                                sx={{
                                    width: '100%',
                                }}
                            >
                                <AcademicDataTable />
                                {/* <YearsChart /> */}
                            </Grid2>
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

export default Rewrite;
