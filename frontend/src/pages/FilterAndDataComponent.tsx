import { useState } from 'react';
import SpeedDial from '@mui/material/SpeedDial/SpeedDial';
import TuneIcon from '@mui/icons-material/Tune';
import { Container, SxProps, Theme, useTheme } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { Outlet } from 'react-router-dom';
import TheChipArray from '../components/TheChipArray';
import Filters from '../components/Filters';

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

const FilterAndDataComponent = () => {
    const theme = useTheme();
    const [drawerOpen, setDrawerOpen] = useState(false);

    return (
        <>
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
                        <Filters drawerStatus={drawerOpen} />
                    </Grid2>

                    <Grid2
                        xs
                        container
                        direction="column"
                        sx={{
                            marginBottom: { xs: '4rem', md: '0' },
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
