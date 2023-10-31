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
import { useGetPositionsByDepartmentsMutation } from '../../services/academicStaffApi';
import { PositionsByDepartment } from '../../models/api/response/academicStaff/academicStaff.data';

export const dataTest = (
    data: PositionsByDepartment[],
    theme: string
): ChartData<'bar'> => {
    const bgColorOpacity = theme === 'dark' ? '0.7' : '0.9';
    const labels = data.map(
        (positionsByDepartment) => positionsByDepartment.inst
    );

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
              data: data.map(
                  (positionsByDepartment) =>
                      positionsByDepartment.positions[position]
              ),
              backgroundColor: colors[index % colors.length],
          }))
        : [];
    console.log(datasets);

    return {
        labels: labels || [],
        datasets,
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
            text: "Department's Staff Positions Chart",
        },
    },
};

const DepartmentStaff = () => {
    // eslint-disable-next-line no-empty-pattern
    const theme = useTheme();
    const [colorMode, setColorMode] = useState(theme.palette.mode);
    // AMA deis na kanei loading ksana auto to component. na ksereis ftaiei to FixCheckBox epeidh kaloun to idio endpoint kai auto to blepei
    const { data, isLoading: isFetching } = useGetDepartmentsQuery({
        filter: 'id',
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
        // When the 'data' changes, update 'labelTest' state with the transformed data
        if (selectedDeps.length) {
            departments({ departments: selectedDeps });
        }
        // It was to have all the departments positions by default
        // else if (data && data.data) {
        //     const transformedData = data.data.map(
        //         (department) => department.id
        //     );
        //     departments({ departments: transformedData });
        // }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, selectedDeps]);

    useEffect(() => {
        if (departmentsPositionData?.data) {
            console.log(
                'departmentsPositionData?.data',
                departmentsPositionData?.data
            );

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
                    height: '700px',
                    p: { xs: '4px', md: '20px' },
                }}
            >
                <Bar options={options} data={testData} />
            </Paper>
        );

    return null;
};

export default DepartmentStaff;
