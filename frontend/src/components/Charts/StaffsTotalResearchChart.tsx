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
import { useTheme } from '@mui/material/styles';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';
import { useSelector } from 'react-redux';
import { IAcademicPositionTotals } from '../../models/api/response/departments/departments.data';
import colorMap from '../../app/untils/chartPositionsColors';
import { SelectedDepInfo } from '../DataTables/DepartmentDataTable';
import { RootState } from '../../app/store';

export const dataTest = (
    data: IAcademicPositionTotals[],
    theme: string,
    filter: TotalResearchFilter
): ChartData<'pie'> => {
    const bgColorOpacity = theme === 'dark' ? '0.7' : '0.9';
    const labels = data.length
        ? data[0]?.research_per_position?.map((research) => research.position)
        : [];

    const colors = labels.map((position: string) => {
        const colorInfo = colorMap.get(position);
        return colorInfo?.backgroundColor.replace('opacity', bgColorOpacity);
    });

    const borderColors = labels.map((position: string) => {
        const colorInfo = colorMap.get(position);
        return colorInfo?.borderColor;
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
                data[0]?.research_per_position?.map(
                    (research) => research[filter]
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

export type TotalResearchFilter = 'citations' | 'publications';

export interface StaffsTotalResearchChartProp {
    selectedDepInfo: SelectedDepInfo;
    data: IAcademicPositionTotals[] | undefined;
    filter: TotalResearchFilter;
}

const StaffsTotalResearchChart: React.FC<StaffsTotalResearchChartProp> = ({
    selectedDepInfo,
    data,
    filter,
}: StaffsTotalResearchChartProp) => {
    // eslint-disable-next-line no-empty-pattern
    const theme = useTheme();
    const [colorMode, setColorMode] = useState(theme.palette.mode);
    const [positionsSum, setpositionsSum] = useState<number>();
    const myChartRef = useRef<ChartJSOrUndefined<'pie'>>();

    const sliceShowFullName = useSelector(
        (state: RootState) => state.filtersSlice.showDepFullName
    );

    const [labelTest, setLabelTest] = useState<IAcademicPositionTotals[]>([]);

    const testData = useMemo(() => {
        return dataTest(labelTest, colorMode, filter);
    }, [labelTest, colorMode, filter]);

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
                text: sliceShowFullName
                    ? [
                          `${selectedDepInfo?.deptname}, `,
                          selectedDepInfo?.university,
                          `${
                              filter.charAt(0).toUpperCase() + filter.slice(1)
                          } Per Academic Position Chart`,
                      ]
                    : `${selectedDepInfo?.id} ${
                          filter.charAt(0).toUpperCase() + filter.slice(1)
                      } Per Academic Position Chart`,
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
    }, [selectedDepInfo, data]);

    useEffect(() => {
        if (data) {
            setLabelTest(data);

            const positionSums =
                data[0]?.research_per_position?.reduce(
                    (total, research) => total + (research[filter] || 0),
                    0
                ) || 0;

            setpositionsSum(positionSums || 0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    return <Pie ref={myChartRef} options={options} data={testData} />;
};

export default StaffsTotalResearchChart;
