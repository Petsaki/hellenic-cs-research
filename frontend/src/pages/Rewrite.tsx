import React, { useRef, useState } from 'react';
import Toolbar from '@mui/material/Toolbar/Toolbar';
import SpeedDial from '@mui/material/SpeedDial/SpeedDial';
import TuneIcon from '@mui/icons-material/Tune';
import { Container, SxProps } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import HideOnScroll from '../components/Rewrite/HideOnScroll';
import Header from '../components/Header';
import YearsChart from '../components/Charts/YearsChart';
import TheChipArray from '../components/TheChipArray';
import FixFilters from '../components/fixMui/FixFilter';

const toolbar: SxProps = {
    display: { xs: 'none', md: 'flex' },
};

const speedDial: SxProps = {
    position: 'fixed',
    bottom: 16,
    right: 16,
    display: { md: 'none' },
    '& .MuiSvgIcon-root': {
        transform: 'rotate(-90deg)',
    },
};

const mainContainer: SxProps = {
    mt: { xs: 1, md: 2, lg: 3 },
    padding: { xs: '8px', sm: '12px', lg: '24px' },
};

const Rewrite = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const headerRef = useRef<HTMLDivElement>(null);

    return (
        <>
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
                sx={speedDial}
                onClick={() =>
                    setDrawerOpen((currentDrawerOpen) => !currentDrawerOpen)
                }
                icon={<TuneIcon />}
            />
        </>
    );
};

export default Rewrite;
