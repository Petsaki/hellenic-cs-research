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
import { useTheme } from '@mui/material/styles';
import { useGetResearchSummaryQuery } from '../../services/departmentApi';
import { RootState } from '../../app/store';
import { StaffResearchSummary } from '../../models/api/response/departments/departments.data';
import { SelectedDepInfo } from '../DataTables/DepartmentDataTable';

export const dataTest = (
    data: StaffResearchSummary[],
    theme: string
): ChartData<'bar'> => {
    const bgColorOpacity = theme === 'dark' ? '0.7' : '0.9';
    const labels = data.map((researchPerStaff) => researchPerStaff.name);

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );
    const datasets: any = [];

    datasets.push({
        label: 'Citations',
        data: data.map((researchPerStaff) => researchPerStaff.citations),
        backgroundColor: `rgba(53, 162, 235, ${bgColorOpacity})`,
        xAxisID: 'C',
    });

    datasets.push({
        label: 'Publications',
        data: data.map((researchPerStaff) => researchPerStaff.publications),
        backgroundColor: `rgba(255, 99, 132, ${bgColorOpacity})`,
        xAxisID: 'P',
    });

    return {
        labels: labels || [],
        datasets,
    };
};

export interface ResearchSummaryChartProp {
    selectedDepInfo: SelectedDepInfo;
}

const ResearchSummaryChart: React.FC<ResearchSummaryChartProp> = ({
    selectedDepInfo,
}: ResearchSummaryChartProp) => {
    const theme = useTheme();
    const [colorMode, setColorMode] = useState(theme.palette.mode);
    const [runQuery, setRunQuery] = useState(false);

    const selectedPositions = useSelector(
        (state: RootState) => state.filtersSlice.academicPos
    );

    const selectedyears = useSelector(
        (state: RootState) => state.filtersSlice.yearsFilters.yearsRange
    );

    const selectedUnknownYear = useSelector(
        (state: RootState) => state.filtersSlice.yearsFilters.unknownYear
    );

    const sliceShowFullName = useSelector(
        (state: RootState) => state.filtersSlice.showDepFullName
    );

    const { data: depResearchSummary } = useGetResearchSummaryQuery(
        {
            departments: selectedDepInfo?.id ?? '',
            positions: selectedPositions,
            years: selectedyears,
            unknown_year: selectedUnknownYear,
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
                C: {
                    position: 'top' as const,
                    ticks: {
                        beginAtZero: true,
                        color: 'rgb(53, 162, 235)',
                        precision: 0,
                    },
                    grid: { display: false },
                },

                P: {
                    position: 'bottom' as const,
                    ticks: {
                        beginAtZero: true,
                        color: 'rgb(255, 99, 132)',
                        precision: 0,
                    },
                    grid: { display: false },
                },
            },
            plugins: {
                // Where to display the labels (aka data 1, data 2..)
                legend: {
                    position: 'top' as const,
                },
                title: {
                    display: true,
                    text: sliceShowFullName
                        ? [
                              `${selectedDepInfo?.deptname}, `,
                              selectedDepInfo?.university,
                              'Research',
                          ]
                        : `${selectedDepInfo?.id} Research`,
                },
                tooltip: {
                    mode: 'index' as const,
                    intersect: true,
                },
            },
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDepInfo, sliceShowFullName]);

    useEffect(() => {
        setRunQuery(!!selectedDepInfo?.id);
    }, [selectedDepInfo]);

    const [labelTest, setLabelTest] = useState<StaffResearchSummary[]>([]);

    const testData = useMemo(() => {
        return dataTest(labelTest, colorMode);
    }, [labelTest, colorMode]);

    useEffect(() => {
        setColorMode(theme.palette.mode);
    }, [theme.palette.mode]);

    useEffect(() => {
        if (depResearchSummary?.data.length) {
            setLabelTest(depResearchSummary?.data[0]?.research);
        }
    }, [depResearchSummary]);

    if (!selectedDepInfo?.id) return null;

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
