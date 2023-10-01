import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { SxProps, Theme, styled, useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { RootState } from '../../app/store';
import { useGetAcademicStaffDataMutation } from '../../services/departmentApi';
import {
    AcademicData,
    CountPerYear,
} from '../../models/api/response/departments/departments.data';

// const columns: GridColDef[] = [
//     { field: 'id', headerName: 'ID', width: 270 },
//     { field: 'firstName', headerName: 'First name', width: 330 },
//     { field: 'lastName', headerName: 'Last name', width: 330 },
//     {
//         field: 'age',
//         headerName: 'Age',
//         type: 'number',
//         width: 190,
//     },
//     {
//         field: 'fullName',
//         headerName: 'Full name',
//         description: 'This column has a value getter and is not sortable.',
//         sortable: false,
//         width: 260,
//         valueGetter: (params: GridValueGetterParams) =>
//             `${params.row.firstName || ''} ${params.row.lastName || ''}`,
//     },
// ];

// const rows = [
//     { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//     { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//     { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//     { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//     { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//     { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//     { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//     { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//     { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

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

const StyledGridOverlay = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& .ant-empty-img-1': {
        fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
    },
    '& .ant-empty-img-2': {
        fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
    },
    '& .ant-empty-img-3': {
        fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
    },
    '& .ant-empty-img-4': {
        fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
    },
    '& .ant-empty-img-5': {
        fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
        fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
    },
}));

function CustomNoRowsOverlay() {
    return (
        <StyledGridOverlay>
            <svg
                width="120"
                height="100"
                viewBox="0 0 184 152"
                aria-hidden
                focusable="false"
            >
                <g fill="none" fillRule="evenodd">
                    <g transform="translate(24 31.67)">
                        <ellipse
                            className="ant-empty-img-5"
                            cx="67.797"
                            cy="106.89"
                            rx="67.797"
                            ry="12.668"
                        />
                        <path
                            className="ant-empty-img-1"
                            d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
                        />
                        <path
                            className="ant-empty-img-2"
                            d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
                        />
                        <path
                            className="ant-empty-img-3"
                            d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
                        />
                    </g>
                    <path
                        className="ant-empty-img-3"
                        d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
                    />
                    <g
                        className="ant-empty-img-4"
                        transform="translate(149.65 15.383)"
                    >
                        <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
                        <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
                    </g>
                </g>
            </svg>
            <Box sx={{ mt: 1 }}>No Rows</Box>
        </StyledGridOverlay>
    );
}

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
            console.log('THA TO KALESW TWRA!!');

            academicStaffDataReq({
                departments: selectedDeps,
                positions: selectedPositions,
                years: selectedYears,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDeps, selectedPositions, selectedYears]);

    useEffect(() => {
        if (academicStaffData?.data) {
            console.log(academicStaffData.data);
        }
    }, [academicStaffData]);

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
                    noRowsOverlay: CustomNoRowsOverlay,
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
