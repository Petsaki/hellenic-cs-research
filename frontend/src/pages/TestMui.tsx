import { Container, Divider, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Grid2 from '@mui/material/Unstable_Grid2';
import Filters from '../components/Filters/Filters';
import Header from '../components/Header';

// TODO: A Header component, an filter component ( that it will be a form group), and the content component

function TestMui() {
    return (
        <>
            <Header />
            <Container
                maxWidth="xl"
                sx={{
                    mt: 3,
                }}
            >
                <Grid2 container>
                    <Grid2 xs={2.5}>
                        <Filters />
                    </Grid2>
                    <Grid2 xs={9.5}>
                        <Typography>Hello world!</Typography>
                    </Grid2>
                </Grid2>
            </Container>
        </>
    );
}

export default TestMui;
