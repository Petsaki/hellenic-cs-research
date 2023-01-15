/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-empty-interface */
import { ChartData } from 'chart.js';
import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
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
    const { data, isFetching } = useGetDeparmentIdQuery('dai@uom');
    const labelTest = data?.data;
    const testData = useMemo((): ChartData<'bar'> => {
        return dataTest(labelTest);
    }, [labelTest]);
    if (isFetching) return <>Loading...</>;
    console.log(data);

    return <Bar options={options} data={testData} />;
};

export default Home;
