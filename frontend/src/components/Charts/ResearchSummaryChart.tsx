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
import {
    useGetDepartmentsQuery,
    useGetResearchSummaryQuery,
} from '../../services/departmentApi';
import { RootState } from '../../app/store';
import { PositionsByDepartment } from '../../models/api/response/academicStaff/academicStaff.data';
import { StaffResearchSummary } from '../../models/api/response/departments/departments.data';

export const dataTest = (
    data: StaffResearchSummary[],
    theme: string
): ChartData<'bar'> => {
    const bgColorOpacity = theme === 'dark' ? '0.7' : '0.9';
    const labels = data.map((researchPerStaff) => researchPerStaff.name);

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
    const datasets: any = [];
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
    datasets.push({
        label: 'Citations',
        data: data.map((researchPerStaff) => researchPerStaff.citations),
        backgroundColor: `rgba(53, 162, 235, ${bgColorOpacity})`,
    });

    datasets.push({
        label: 'Publications',
        data: data.map((researchPerStaff) => researchPerStaff.publications),
        backgroundColor: `rgba(255, 99, 132, ${bgColorOpacity})`,
    });

    return {
        labels: labels || [],
        datasets,
    };
};

export interface ResearchSummaryChartProp {
    id: string | undefined;
}

const ResearchSummaryChart: React.FC<ResearchSummaryChartProp> = ({
    id,
}: ResearchSummaryChartProp) => {
    const theme = useTheme();
    const [colorMode, setColorMode] = useState(theme.palette.mode);
    const [runQuery, setRunQuery] = useState(false);

    const selectedPositions = useSelector(
        (state: RootState) => state.filtersSlice.academicPos
    );

    const selectedyears = useSelector(
        (state: RootState) => state.filtersSlice.yearsRange
    );

    const { data: depResearchSummary } = useGetResearchSummaryQuery(
        {
            departments: id ?? '',
            positions: selectedPositions,
            years: selectedyears,
        },
        {
            skip: !runQuery, // Skip the query if runQuery is false
        }
    );

    const options = useMemo(() => {
        return {
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
                    text: `${id} Research`,
                },
            },
        };
    }, [id]);

    useEffect(() => {
        setRunQuery(!!id);
    }, [id]);

    const [labelTest, setLabelTest] = useState<StaffResearchSummary[]>([]);

    const testData = useMemo(() => {
        return dataTest(labelTest, colorMode);
    }, [labelTest, colorMode]);

    useEffect(() => {
        setColorMode(theme.palette.mode);
    }, [theme.palette.mode]);

    useEffect(() => {
        if (depResearchSummary?.data) {
            console.log(depResearchSummary?.data[0].research);

            setLabelTest(depResearchSummary?.data[0].research);
        }
    }, [depResearchSummary]);

    if (!id) return null;

    if (selectedPositions.length)
        return (
            <Paper
                sx={{
                    width: '100%',
                    height: '900px',
                    p: { xs: '4px', md: '20px' },
                }}
            >
                <Bar options={options} data={testData} />
            </Paper>
        );

    return null;
};

export default ResearchSummaryChart;
