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
import { useTheme } from '@mui/material/styles';
import { useGetDepartmentsQuery } from '../../services/departmentApi';
import { RootState } from '../../app/store';
import { PositionsByDepartment } from '../../models/api/response/academicStaff/academicStaff.data';
import { useGetPositionsByDepartmentsMutation } from '../../services/academicStaffApi';

export const dataTest = (
    data: PositionsByDepartment[],
    theme: string
): ChartData<'bar'> => {
    const bgColorOpacity = theme === 'dark' ? '0.7' : '0.9';
    // This for horizontal was dynamic. Now on vertical must be 1 value only
    const labels = ['Academic Positions'];

    const colors = [
        `rgba(31, 119, 180,${bgColorOpacity})`,
        `rgba(148, 103, 189,${bgColorOpacity})`,
        `rgba(255, 127, 14,${bgColorOpacity})`,
        `rgba(214, 39, 40,${bgColorOpacity})`,
        `rgba(44, 160, 44,${bgColorOpacity})`,
    ];
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );

    const datasets = data.length
        ? Object.keys(data[0].positions).map((position, index) => ({
              label: position,
              data: [
                  data
                      .map(
                          (positionsByDepartment) =>
                              positionsByDepartment.positions[position]
                      )
                      //   This is the biggest changed from horizontal chart. We want to collect all the data into an array
                      .reduce(
                          (accumulator, currentValue) =>
                              accumulator + currentValue,
                          0
                      ),
              ],
              backgroundColor: colors[index % colors.length],
          }))
        : [];
    return {
        labels: labels || [],
        datasets,
    };
};

export const options = {
    // For horizontal
    // indexAxis: 'y' as const,
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
            text: 'Academic Staff Positions Chart',
        },
    },
};

const TestVerticalChart = () => {
    const theme = useTheme();
    const [colorMode, setColorMode] = useState(theme.palette.mode);
    const { data, isLoading: isFetching } = useGetDepartmentsQuery({
        filter: ['id', 'url', 'deptname', 'university'],
    });

    const [
        departments,
        {
            data: departmentsPositionData,
            isLoading: isdepartmentsPositionLoading,
        },
    ] = useGetPositionsByDepartmentsMutation();

    const [labelTest, setLabelTest] = useState<PositionsByDepartment[]>([]);

    const selectedDeps = useSelector(
        (state: RootState) => state.filtersSlice.departments
    );

    const testData = useMemo(() => {
        return dataTest(labelTest, colorMode);
    }, [labelTest, colorMode]);

    useEffect(() => {
        setColorMode(theme.palette.mode);
    }, [theme.palette.mode]);

    useEffect(() => {
        if (selectedDeps.length) {
            departments({ departments: selectedDeps });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, selectedDeps]);

    useEffect(() => {
        if (departmentsPositionData?.data) {
            setLabelTest(departmentsPositionData?.data);
        }
    }, [departmentsPositionData]);

    if (
        (isdepartmentsPositionLoading || !labelTest.length) &&
        !!selectedDeps.length &&
        !labelTest.length
    )
        return (
            <Skeleton
                animation="wave"
                variant="rounded"
                width="100%"
                height={700}
            />
        );

    if (selectedDeps.length)
        return (
            <Paper
                sx={{
                    height: '400px',
                    p: { xs: '4px', md: '20px' },
                }}
            >
                <Bar options={options} data={testData} />
            </Paper>
        );

    return null;
};

export default TestVerticalChart;
