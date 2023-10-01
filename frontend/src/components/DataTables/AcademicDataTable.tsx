import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { RootState } from '../../app/store';
import { useGetAcademicStaffDataMutation } from '../../services/departmentApi';
import {
    AcademicData,
    CountPerYear,
} from '../../models/api/response/departments/departments.data';
import EmptyData from './EmptyData';

// Helper function to get the cell value for each dynamic column
const getCellValue = (year: number, rowData: AcademicData) => {
    const publicationCount = rowData.publications?.find(
        (item: CountPerYear) => item.year === year
    )?.count;
    const citationCount = rowData.citations?.find(
        (item: CountPerYear) => item.year === year
    )?.count;

    if (publicationCount) {
        if (citationCount) {
            return `${publicationCount}|${citationCount}`;
        }
        return `${publicationCount}|0`;
    }
    if (citationCount) {
        return `0|${citationCount}`;
    }
    return '-';
};

const tableStyle: SxProps<Theme> = (theme) => ({
    backgroundColor: theme.palette.mode === 'dark' ? 'transparent' : 'white',
    '& .MuiDataGrid-columnHeaders': {
        backgroundColor: theme.palette.mode === 'dark' ? '#272727' : '#55a1e5',
        color: 'white',
    },
});

const AcademicDataTable = () => {
    const theme = useTheme();
    const [
        academicStaffDataReq,
        { data: academicStaffData, isLoading: isAcademicStaffDataLoading },
    ] = useGetAcademicStaffDataMutation();

    const selectedDeps = useSelector(
        (state: RootState) => state.filtersSlice.departments
    );
    const selectedPositions = useSelector(
        (state: RootState) => state.filtersSlice.academicPos
    );
    const selectedYears = useSelector(
        (state: RootState) => state.filtersSlice.yearsRange
    );

    const rows = useMemo(() => {
        if (!academicStaffData || !academicStaffData?.data) {
            return [];
        }

        if (!(selectedDeps.length && selectedYears.length)) {
            return [];
        }

        return academicStaffData.data.academic_data.map((item) => {
            const rowData: any = {
                id: item.name,
                position: item.position,
                inst: item.inst,
                hindex: item.hindex,
                hindex5: item.hindex5,
                citations5: item.citations5,
                publications5: item.publications5,
                citationTotal: item.citationTotal,
                publicationTotal: item.publicationTotal,
                averagePublication: item.averagePublication,
                averageCitation: item.averageCitation,
            };

            if (academicStaffData.data.years_range) {
                academicStaffData.data.years_range.forEach((year) => {
                    rowData[year.toString()] = getCellValue(year, item);
                });
            }

            return rowData;
        });
    }, [academicStaffData, selectedDeps, selectedYears]);

    const yearsColumns: GridColDef[] = useMemo(() => {
        if (!academicStaffData?.data || !academicStaffData?.data.years_range) {
            return [];
        }

        // Map over the years_range array to generate dynamic columns
        return academicStaffData.data.years_range
            .map((year) => ({
                field: year.toString(),
                headerName: year.toString(),
                width: 100,
                sortable: false,
                type: 'number',
            }))
            .reverse();
    }, [academicStaffData]);

    const columns: GridColDef[] = useMemo(() => {
        // Define your columns based on academicStaffData
        const additionalColumns: GridColDef[] = [
            { field: 'id', headerName: 'Name', width: 200 },
            { field: 'position', headerName: 'Position', width: 180 },
            { field: 'inst', headerName: 'Institute', width: 150 },
            {
                field: 'hindex',
                headerName: 'h-index',
                width: 120,
                type: 'number',
            },
            {
                field: 'hindex5',
                headerName: 'h-index5',
                width: 120,
                type: 'number',
            },
            {
                field: 'citations5',
                headerName: 'Citations5',
                width: 180,
                type: 'number',
            },
            {
                field: 'publications5',
                headerName: 'Publications5',
                width: 180,
                type: 'number',
            },
            {
                field: 'citationTotal',
                headerName: 'Total Citation',
                width: 150,
                type: 'number',
            },
            {
                field: 'publicationTotal',
                headerName: 'Total Publication',
                width: 150,
                type: 'number',
            },
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
            // Add other columns as needed
            ...yearsColumns, // Include the dynamic columns here
        ];

        return additionalColumns;
    }, [yearsColumns]);

    useEffect(() => {
        // When the 'data' changes, update 'labelTest' state with the transformed data
        if (selectedDeps.length && selectedYears.length) {
            academicStaffDataReq({
                departments: selectedDeps,
                positions: selectedPositions,
                years: selectedYears,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDeps, selectedPositions, selectedYears]);

    if (!selectedDeps.length || !selectedYears.length) return null;
    return (
        <Paper
            sx={{
                height: '600px',
                width: '100%',
            }}
        >
            <DataGrid
                slots={{
                    loadingOverlay: LinearProgress,
                    noRowsOverlay: EmptyData,
                }}
                sx={tableStyle(theme)}
                loading={isAcademicStaffDataLoading}
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

export default AcademicDataTable;
