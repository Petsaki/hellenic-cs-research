import { useMemo, useEffect, useState } from 'react';
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
import Paper from '@mui/material/Paper';
import { useSelector } from 'react-redux';
import Skeleton from '@mui/material/Skeleton/Skeleton';
import { useGetJesusQuery } from '../../services/departmentApi';
import { RootState } from '../../app/store';

export const dataTest = (labels: string[] | undefined): ChartData<'bar'> => {
    return {
        labels: labels || [],
        datasets: [
            {
                label: 'Dataset 1',
                data: labels
                    ? labels?.map(() => Math.floor(Math.random() * 1000))
                    : [],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Dataset 2',
                data: labels
                    ? labels?.map(() => Math.floor(Math.random() * 1000))
                    : [],
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };
};

export const options = {
    indexAxis: 'y' as const,
    maintainAspectRatio: false,
    response: true,
    scales: {
        y: {
            ticks: {
                autoSkip: false,
            },
        },
    },
    plugins: {
        // Where to display the labels (aka data 1, data 2..)
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Departments Chart',
        },
    },
};

const YearsChart = () => {
    // eslint-disable-next-line no-empty-pattern

    // AMA deis na kanei loading ksana auto to component. na ksereis ftaiei to FixCheckBox epeidh kaloun to idio endpoint kai auto to blepei
    const { data, isLoading: isFetching } = useGetJesusQuery({
        filter: 'id',
    });
    const [labelTest, setLabelTest] = useState<string[]>([]);

    const selectedDeps = useSelector(
        (state: RootState) => state.testSlice.departments
    );

    const testData = useMemo(() => {
        return dataTest(labelTest);
    }, [labelTest]);

    useEffect(() => {
        // When the 'data' changes, update 'labelTest' state with the transformed data
        if (selectedDeps.length) {
            setLabelTest(selectedDeps);
        } else if (data && data.data) {
            const transformedData = data.data.map(
                (department) => department.id
            );
            setLabelTest(transformedData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, selectedDeps]);

    if (isFetching)
        return (
            <Skeleton
                animation="wave"
                variant="rounded"
                width="100%"
                height={700}
            />
        );

    return (
        <Paper
            sx={{
                height: '700px',
                p: '20px',
            }}
        >
            <Bar options={options} data={testData} />
        </Paper>
    );
};

export default YearsChart;
