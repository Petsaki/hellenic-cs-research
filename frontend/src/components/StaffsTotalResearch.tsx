import Paper from '@mui/material/Paper/Paper';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { SxProps } from '@mui/material';
import StaffsTotalResearchChart from './Charts/StaffsTotalResearchChart';
import { useGetAcademicPositionTotalsQuery } from '../services/departmentApi';
import { RootState } from '../app/store';
import SectionTitle from './SectionTitle';
import ResearchSummaryChart from './Charts/ResearchSummaryChart';
import { SelectedDepInfo } from './DataTables/DepartmentDataTable';

const cardStyle: SxProps = {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    aspectRatio: { xs: '4/3', xl: '3/4' },
    position: 'relative',
    maxHeight: '600px',
    p: { xs: '10px', md: '20px' },
};

export interface StaffsTotalResearchProp {
    selectedDepInfo: SelectedDepInfo;
}

const StaffsTotalResearch: React.FC<StaffsTotalResearchProp> = ({
    selectedDepInfo,
}: StaffsTotalResearchProp) => {
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

    const { data: academicPositionTotalsData } =
        useGetAcademicPositionTotalsQuery(
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

    useEffect(() => {
        setRunQuery(!!selectedDepInfo?.id);
    }, [selectedDepInfo]);

    if (!selectedDepInfo?.id) return null;

    return (
        <>
            <Grid2
                container
                columnSpacing={{ sm: 0, md: 3 }}
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', lg: 'row' },
                    margin: '0',
                    padding: '0',
                }}
            >
                <Grid2 xs>
                    <SectionTitle titleText="Citations Research" />
                    <Paper sx={cardStyle}>
                        <StaffsTotalResearchChart
                            selectedDepInfo={selectedDepInfo}
                            data={academicPositionTotalsData?.data}
                            filter="citations"
                        />
                    </Paper>
                </Grid2>
                <Grid2 xs>
                    <SectionTitle titleText="Publications Research" />
                    <Paper sx={cardStyle}>
                        <StaffsTotalResearchChart
                            selectedDepInfo={selectedDepInfo}
                            data={academicPositionTotalsData?.data}
                            filter="publications"
                        />
                    </Paper>
                </Grid2>
            </Grid2>
            <Grid2
                xs
                sx={{
                    width: '100%',
                    justifyContent: 'center',
                }}
            >
                <SectionTitle titleText="Department Research" />
                <ResearchSummaryChart selectedDepInfo={selectedDepInfo} />
            </Grid2>
        </>
    );
};

export default StaffsTotalResearch;
