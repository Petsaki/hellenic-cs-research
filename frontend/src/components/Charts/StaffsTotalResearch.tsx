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
import { useTheme } from '@mui/material/styles';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';
import { useGetAcademicPositionTotalsQuery } from '../../services/departmentApi';
import { RootState } from '../../app/store';
import { IAcademicPositionTotals } from '../../models/api/response/departments/departments.data';
import colorMap from '../../app/untils/chartPositionsColors';

export const dataTest = (
    data: IAcademicPositionTotals[],
    theme: string
): ChartData<'pie'> => {
    const bgColorOpacity = theme === 'dark' ? '0.7' : '0.9';
    const labels = data.length
        ? data[0]?.researchPerPosition?.map((research) => research.position)
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

    const datasets = [
        {
            label: '# of Academic Staff',
            data:
                data[0]?.researchPerPosition?.map(
                    (research) => research.citations
                ) ?? 0,
            backgroundColor: colors,
            borderColor: borderColors,
        },
    ];

    return {
        labels: labels || [],
        datasets,
    };
};

export interface StaffsTotalResearchProp {
    id: string | undefined;
}

const StaffsTotalResearch: React.FC<StaffsTotalResearchProp> = ({
    id,
}: StaffsTotalResearchProp) => {
    // eslint-disable-next-line no-empty-pattern
    const theme = useTheme();
    const [colorMode, setColorMode] = useState(theme.palette.mode);
    const [positionsSum, setpositionsSum] = useState<number>();
    const [runQuery, setRunQuery] = useState(false);
    const myChartRef = useRef<ChartJSOrUndefined<'pie'>>();

    const [labelTest, setLabelTest] = useState<IAcademicPositionTotals[]>([]);

    const selectedPositions = useSelector(
        (state: RootState) => state.filtersSlice.academicPos
    );

    const selectedyears = useSelector(
        (state: RootState) => state.filtersSlice.yearsRange
    );

    const { data: academicPositionTotalsData } =
        useGetAcademicPositionTotalsQuery(
            {
                departments: id ?? '',
                positions: selectedPositions,
                years: selectedyears,
            },
            {
                skip: !runQuery, // Skip the query if runQuery is false
            }
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
                onClick: (e: any, legendItem: any, legend: any) => {
                    legend.chart.toggleDataVisibility(legendItem.index);

                    setpositionsSum((prevSum) => {
                        return (
                            (prevSum || 0) +
                            (legendItem.hidden ? +1 : -1) *
                                testData.datasets[0].data[legendItem.index]
                        );
                    });
                    legend.chart.update();
                },
            },
            title: {
                display: true,
                text: `${id}: Citations Per Academic Position Chart`,
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
        setRunQuery(!!id);
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
    }, [id]);

    useEffect(() => {
        if (academicPositionTotalsData?.data) {
            setLabelTest(academicPositionTotalsData?.data);

            const positionSums =
                academicPositionTotalsData?.data[0]?.researchPerPosition?.reduce(
                    (total, research) => total + (research.citations || 0),
                    0
                ) || 0;

            setpositionsSum(positionSums || 0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [academicPositionTotalsData]);

    if (!id) return null;

    return (
        <Paper
            sx={{
                height: '700px',
                p: '20px',
            }}
        >
            <Pie ref={myChartRef} options={options} data={testData} />
        </Paper>
    );
};

export default StaffsTotalResearch;
