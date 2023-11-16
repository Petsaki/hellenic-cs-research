import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box/Box';
import FormControl from '@mui/material/FormControl/FormControl';
import FormLabel from '@mui/material/FormLabel/FormLabel';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton/ToggleButton';
import EmptyData from './EmptyData';
import {
    AcademicData,
    CountPerYear,
    IAcademicStaffData,
} from '../../models/api/response/departments/departments.data';
import SectionTitle from '../SectionTitle';
import PerYearStats from '../Charts/PerYearStats';
import { PaginationType } from '../CitationsTableGroup';

export enum ResearchFilterBy {
    Citations = 'Citations',
    Publications = 'Publications',
}

// Helper function to get the cell value for each dynamic column
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
}: ResearchActivityTableProp) => {
    const theme = useTheme();
    const [rowCount, setRowCount] = useState<number>(0);

    const [researchFilterby, setresearchFilterby] = useState<ResearchFilterBy>(
        ResearchFilterBy.Citations
    );

    const [perYearData, setPerYearData] = useState<any>();

    const rows = useMemo(() => {
        if (!data) {
            return [];
        }

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
        console.log(data);

        // Map over the years_range array to generate dynamic columns
        return data.years_range
            .map((year) => ({
                field: year.toString(),
                headerName: year.toString(),
                width: 100,
                type: 'number',
            }))
            .reverse();
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
            // Add other columns as needed
            ...yearsColumns, // Include the dynamic columns here
        ];

        return additionalColumns;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [yearsColumns]);

    useEffect(() => {
        if (data?.count) setRowCount(data.count);
    }, [data]);

    const handleRowClick = (params: any) => {
        setPerYearData(params.row);
    };

    const handlePaginationClick = (params: GridPaginationModel) => {
        setPage(params.page);
        setPageSize(params.pageSize);
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

            setPerYearData(academicStaff);
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
                    sxPropstest={{
                        position: { xs: 'relative', lg: 'absolute' },
                        margin: '0',
                        top: { xs: 'auto', lg: '50%' },
                        right: { xs: 'auto', lg: '50%' },
                        transform: { xs: 'none', lg: 'translate(50%, -50%)' },
                    }}
                />
            </Box>
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
                    pageSizeOptions={[25, 50, 75, 100]}
                    disableRowSelectionOnClick
                    onRowClick={handleRowClick}
                    paginationModel={{ page, pageSize }}
                    paginationMode="server"
                    onPaginationModelChange={handlePaginationClick}
                    rowCount={rowCount}
                />
            </Paper>
            <PerYearStats data={perYearData} filterby={researchFilterby} />
        </Box>
    );
};

export default ResearchActivityTable;
