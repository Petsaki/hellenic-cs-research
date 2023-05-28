import { useEffect, useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { DepartmentsData } from '../models/api/response/departments/departments.data';
import { useGetDeparmentMutation } from '../services/departmentApi';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const dataTest = (
    labels: DepartmentsData[] | undefined
): ChartData<'bar'> => {
    const result: string[] | undefined = labels?.map(
        (a: DepartmentsData) => a.id
    );

    return {
        labels: result || [],
        datasets: [
            {
                label: 'Dataset 1',
                data: result
                    ? result?.map(() => Math.floor(Math.random() * 1000))
                    : [],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Dataset 2',
                data: result
                    ? result?.map(() => Math.floor(Math.random() * 1000))
                    : [],
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

function Chart() {
    // eslint-disable-next-line no-empty-pattern
    const [filter, { data, isLoading: isFetching }] = useGetDeparmentMutation();
    const labelTest = data?.data;
    const testData = useMemo((): ChartData<'bar'> => {
        return dataTest(labelTest);
    }, [labelTest]);

    useEffect(() => {
        filter({ filter: 'id' });
    }, [filter]);

    if (isFetching && !data) return <>Loading...</>;
    console.log(data);

    return (
        <>
            <Bar options={options} data={testData} />
            <code>{JSON.stringify(import.meta.env.VITE_APP_TITLE)}</code>
        </>
    );
}

export default Chart;
