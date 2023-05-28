import {
    Container,
    Divider,
    SpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
    Toolbar,
    Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Unstable_Grid2';
import { createRef, useEffect, useRef, useState } from 'react';
import TuneIcon from '@mui/icons-material/Tune';
import Filters from '../components/Filters/Filters';
import Header from '../components/Header';
import TheSlide, { TheSlideProps } from '../components/TheSlide';
import YearsChart from '../components/Charts/YearsChart';

// TODO: A Header component, an filter component ( that it will be a form group), and the content component

const TestMui = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <>
            <Header
                onChangeDrawer={() =>
                    setDrawerOpen((currentDrawerOpen) => !currentDrawerOpen)
                }
            />
            <Toolbar />
            <Container
                // disableGutters
                maxWidth="xl"
                sx={{
                    mt: 3,
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
                        <Filters drawerStatus={drawerOpen} />
                    </Grid2>
                    <Grid2 xs>
                        <YearsChart />
                    </Grid2>
                </Grid2>
            </Container>

            <SpeedDial
                open={false}
                ariaLabel="SpeedDial basic example"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    display: { md: 'none' },
                }}
                icon={<TuneIcon sx={{ transform: 'rotate(-90deg)' }} />}
            />
        </>
    );
};

export default TestMui;
