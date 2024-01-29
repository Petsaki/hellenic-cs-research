import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { RootState } from '../../app/store';
import { useGetDepartmentsDataMutation } from '../../services/departmentApi';
import { IDepartmentData } from '../../models/api/response/departments/departments.data';
import EmptyData from './EmptyData';
import StaffsTotalResearch from '../StaffsTotalResearch';
import SectionTitle from '../SectionTitle';
import ResizableTable from '../ResizableTable';

const tableStyle: SxProps<Theme> = (theme) => ({
    backgroundColor: theme.palette.mode === 'dark' ? 'transparent' : 'white',
    '& .MuiDataGrid-columnHeaders': {
        backgroundColor: theme.palette.mode === 'dark' ? '#272727' : '#55a1e5',
        color: 'white',
    },
    '&.MuiDataGrid-custom': {
        '.dynamic-values--column': {
            backgroundColor:
                theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)',
        },
    },
    '&.loading': {
        '.dynamic-values--column': {
            backgroundColor:
                theme.palette.mode === 'dark'
                    ? 'rgba(255, 255, 255, 0.06)'
                    : 'rgba(0, 0, 0, 0.06)',
        },
    },
    '& .MuiDataGrid-footerContainer .MuiDataGrid-selectedRowCount': {
        visibility: 'hidden',
        width: '0',
        height: '0',
    },
    '& .MuiDataGrid-row.Mui-selected': {
        backgroundColor: 'rgba(85, 161, 229, 0.25)',
    },
});

const columns: GridColDef[] = [
    {
        field: 'id',
        headerName: 'Department',
        width: 150,
        renderCell: (params) => {
            return (
                <a
                    href={`citations?departments=${params.value.toString()}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                        color: 'inherit',
                    }}
                >
                    {params.value.toString()}
                </a>
            );
        },
    },
    {
        field: 'publications',
        headerName: 'Total Publications*',
        width: 150,
        type: 'number',
        cellClassName: 'dynamic-values--column',
        description: 'Total Publications',
    },
    {
        field: 'citations',
        headerName: 'Total Citations*',
        width: 150,
        type: 'number',
        cellClassName: 'dynamic-values--column',
        description: 'Total Citations',
    },
    { field: 'count', headerName: 'Count', width: 150, type: 'number' },
    {
        field: 'average_publication',
        headerName: 'Avg Publication Per Member',
        width: 200,
        type: 'number',
    },
    {
        field: 'average_citation',
        headerName: 'Avg Citation Per Member',
        width: 180,
        type: 'number',
    },
    {
        field: 'averageH',
        headerName: 'Ang H Per Member',
        width: 150,
        type: 'number',
    },
    {
        field: 'cv_publications',
        headerName: 'CV Publications',
        width: 150,
        type: 'number',
    },
    {
        field: 'cv_citations',
        headerName: 'CV Citations',
        width: 150,
        type: 'number',
    },
    {
        field: 'maxPublications',
        headerName: 'Max Publications*',
        width: 150,
        type: 'number',
        cellClassName: 'dynamic-values--column',
        description: 'Max Publications',
    },
    {
        field: 'minPublications',
        headerName: 'Min Publications*',
        width: 150,
        type: 'number',
        cellClassName: 'dynamic-values--column',
        description: 'Min Publications',
    },
    {
        field: 'maxCitations',
        headerName: 'Max Citations*',
        width: 150,
        type: 'number',
        cellClassName: 'dynamic-values--column',
        description: 'Max Citations',
    },
    {
        field: 'minCitations',
        headerName: 'Min Citations*',
        width: 150,
        type: 'number',
        cellClassName: 'dynamic-values--column',
        description: 'Min Citations',
    },
    { field: 'maxH', headerName: 'Max H', width: 150, type: 'number' },
    { field: 'minH', headerName: 'Min H', width: 150, type: 'number' },
];

const DepartmentDataTable = () => {
    const theme = useTheme();
    const [
        departmentsDataReq,
        { data: departmentsData, isLoading: isDepartmentDataLoading },
    ] = useGetDepartmentsDataMutation();

    const [selectedDep, setSelectedDep] = useState<string>();

    const [tableData, setTableData] = useState<IDepartmentData[] | undefined>(
        undefined
    );

    const selectedPositions = useSelector(
        (state: RootState) => state.filtersSlice.academicPos
    );
    const selectedYears = useSelector(
        (state: RootState) => state.filtersSlice.yearsFilters.yearsRange
    );

    const selectedUnknownYear = useSelector(
        (state: RootState) => state.filtersSlice.yearsFilters.unknownYear
    );

    const rows = useMemo(() => {
        if (!tableData) {
            return [];
        }

        if (!(selectedPositions.length && selectedYears.length)) {
            return [];
        }

        const rowData: DepartmentRow[] = [];
        tableData.forEach((departmentData) => {
            rowData.push({
                id: departmentData.inst,
                publications: departmentData.total_publications,
                citations: departmentData.total_citations,
                count: departmentData.staff_count,
                average_publication: departmentData.avg_publications_per_staff,
                average_citation: departmentData.avg_citations_per_staff,
                averageH: departmentData.avg_h_index,
                cv_publications: departmentData.cv_publications,
                cv_citations: departmentData.cv_citations,
                max_publications: departmentData.max_publications_count,
                min_publications: departmentData.min_publications_count,
                max_citations: departmentData.max_citations_count,
                min_citations: departmentData.min_citations_count,
                max_h: departmentData.max_h_index,
                min_h: departmentData.min_h_index,
            });
        });
        return rowData;
    }, [tableData, selectedPositions, selectedYears]);

    useEffect(() => {
        if (!isDepartmentDataLoading && departmentsData?.data?.length) {
            setTableData(departmentsData.data);
            if (
                !departmentsData?.data.some((department) => {
                    return department.inst === selectedDep;
                })
            ) {
                setSelectedDep(undefined);
            }
        } else if (!isDepartmentDataLoading && !departmentsData?.data?.length) {
            setSelectedDep(undefined);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDepartmentDataLoading, departmentsData]);

    const handleRowClick = (params: GridRowParams) => {
        setSelectedDep(params.id as string);
    };

    useEffect(() => {
        if (selectedPositions.length && selectedYears.length) {
            departmentsDataReq({
                positions: selectedPositions,
                years: selectedYears,
                unknown_year: selectedUnknownYear,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPositions, selectedYears, selectedUnknownYear]);

    if (!selectedPositions.length || !selectedYears.length) return null;

    return (
        <>
            <Grid2
                xs
                sx={{
                    width: '100%',
                }}
            >
                <SectionTitle titleText="Departments Statistics" />
                <ResizableTable initialHeight={600}>
                    {(height) => (
                        <Paper
                            sx={{
                                height: `${height}px`,
                                width: '100%',
                            }}
                        >
                            <DataGrid
                                className={
                                    isDepartmentDataLoading
                                        ? 'loading'
                                        : 'MuiDataGrid-custom'
                                }
                                slots={{
                                    loadingOverlay: LinearProgress,
                                    noRowsOverlay: EmptyData,
                                }}
                                sx={tableStyle(theme)}
                                loading={isDepartmentDataLoading}
                                rows={rows}
                                columns={columns}
                                initialState={{
                                    pagination: {
                                        paginationModel: { pageSize: 100 },
                                    },
                                }}
                                pageSizeOptions={[10, 25, 50, 100]}
                                onRowClick={handleRowClick}
                            />
                        </Paper>
                    )}
                </ResizableTable>
            </Grid2>
            <StaffsTotalResearch id={selectedDep} />
        </>
    );
};

export default DepartmentDataTable;

interface DepartmentRow {
    id: string;
    publications: number;
    citations: number;
    count: number;
    average_publication: number;
    average_citation: number;
    averageH: number;
    cv_publications: number;
    cv_citations: number;
    max_publications: number;
    min_publications: number;
    max_citations: number;
    min_citations: number;
    max_h: number;
    min_h: number;
}
