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
import Box from '@mui/material/Box/Box';
import FormControl from '@mui/material/FormControl/FormControl';
import FormLabel from '@mui/material/FormLabel/FormLabel';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton/ToggleButton';
import { useMediaQuery } from '@mui/material';
import EmptyData from './EmptyData';
import {
    AcademicData,
    CountPerYear,
    IAcademicStaffData,
} from '../../models/api/response/departments/departments.data';
import SectionTitle from '../SectionTitle';
import PerYearStats from '../Charts/PerYearStats';
import { PaginationType } from '../CitationsTableGroup';
import ResizableTable from '../ResizableTable';

export enum ResearchFilterBy {
    Citations = 'Citations',
    Publications = 'Publications',
}

const getCellValue = (
    year: number,
    rowData: AcademicData,
    filter: ResearchFilterBy
) => {
    const publicationCount = rowData.publications?.find(
        (item: CountPerYear) => item.year === year
    )?.count;
    const citationCount = rowData.citations?.find(
        (item: CountPerYear) => item.year === year
    )?.count;

    if (filter === ResearchFilterBy.Citations) return `${citationCount ?? 0}`;

    if (filter === ResearchFilterBy.Publications)
        return `${publicationCount ?? 0}`;

    if (publicationCount) {
        if (citationCount) {
            return `${publicationCount} / ${citationCount}`;
        }
        return `${publicationCount} / 0`;
    }
    if (citationCount) {
        return `0 / ${citationCount}`;
    }
    return '0 / 0';
};

const tableStyle: SxProps<Theme> = (theme) => ({
    fontSize: { xs: '.75rem', md: 'inherit' },
    backgroundColor: theme.palette.mode === 'dark' ? 'transparent' : 'white',
    '& .MuiDataGrid-columnHeaders': {
        backgroundColor: theme.palette.mode === 'dark' ? '#272727' : '#55a1e5',
        fontSize: { xs: '.75rem', md: 'inherit' },
        color: 'white',
        '& .MuiDataGrid-columnHeaderTitleContainer .MuiDataGrid-iconButtonContainer':
            {
                display: { xs: 'none', md: 'flex' },
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

export interface ResearchActivityTableProp extends PaginationType {
    data: IAcademicStaffData | undefined;
    loading: boolean;
    hidden: boolean;
}

const ResearchActivityTable: React.FC<ResearchActivityTableProp> = ({
    data,
    loading,
    hidden,
    page,
    setPage,
    pageSize,
    setPageSize,
    rowSelectionModel,
    setRowSelectionModel,
}: ResearchActivityTableProp) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [rowCount, setRowCount] = useState<number>(0);

    const [researchFilterby, setresearchFilterby] = useState<ResearchFilterBy>(
        ResearchFilterBy.Citations
    );

    const [perYearData, setPerYearData] = useState<any>();

    const rows = useMemo(() => {
        if (!data) return [];

        return data.academic_data.map((item) => {
            const rowData: any = {
                id: item.name,
            };

            if (data.years_range) {
                data.years_range.forEach((year) => {
                    rowData[year.toString()] = getCellValue(
                        year,
                        item,
                        researchFilterby
                    );
                });
            }

            return rowData;
        });
    }, [data, researchFilterby]);

    const yearsColumns: GridColDef[] = useMemo(() => {
        if (!data || !data.years_range) {
            return [];
        }
        const dynamicWidth = isMobile ? -30 : 0;

        // Map over the years_range array to generate dynamic columns
        return data.years_range
            .map((year) => ({
                field: year.toString(),
                headerName: year.toString(),
                width: 100 + dynamicWidth,
                type: 'number',
            }))
            .reverse();
    }, [data, isMobile]);

    const columns: GridColDef[] = useMemo(() => {
        const dynamicWidth = isMobile ? -50 : 0;
        const additionalColumns: GridColDef[] = [
            {
                field: 'id',
                headerName: 'Name',
                width: 200 + dynamicWidth,
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
            ...yearsColumns,
        ];

        return additionalColumns;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [yearsColumns]);

    useEffect(() => {
        if (!data?.count && !loading) setRowSelectionModel([]);
        if (data?.count) setRowCount(data.count);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        const academicStaff = (rows as Array<any>).find(
            (staff) => staff?.id === rowSelectionModel[0]
        );
        setPerYearData(academicStaff);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowSelectionModel]);

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

    const filterResearchBy = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: ResearchFilterBy
    ) => {
        setresearchFilterby(newAlignment);
    };

    useEffect(() => {
        if (rows?.length && perYearData) {
            const academicStaff = (rows as Array<any>).find(
                (staff) => staff?.id === perYearData?.id
            );

            setRowSelectionModel(academicStaff ? [academicStaff?.id] : []);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows]);

    if (hidden) return null;

    return (
        <Box>
            <Box
                sx={{
                    position: 'relative',
                    marginBottom: '12px',
                    display: { xs: 'flex', lg: 'block' },
                    flexDirection: { xs: 'column-reverse', lg: 'unset' },
                }}
            >
                <FormControl
                    sx={{
                        width: 'fit-content',
                        display: 'flex',
                        gap: '22px',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                    component="fieldset"
                    variant="standard"
                >
                    <FormLabel component="legend">Filter Per Year:</FormLabel>

                    <ToggleButtonGroup
                        value={researchFilterby}
                        exclusive
                        onChange={filterResearchBy}
                        aria-label="Research filter toggle"
                    >
                        <ToggleButton value={ResearchFilterBy.Citations}>
                            Citations
                        </ToggleButton>
                        <ToggleButton value={ResearchFilterBy.Publications}>
                            Publications
                        </ToggleButton>
                    </ToggleButtonGroup>
                </FormControl>
                <SectionTitle
                    titleText="Research Activity"
                    sxPropsCustom={{
                        position: { xs: 'relative', lg: 'absolute' },
                        margin: '0',
                        top: { xs: 'auto', lg: '50%' },
                        right: { xs: 'auto', lg: '50%' },
                        transform: { xs: 'none', lg: 'translate(50%, -50%)' },
                    }}
                />
            </Box>
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
            <PerYearStats data={perYearData} filterby={researchFilterby} />
        </Box>
    );
};

export default ResearchActivityTable;
