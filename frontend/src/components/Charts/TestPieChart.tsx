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
import { useGetDepartmentsQuery } from '../../services/departmentApi';
import { RootState } from '../../app/store';
import { useGetPositionsByDepartmentsMutation } from '../../services/academicStaffApi';
import { PositionsByDepartment } from '../../models/api/response/academicStaff/academicStaff.data';
import colorMap from '../../app/untils/chartPositionsColors';

export const dataTest = (
    data: PositionsByDepartment[],
    theme: string
): ChartData<'pie'> => {
    const bgColorOpacity = theme === 'dark' ? '0.7' : '0.9';
    const labels = data.length
        ? Object.keys(data[0].positions).map((position) => position)
        : [];

    const colors = labels.map((position: string) => {
        const colorInfo = colorMap.get(position);
        return colorInfo!.backgroundColor.replace('opacity', bgColorOpacity);
    });

    const borderColors = labels.map((position: string) => {
        const colorInfo = colorMap.get(position);
        return colorInfo!.borderColor;
    });

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        ArcElement,
        Title,
        Tooltip,
        Legend
    );

    // const datasets = data.length
    //     ? Object.keys(data[0].positions).map((position, index) => ({
    //           label: position,
    //           data: [
    //               data
    //                   .map(
    //                       (positionsByDepartment) =>
    //                           positionsByDepartment.positions[position]
    //                   )
    //                   .reduce(
    //                       (accumulator, currentValue) =>
    //                           accumulator + currentValue,
    //                       0
    //                   ),
    //           ],
    //           backgroundColor: colors[index % colors.length],
    //       }))
    //     : [];
    const positionSums = labels.map((position) =>
        data.reduce(
            (total, department) =>
                total + (department.positions[position] || 0),
            0
        )
    );

    console.log(positionSums);

    const datasets = [
        {
            label: '# of Academic Staff',
            data: positionSums,
            backgroundColor: colors,
            borderColor: borderColors,
        },
    ];
    console.log(datasets);
    console.log(data);
    console.log(datasets.length);

    return {
        labels: labels || [],
        datasets,
    };
};

const TestPieChart = () => {
    // eslint-disable-next-line no-empty-pattern
    const theme = useTheme();
    const myChartRef = useRef<ChartJSOrUndefined<'pie'>>();
    const [colorMode, setColorMode] = useState(theme.palette.mode);
    const [positionsSum, setpositionsSum] = useState<number>();
    // AMA deis na kanei loading ksana auto to component. na ksereis ftaiei to FixCheckBox epeidh kaloun to idio endpoint kai auto to blepei
    const { data, isLoading: isFetching } = useGetDepartmentsQuery({
        filter: ['id', 'url'],
    });
    // const defaultLegendClickHandler = Chart.defaults.plugins.legend.onClick;
    // const pieDoughnutLegendClickHandler = Chart.controllers.doughnut.overrides.plugins.legend.onClick;

    // console.log(Chart);

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

    const options = {
        response: true,
        plugins: {
            // Where to display the labels (aka data 1, data 2..)
            legend: {
                position: 'top' as const,
                // onClick: (e, legendItem) => {
                //     const { index, hidden, text } = legendItem;
                //     const dataset = testData.datasets[0].data[index];
                //     console.log(e);
                //     const { chart } = e;
                //     const meta = chart.getDatasetMeta(index);
                //     console.log(chart);
                //     console.log(meta);
                //     meta.hidden = meta.hidden === null ? hidden : null;
                //     legendItem.hidden = !hidden;
                //     console.log(meta);

                //     console.log(
                //         `Legend item "${text}" clicked with value: ${dataset}. Disabled: ${hidden}`
                //     );
                //     chart.update();
                // },
                onClick: (e: any, legendItem: any, legend: any) => {
                    console.log(legendItem.hidden);
                    console.log(legendItem.index);
                    console.log(legendItem);
                    console.log(testData.datasets[0].data);
                    console.log(testData.datasets[0].data[legendItem.index]);
                    legend.chart.toggleDataVisibility(legendItem.index);

                    setpositionsSum((prevSum) => {
                        return (
                            (prevSum || 0) +
                            (legendItem.hidden ? +1 : -1) *
                                testData.datasets[0].data[legendItem.index]
                        );
                    });
                    console.log(legendItem.hidden);
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
                        console.log('MARIOS EDW: ', d);
                        console.log(
                            d.dataset.data.reduce(
                                (total: number, position: number) =>
                                    total + position || 0
                            )
                        );
                        const total = d.dataset.data.reduce(
                            (totalPositions: number, position: number) =>
                                totalPositions + position || 0
                        );

                        console.log(positionsSum);

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
        console.log(data);

        // When the 'data' changes, update 'labelTest' state with the transformed data
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
            const labels = departmentsPositionData?.data.length
                ? Object.keys(departmentsPositionData?.data[0].positions).map(
                      (position) => position
                  )
                : [];

            const positionSums = labels
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
        (isdepartmentsPositionLoading || !labelTest.length) &&
        !!selectedDeps.length &&
        !labelTest.length
    )
        return (
            <Skeleton
                animation="wave"
                variant="rounded"
                sx={{
                    width: { xs: '100%', lg: '60%' },
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
                    // height: '700px',
                    width: { xs: '100%', lg: '60%' },
                    aspectRatio: { xs: '4/3', xl: '3/4' },
                    position: 'relative',
                    maxHeight: '600px',
                    p: { xs: '10px', md: '20px' },
                }}
            >
                <Pie ref={myChartRef} options={options} data={testData} />
            </Paper>
        );

    return null;
};

export default TestPieChart;
