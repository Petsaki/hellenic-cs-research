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
    IAcademicStaffData,
} from '../../models/api/response/departments/departments.data';
import EmptyData from './EmptyData';
import SectionTitle from '../SectionTitle';

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
export interface AcademicStaffDataTableProp {
    data: IAcademicStaffData | undefined;
    loading: boolean;
    hidden: boolean;
}

const AcademicStaffDataTable: React.FC<AcademicStaffDataTableProp> = ({
    data,
    loading,
    hidden,
}: AcademicStaffDataTableProp) => {
    const theme = useTheme();

    const rows = useMemo(() => {
        if (!data) {
            return [];
        }

        return data.academic_data.map((item) => {
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

            return rowData;
        });
    }, [data]);

    const columns: GridColDef[] = useMemo(() => {
        // Define your columns based on academicStaffData
        const additionalColumns: GridColDef[] = [
            {
                field: 'id',
                headerName: 'Name',
                width: 200,
                renderCell: (params) => {
                    const academicStaffID = data?.academic_data.find(
                        (staff) => staff.name === params.value
                    )?.id;
                    return (
                        <a
                            href={`https://scholar.google.com/citations?user=${academicStaffID}`}
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
        ];

        return additionalColumns;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const handleRowClick = (params: any) => {
        // Access the data for the clicked row using params.row
        const clickedRowData = params.row;

        // You can perform actions based on the clicked row data here
        console.log('Clicked row data:', clickedRowData);
    };

    if (hidden) return null;
    return (
        <>
            <SectionTitle titleText="Academic Staff Data" />

            <Paper
                sx={{
                    height: '600px',
                    width: '100%',
                    marginBottom: '24px',
                }}
            >
                <DataGrid
                    slots={{
                        loadingOverlay: LinearProgress,
                        noRowsOverlay: EmptyData,
                    }}
                    sx={tableStyle(theme)}
                    loading={loading}
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 100 } },
                    }}
                    pageSizeOptions={[10, 25, 50, 100]}
                    disableRowSelectionOnClick
                    onRowClick={handleRowClick}
                />
            </Paper>
        </>
    );
};

export default AcademicStaffDataTable;
