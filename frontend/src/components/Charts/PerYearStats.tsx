import { useTheme } from '@mui/material/styles';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    ChartData,
} from 'chart.js';
import { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Paper from '@mui/material/Paper/Paper';
import { ResearchFilterBy } from '../DataTables/ResearchActivityTable';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

export const generateChartOptions = (
    staffName: string,
    filterby: ResearchFilterBy
): any => {
    return {
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: `${staffName} Research Per Year`,
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
            },
        },
        scales: {
            ...((filterby === ResearchFilterBy.Citations || !filterby) && {
                C: {
                    position: 'left' as const,
                    ticks: {
                        beginAtZero: true,
                        color: 'rgb(53, 162, 235)',
                        precision: 0,
                    },
                    grid: { display: false },
                },
            }),
            ...((filterby === ResearchFilterBy.Publications || !filterby) && {
                P: {
                    position: 'right' as const,
                    ticks: {
                        beginAtZero: true,
                        color: 'rgb(255, 99, 132)',
                        precision: 0,
                    },
                    grid: { display: false },
                },
            }),
        },
    };
};

export const generateChartData = (
    data: Record<string, string>,
    theme: string,
    filterby: ResearchFilterBy
): ChartData<'line'> => {
    if (!data)
        return {
            labels: [],
            datasets: [],
        };
    const tempData = { ...data };
    delete tempData?.id;

    const bgColorOpacity = theme === 'dark' ? '0.7' : '0.9';
    const labels = Object.keys(tempData ?? {});

    const colorMap = new Map<
        ResearchFilterBy,
        { borderColor: string; backgroundColor: string }
    >();
    colorMap.set(ResearchFilterBy.Citations, {
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: `rgba(53, 162, 235, ${
            filterby ? bgColorOpacity : '0.3'
        })`,
    });
    colorMap.set(ResearchFilterBy.Publications, {
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: `rgba(255, 99, 132, ${bgColorOpacity})`,
    });

    const sortedYearsArray = labels.sort((a, b) => {
        const numA = parseInt(a, 10);
        const numB = parseInt(b, 10);

        if (numA === -1) return -1;
        if (numB === -1) return 1;

        return numA - numB;
    });

    // Remove the property with key '-1' and get its value
    const deletedValue = tempData['-1'];
    delete tempData['-1'];

    // Create a new object without the property with key '-1'
    const newObject: Record<string, string> = {
        ...(deletedValue && { '0': deletedValue }),
        ...tempData,
    };

    const test = [];
    if (!filterby) {
        Object.values(ResearchFilterBy).forEach(
            (filter: string, index: number) => {
                const colors = colorMap.get(filter as ResearchFilterBy);
                test.push({
                    fill: true,
                    label: filter,
                    data: Object.values(newObject).map((value: string) => {
                        if (value === '-') return 0;

                        return (
                            Number(
                                value?.split('/')[
                                    filter === ResearchFilterBy.Citations
                                        ? 1
                                        : 0
                                ]
                            ) ?? 0
                        );
                    }),
                    borderColor: colors?.borderColor,
                    backgroundColor: colors?.backgroundColor,
                    yAxisID: filter === ResearchFilterBy.Citations ? 'C' : 'P',
                });
            }
        );
    } else {
        const colors = colorMap.get(filterby);
        test.push({
            fill: true,
            label: filterby,
            data: Object.values(newObject).map((value: string) => {
                if (value === '-') return 0;

                return Number(value);
            }),
            borderColor: colors?.borderColor,
            backgroundColor: colors?.backgroundColor,
            yAxisID: filterby === ResearchFilterBy.Citations ? 'C' : 'P',
        });
    }

    return {
        labels: sortedYearsArray || [],
        datasets: test,
    };
};

export interface PerYearStatsProp {
    data: any;
    filterby: ResearchFilterBy;
}

const PerYearStats: React.FC<PerYearStatsProp> = ({
    data,
    filterby,
}: PerYearStatsProp) => {
    const theme = useTheme();

    const [colorMode, setColorMode] = useState(theme.palette.mode);

    const chartData = useMemo(() => {
        return generateChartData(data, colorMode, filterby);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, colorMode]);

    const chartoptions = useMemo(() => {
        return generateChartOptions(data?.id, filterby);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        setColorMode(theme.palette.mode);
    }, [theme.palette.mode]);

    if (!data) return null;

    return (
        <Paper
            sx={{
                height: { xs: '450px', lg: '650px' },
                p: { xs: '4px', md: '20px' },
                minHeight: '400px',
            }}
        >
            <Line options={chartoptions} data={chartData} />
        </Paper>
    );
};

export default PerYearStats;
