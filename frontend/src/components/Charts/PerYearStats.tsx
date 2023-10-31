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

export const generateChartOptions = (staffName: string): any => {
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
        },
        scales: {
            y: {
                ticks: {
                    callback(val: number): number | undefined {
                        if (val % 1 === 0) {
                            return val;
                        }
                        return undefined;
                    },
                },
            },
        },
    };
};

// export const test = {
//     datasets: [
//         {
//             // Marios - remove that for the fill
//             // fill: true,
//             label: 'Dataset 1',
//             data: labels.map(() => Math.floor(Math.random() * 1000)),
//             borderColor: 'rgb(255, 99, 132)',
//             backgroundColor: 'rgba(255, 99, 132, 0.5)',
//         },
//         {
//             // Marios - remove that for the fill
//             // fill: true,
//             label: 'Dataset 2',
//             data: labels.map(() => Math.floor(Math.random() * 1000)),
//             borderColor: 'rgb(53, 162, 235)',
//             backgroundColor: 'rgba(53, 162, 235, 0.5)',
//         },
//     ],
// };

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
    console.log(data);
    console.log(filterby);

    const bgColorOpacity = theme === 'dark' ? '0.7' : '0.9';
    const labels = Object.keys(tempData ?? {});
    // const renderBoth = data && data[0].split('|');
    // console.log(renderBoth);

    const colorMap = new Map<
        ResearchFilterBy,
        { borderColor: string; backgroundColor: string }
    >();
    colorMap.set(ResearchFilterBy.Citations, {
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: `rgba(53, 162, 235, ${bgColorOpacity})`,
    });
    colorMap.set(ResearchFilterBy.Publications, {
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: `rgba(255, 99, 132, ${bgColorOpacity})`,
    });
    // const colors = [
    //     `rgba(255, 99, 132,${bgColorOpacity})`,
    //     `rgba(53, 162, 235,${bgColorOpacity})`,
    // ];
    const test = [];
    if (!filterby) {
        Object.values(ResearchFilterBy).forEach(
            (filter: string, index: number) => {
                const colors = colorMap.get(filter as ResearchFilterBy);
                test.push({
                    fill: true,
                    label: filter,
                    data: Object.values(tempData).map((value: string) => {
                        if (value === '-') return 0;

                        return Number(value.split('|')[index]) ?? 0;
                    }),
                    borderColor: colors?.borderColor,
                    backgroundColor: colors?.backgroundColor,
                });
            }
        );
    } else {
        const colors = colorMap.get(filterby);
        test.push({
            fill: true,
            label: filterby,
            data: Object.values(tempData).map((value: string) => {
                if (value === '-') return 0;

                return Number(value);
            }),
            borderColor: colors?.borderColor,
            backgroundColor: colors?.backgroundColor,
        });
    }
    // const datasets = data.length
    //     ? Object.keys(data[0].positions).map((position, index) => ({
    //           label: position,
    //           data: data.map(
    //               (positionsByDepartment) =>
    //                   positionsByDepartment.positions[position]
    //           ),
    //           backgroundColor: colors[index % colors.length],
    //       }))
    //     : [];
    // console.log(datasets);

    const datasets = [
        {
            // Marios - remove that for the fill
            // fill: true,
            label: 'Dataset 1',
            data: labels.map(() => Math.floor(Math.random() * 1000)),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            // Marios - remove that for the fill
            // fill: true,
            label: 'Dataset 2',
            data: labels.map(() => Math.floor(Math.random() * 1000)),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ];

    return {
        labels: labels || [],
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
        return generateChartOptions(data?.id);
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
