import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { RootState } from '../app/store';
import { useGetAcademicStaffDataMutation } from '../services/departmentApi';

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
const getCellValue = (year: number, rowData: any) => {
    const publicationCount =
        rowData.publications?.find((item: any) => item.year === year)?.count ||
        '-';
    const citationCount =
        rowData.citations?.find((item: any) => item.year === year)?.count ||
        '-';

    return `${publicationCount}/${citationCount}`;
};

const AcademicDataTable = () => {
    const [
        academicStaffDataReq,
        { data: academicStaffData, isLoading: isAcademicStaffDataLoading },
    ] = useGetAcademicStaffDataMutation();

    const selectedDeps = useSelector(
        (state: RootState) => state.testSlice.departments
    );
    const selectedPositions = useSelector(
        (state: RootState) => state.testSlice.academicPos
    );
    const selectedYears = useSelector(
        (state: RootState) => state.testSlice.yearsRange
    );

    const rows = useMemo(() => {
        if (!academicStaffData || !academicStaffData.data) {
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
            };

            if (academicStaffData.data.years_range) {
                academicStaffData.data.years_range.forEach((year) => {
                    rowData[year.toString()] = getCellValue(year, item);
                });
            }

            return rowData;
        });
    }, [academicStaffData]);

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
            }))
            .reverse();
    }, [academicStaffData]);

    const columns: GridColDef[] = useMemo(() => {
        // Define your columns based on academicStaffData
        const additionalColumns: GridColDef[] = [
            { field: 'id', headerName: 'Name', width: 200 },
            { field: 'position', headerName: 'Position', width: 150 },
            { field: 'inst', headerName: 'Institute', width: 200 },
            { field: 'hindex', headerName: 'h-index', width: 120 },
            { field: 'hindex5', headerName: 'h-index5', width: 120 },
            {
                field: 'citations5',
                headerName: 'Citations5',
                width: 180,
            },
            {
                field: 'publications5',
                headerName: 'Publications5',
                width: 200,
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

    return (
        <div style={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10000}
                hideFooter
            />
        </div>
    );
};

export default AcademicDataTable;
