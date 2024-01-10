import { useEffect, useMemo, useState } from 'react';
import {
    DataGrid,
    GridColDef,
    GridPaginationModel,
    GridRowParams,
} from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import {
    AcademicData,
    CountPerYear,
    IAcademicStaffData,
} from '../../models/api/response/departments/departments.data';
import EmptyData from './EmptyData';
import SectionTitle from '../SectionTitle';
import { PaginationType } from '../CitationsTableGroup';
import ResizableTable from '../ResizableTable';

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
    '& .MuiDataGrid-footerContainer .MuiDataGrid-selectedRowCount': {
        visibility: 'hidden',
        width: '0',
        height: '0',
    },
    '& .MuiDataGrid-row.Mui-selected': {
        backgroundColor: 'rgba(85, 161, 229, 0.25)',
    },
});
export interface AcademicStaffDataTableProp extends PaginationType {
    data: IAcademicStaffData | undefined;
    loading: boolean;
    hidden: boolean;
}

const AcademicStaffDataTable: React.FC<AcademicStaffDataTableProp> = ({
    data,
    loading,
    hidden,
    page,
    setPage,
    pageSize,
    setPageSize,
    rowSelectionModel,
    setRowSelectionModel,
}: AcademicStaffDataTableProp) => {
    const theme = useTheme();
    const [rowCount, setRowCount] = useState<number>(0);

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
                citation_total: item.citation_total,
                publication_total: item.publication_total,
                average_publication: item.average_publication,
                average_citation: item.average_citation,
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
                field: 'citation_total',
                headerName: 'Total Citation',
                width: 150,
                type: 'number',
            },
            {
                field: 'publication_total',
                headerName: 'Total Publication',
                width: 150,
                type: 'number',
            },
            {
                field: 'average_publication',
                headerName: 'Avg Publication',
                width: 150,
                type: 'number',
            },
            {
                field: 'average_citation',
                headerName: 'Avg Citation',
                width: 150,
                type: 'number',
            },
        ];

        return additionalColumns;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        if (data?.count) setRowCount(data.count);
    }, [data]);

    const handleRowClick = (params: GridRowParams) => {
        setRowSelectionModel([params?.row?.id]);
    };

    const handlePaginationClick = (params: GridPaginationModel) => {
        if (pageSize !== params.pageSize) {
            setPageSize(params.pageSize);
        } else {
            setPage(params.page);
        }
    };

    if (hidden) return null;
    return (
        <>
            <SectionTitle titleText="Academic Staff Data" />
            <ResizableTable initialHeight={600}>
                {(height) => (
                    <Paper
                        sx={{
                            height: `${height}px`,
                            width: '100%',
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
                            pageSizeOptions={[25, 50, 75, 100]}
                            disableRowSelectionOnClick
                            onRowClick={handleRowClick}
                            paginationModel={{ page, pageSize }}
                            paginationMode="server"
                            onPaginationModelChange={handlePaginationClick}
                            rowSelectionModel={rowSelectionModel}
                            rowCount={rowCount}
                        />
                    </Paper>
                )}
            </ResizableTable>
        </>
    );
};

export default AcademicStaffDataTable;
