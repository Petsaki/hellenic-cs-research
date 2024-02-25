import { useMemo, useEffect, useState, useRef } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ArcElement,
    Chart,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Paper from '@mui/material/Paper';
import { useSelector } from 'react-redux';
import Skeleton from '@mui/material/Skeleton/Skeleton';
import { useTheme } from '@mui/material/styles';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';
import { RootState } from '../../app/store';
import { useGetPositionsByDepartmentsMutation } from '../../services/academicStaffApi';
import { PositionsByDepartment } from '../../models/api/response/academicStaff/academicStaff.data';
import colorMap from '../../app/untils/chartPositionsColors';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

export const createData = (
    data: PositionsByDepartment[],
    theme: string
): ChartData<'pie'> => {
    const bgColorOpacity = theme === 'dark' ? '0.7' : '0.9';
    const labels = data.length
        ? Object.keys(data[0].positions).map((position) => position)
        : [];

    const colors = labels.map((position: string) => {
        const colorInfo = colorMap.get(position);
        return colorInfo?.backgroundColor.replace('opacity', bgColorOpacity);
    });

    const borderColors = labels.map((position: string) => {
        const colorInfo = colorMap.get(position);
        return colorInfo?.borderColor;
    });

    const positionSums = labels.map((position) =>
        data.reduce(
            (total, department) =>
                total + (department.positions[position] || 0),
            0
        )
    );

    const datasets = [
        {
            label: '# of Academic Staff',
            data: positionSums,
            backgroundColor: colors,
            borderColor: borderColors,
        },
    ];

    return {
        labels: labels || [],
        datasets,
    };
};

const PositionsPieChart = () => {
    // eslint-disable-next-line no-empty-pattern
    const theme = useTheme();
    const myChartRef = useRef<ChartJSOrUndefined<'pie'>>();
    const [colorMode, setColorMode] = useState(theme.palette.mode);
    const [positionsSum, setpositionsSum] = useState<number>();
    const [
        departments,
        {
            data: departmentsPositionData,
            isLoading: isdepartmentsPositionLoading,
        },
    ] = useGetPositionsByDepartmentsMutation();

    const [labels, setLabels] = useState<PositionsByDepartment[]>([]);

    const selectedDeps = useSelector(
        (state: RootState) => state.filtersSlice.departments
    );

    const chartsData = useMemo(() => {
        return createData(labels, colorMode);
    }, [labels, colorMode]);

    const options = {
        response: true,
        plugins: {
            legend: {
                position: 'top' as const,
                onClick: (e: any, legendItem: any, legend: any) => {
                    legend.chart.toggleDataVisibility(legendItem.index);

                    setpositionsSum((prevSum) => {
                        return (
                            (prevSum || 0) +
                            (legendItem.hidden ? +1 : -1) *
                                chartsData.datasets[0].data[legendItem.index]
                        );
                    });
                    legend.chart.update();
                },
            },
            title: {
                display: true,
                text: 'Academic Staff Positions Chart',
            },
            tooltip: {
                callbacks: {
                    label: (d: any) => {
                        const percentage = ` ${(
                            +(d.raw / (positionsSum || 0)) * 100
                        ).toFixed(2)}% (${d.raw})`;

                        return percentage;
                    },
                },
            },
        },
    };

    useEffect(() => {
        setColorMode(theme.palette.mode);
    }, [theme.palette.mode]);

    useEffect(() => {
        if (selectedDeps.length) {
            departments({ departments: selectedDeps });
        }

        if (myChartRef.current) {
            const myPie: Chart = myChartRef.current as Chart;

            myPie?.legend?.legendItems?.forEach((legend, index) => {
                if (legend.hidden) {
                    myPie.toggleDataVisibility(index);
                }
            });
            myPie.update();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDeps]);

    useEffect(() => {
        if (departmentsPositionData?.data) {
            setLabels(departmentsPositionData?.data);
            const newLabels = departmentsPositionData?.data.length
                ? Object.keys(departmentsPositionData?.data[0].positions).map(
                      (position) => position
                  )
                : [];

            const positionSums = newLabels
                .map((position) =>
                    departmentsPositionData?.data.reduce(
                        (total, department) =>
                            total + (department.positions[position] || 0),
                        0
                    )
                )
                .reduce(
                    (totalPositions: number, position: number) =>
                        totalPositions + position || 0
                );

            setpositionsSum(positionSums || 0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [departmentsPositionData]);

    if (
        (isdepartmentsPositionLoading || !labels.length) &&
        !!selectedDeps.length &&
        !labels.length
    )
        return (
            <Skeleton
                animation="wave"
                variant="rounded"
                sx={{
                    width: { xs: '100%', lg: '55%' },
                    aspectRatio: { xs: '4/3', xl: '3/4' },
                    height: '600px',
                }}
            />
        );

    if (selectedDeps.length)
        return (
            <Paper
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: { xs: '100%', lg: '55%' },
                    aspectRatio: { xs: '4/3', xl: '3/4' },
                    position: 'relative',
                    maxHeight: '600px',
                    p: { xs: '10px', md: '20px' },
                }}
            >
                <Pie ref={myChartRef} options={options} data={chartsData} />
            </Paper>
        );

    return null;
};

export default PositionsPieChart;
