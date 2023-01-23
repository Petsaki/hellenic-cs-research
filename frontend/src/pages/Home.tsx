/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-empty-interface */
import Alert from '@mui/material/Alert';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import { ChartData } from 'chart.js';
import { useEffect, useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import CloseIcon from '@mui/icons-material/Close';
import { DepartmentsData } from '../models/api/response/departments/departments.data';
import { useGetDeparmentIdQuery } from '../services/departmentApi';

export interface IHomeProps {}

export const dataTest = (
    labels: DepartmentsData | undefined
): ChartData<'bar'> => {
    return {
        labels: [labels?.id] || [],
        datasets: [
            {
                label: 'Dataset 1',
                data: [Math.floor(Math.random() * 1000)],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Dataset 2',
                data: [Math.floor(Math.random() * 1000)],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };
};

export const options = {
    scales: {
        x: {
            ticks: {
                autoSkip: false,
            },
        },
    },
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Departments Chart',
        },
    },
};

const Home: React.FC<IHomeProps> = (props) => {
    // const [open, setOpen] = useState(false);
    const { data, isFetching, isError } = useGetDeparmentIdQuery('marios');
    const labelTest = data?.data;
    // const handleClose = (
    //     event: React.SyntheticEvent | Event,
    //     reason?: string
    // ) => {
    //     if (reason === 'clickaway') {
    //         return;
    //     }
    //     setOpen(false);
    // };
    const testData = useMemo((): ChartData<'bar'> => {
        return dataTest(labelTest);
    }, [labelTest]);
    // useEffect(() => {
    //     console.log('inside useEffect', data);
    // }, [data]);
    if (isFetching) return <>Loading...</>;
    console.log(data);

    if (isError || !data) {
        // setOpen(true);
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                autoHideDuration={3000}
                open
                key="top center"
                message="Something went wrong."
                action={
                    <IconButton
                        aria-label="close"
                        color="inherit"
                        sx={{ p: 0.5 }}
                    >
                        <CloseIcon />
                    </IconButton>
                }
            />
        );
    }
    return (
        <Container maxWidth="lg">
            <Bar options={options} data={testData} />
        </Container>
    );
};

export default Home;
