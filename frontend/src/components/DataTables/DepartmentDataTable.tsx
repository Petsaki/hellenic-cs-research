import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { RootState } from '../../app/store';
import { useGetDepartmentsDataMutation } from '../../services/departmentApi';
import { IDepartmentData } from '../../models/api/response/departments/departments.data';
import EmptyData from './EmptyData';

const tableStyle: SxProps<Theme> = (theme) => ({
    backgroundColor: theme.palette.mode === 'dark' ? 'transparent' : 'white',
    '& .MuiDataGrid-columnHeaders': {
        backgroundColor: theme.palette.mode === 'dark' ? '#272727' : '#55a1e5',
        color: 'white',
    },
});

const columns: GridColDef[] = [
    { field: 'id', headerName: 'Department', width: 150 },
    {
        field: 'publications',
        headerName: 'Publications',
        width: 150,
        type: 'number',
    },
    { field: 'citations', headerName: 'Citations', width: 150, type: 'number' },
    { field: 'count', headerName: 'Count', width: 150, type: 'number' },
    {
        field: 'averagePublication',
        headerName: 'Avg Publication',
        width: 150,
        type: 'number',
    },
    {
        field: 'averageCitation',
        headerName: 'Avg Citation',
        width: 150,
        type: 'number',
    },
    {
        field: 'averageH',
        headerName: 'Ang H',
        width: 150,
        type: 'number',
    },
    {
        field: 'cvPublications',
        headerName: 'CV Publications',
        width: 150,
        type: 'number',
    },
    {
        field: 'cvCitations',
        headerName: 'CV Citations',
        width: 150,
        type: 'number',
    },
    {
        field: 'maxPublications',
        headerName: 'Max Publications',
        width: 150,
        type: 'number',
    },
    {
        field: 'minPublications',
        headerName: 'Min Publications',
        width: 150,
        type: 'number',
    },
    {
        field: 'maxCitations',
        headerName: 'Max Citations',
        width: 150,
        type: 'number',
    },
    {
        field: 'minCitations',
        headerName: 'Min Citations',
        width: 150,
        type: 'number',
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

    const selectedPositions = useSelector(
        (state: RootState) => state.filtersSlice.academicPos
    );
    const selectedYears = useSelector(
        (state: RootState) => state.filtersSlice.yearsRange
    );

    const rows = useMemo(() => {
        if (!departmentsData || !departmentsData?.data) {
            return [];
        }

        if (!(selectedPositions.length && selectedYears.length)) {
            return [];
        }

        const departmentIds: string[] = Object.keys(departmentsData.data);

        const rowData: any = [];
        departmentIds.forEach((departmentIndex) => {
            const departmentID = Object.keys(
                departmentsData.data[departmentIndex]
            )[0];
            const department = (
                departmentsData.data[departmentIndex] as unknown as Record<
                    string,
                    IDepartmentData
                >
            )[departmentID];

            rowData.push({
                id: departmentID,
                publications: department.totalPublications,
                citations: department.totalCitations,
                count: department.staffCount,
                averagePublication: department.avgPublicationsPerStaff,
                averageCitation: department.avgCitationsPerStaff,
                averageH: department.avgHIndex,
                cvPublications: department.cvPublications,
                cvCitations: department.cvCitations,
                maxPublications: department.maxPublicationsCount,
                minPublications: department.minPublicationsCount,
                maxCitations: department.maxCitationsCount,
                minCitations: department.minCitationsCount,
                maxH: department.maxHIndex,
                minH: department.minHIndex,
            });
        });
        return rowData;
    }, [departmentsData, selectedPositions, selectedYears]);

    useEffect(() => {
        // When the 'data' changes, update 'labelTest' state with the transformed data
        if (selectedPositions.length && selectedYears.length) {
            departmentsDataReq({
                positions: selectedPositions,
                years: selectedYears,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPositions, selectedYears]);

    if (!selectedPositions.length || !selectedYears.length) return null;

    return (
        <Paper
            sx={{
                height: '750px',
                width: '100%',
            }}
        >
            <DataGrid
                slots={{
                    loadingOverlay: LinearProgress,
                    noRowsOverlay: EmptyData,
                }}
                sx={tableStyle(theme)}
                loading={isDepartmentDataLoading}
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: { paginationModel: { pageSize: 100 } },
                }}
                pageSizeOptions={[10, 25, 50, 100]}
                disableRowSelectionOnClick
            />
        </Paper>
    );
};

export default DepartmentDataTable;
