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
import Paper from '@mui/material/Paper';
import { useSelector } from 'react-redux';
import Skeleton from '@mui/material/Skeleton/Skeleton';
import { DepartmentsData } from '../../models/api/response/departments/departments.data';
import {
    useGetDeparmentMutation,
    useGetJesusQuery,
} from '../../services/departmentApi';
import { RootState } from '../../app/store';

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
    // const [filter, { data, isLoading: isFetching }] = useGetDeparmentMutation({
    //     fixedCacheKey: 'shared-update-post',
    // });

    // AMA deis na kanei loading ksana auto to component. na ksereis ftaiei to FixCheckBox epeidh kaloun to idio endpoint kai auto to blepei
    const { data, isLoading: isFetching } = useGetJesusQuery({
        filter: 'id',
    });
    const labelTest = data?.data;
    const testData = useMemo((): ChartData<'bar'> => {
        return dataTest(labelTest);
    }, [labelTest]);

    const selectedDeps = useSelector(
        (state: RootState) => state.testSlice.academicPos
    );

    useEffect(() => {
        console.log('NANI? DATA HAS CHANGED?!?!?!?!');
        // fetch only when yearsRange has value, is not empty array
        console.log(selectedDeps);
    }, [selectedDeps]);

    // useEffect(() => {
    //     console.log('poses fores trexei auto re??!?');

    //     filter({ filter: 'id' });
    // }, [filter]);

    if (isFetching)
        return (
            <Skeleton
                animation="wave"
                variant="rounded"
                width="100%"
                height={700}
            />
        );
    // console.log(data);

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
