import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import LinearProgress from '@mui/material/LinearProgress';
import { SxProps, Theme, useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid2 from '@mui/material/Unstable_Grid2/Grid2';
import { Tooltip, useMediaQuery } from '@mui/material';
import { RootState } from '../../app/store';
import { useGetDepartmentsDataMutation } from '../../services/departmentApi';
import { IDepartmentData } from '../../models/api/response/departments/departments.data';
import EmptyData from './EmptyData';
import StaffsTotalResearch from '../StaffsTotalResearch';
import SectionTitle from '../SectionTitle';
import ResizableTable from '../ResizableTable';

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
    '.full-name--column .MuiDataGrid-cellContent': {
        fontSize: '0.675rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        WebkitLineClamp: '3',
        WebkitBoxOrient: 'vertical',
        display: '-webkit-box',
        whiteSpace: 'normal',
    },
});

const columns = (
    isMobile: boolean,
    sliceShowFullName: boolean,
    departmentsData?: IDepartmentData[]
): GridColDef[] => {
    const dynamicWidth = isMobile ? -50 : 0;

    return [
        {
            field: 'inst',
            headerName: 'Department',
            width: 170 + dynamicWidth,
            cellClassName: sliceShowFullName ? 'full-name--column' : '',
            renderCell: (params) => {
                const currentDep = departmentsData?.find((dep) => {
                    if (sliceShowFullName) {
                        return (
                            `${dep?.deptname?.replace('Τμήμα ', '')}, ${
                                dep?.university
                            }` === params.value
                        );
                    }
                    return dep.inst === params.value.toString();
                });

                return (
                    <Tooltip
                        title={
                            <>
                                {sliceShowFullName && (
                                    <strong>
                                        {currentDep?.inst}
                                        <br />
                                    </strong>
                                )}
                                {currentDep?.deptname.replace('Τμήμα ', '')}
                                ,&nbsp;
                                <strong>{currentDep?.university}</strong>
                            </>
                        }
                        disableInteractive
                        enterTouchDelay={50}
                        enterDelay={300}
                        enterNextDelay={150}
                    >
                        <a
                            href={`citations?departments=${currentDep?.inst}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                color: 'inherit',
                            }}
                            className="MuiDataGrid-cellContent"
                        >
                            {sliceShowFullName
                                ? `${currentDep?.deptname.replace(
                                      'Τμήμα ',
                                      ''
                                  )}, ${currentDep?.university}`
                                : currentDep?.inst}
                        </a>
                    </Tooltip>
                );
            },
        },
        {
            field: 'publications',
            headerName: 'Total Publications*',
            width: 150 + dynamicWidth,
            type: 'number',
            cellClassName: 'dynamic-values--column',
            description: 'Total Publications',
        },
        {
            field: 'citations',
            headerName: 'Total Citations*',
            width: 150 + dynamicWidth,
            type: 'number',
            cellClassName: 'dynamic-values--column',
            description: 'Total Citations',
        },
        {
            field: 'count',
            headerName: 'Count',
            width: 100 + dynamicWidth * 0.4,
            type: 'number',
        },
        {
            field: 'average_publication',
            headerName: 'Avg Publication Per Member',
            width: 200 + dynamicWidth,
            type: 'number',
        },
        {
            field: 'average_citation',
            headerName: 'Avg Citation Per Member',
            width: 180 + dynamicWidth,
            type: 'number',
        },
        {
            field: 'averageH',
            headerName: 'Ang H Per Member',
            width: 150 + dynamicWidth,
            type: 'number',
        },
        {
            field: 'cv_publications',
            headerName: 'CV Publications',
            width: 150 + dynamicWidth,
            type: 'number',
        },
        {
            field: 'cv_citations',
            headerName: 'CV Citations',
            width: 150 + dynamicWidth,
            type: 'number',
        },
        {
            field: 'max_publications',
            headerName: 'Max Publications*',
            width: 150 + dynamicWidth,
            type: 'number',
            cellClassName: 'dynamic-values--column',
            description: 'Max Publications',
        },
        {
            field: 'min_publications',
            headerName: 'Min Publications*',
            width: 150 + dynamicWidth,
            type: 'number',
            cellClassName: 'dynamic-values--column',
            description: 'Min Publications',
        },
        {
            field: 'max_citations',
            headerName: 'Max Citations*',
            width: 150 + dynamicWidth,
            type: 'number',
            cellClassName: 'dynamic-values--column',
            description: 'Max Citations',
        },
        {
            field: 'min_citations',
            headerName: 'Min Citations*',
            width: 150 + dynamicWidth,
            type: 'number',
            cellClassName: 'dynamic-values--column',
            description: 'Min Citations',
        },
        {
            field: 'max_h',
            headerName: 'Max H',
            width: 100 + dynamicWidth * 0.4,
            type: 'number',
        },
        {
            field: 'min_h',
            headerName: 'Min H',
            width: 100 + dynamicWidth * 0.4,
            type: 'number',
        },
    ];
};

export interface SelectedDepInfo {
    id: string;
    deptname: string;
    university: string;
}

const DepartmentDataTable = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [
        departmentsDataReq,
        { data: departmentsData, isLoading: isDepartmentDataLoading },
    ] = useGetDepartmentsDataMutation();

    const [selectedDep, setSelectedDep] = useState<SelectedDepInfo>({
        id: '',
        deptname: '',
        university: '',
    });

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

    const sliceShowFullName = useSelector(
        (state: RootState) => state.filtersSlice.showDepFullName
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
                inst: sliceShowFullName
                    ? `${departmentData.deptname.replace('Τμήμα ', '')}, ${
                          departmentData.university
                      }`
                    : departmentData.inst,
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
    }, [tableData, selectedPositions, selectedYears, sliceShowFullName]);

    useEffect(() => {
        if (!isDepartmentDataLoading && departmentsData?.data?.length) {
            setTableData(departmentsData.data);
            if (
                !departmentsData?.data.some((department) => {
                    return department.inst === selectedDep?.id;
                })
            ) {
                setSelectedDep({
                    id: '',
                    deptname: '',
                    university: '',
                });
            }
        } else if (!isDepartmentDataLoading && !departmentsData?.data?.length) {
            setSelectedDep({
                id: '',
                deptname: '',
                university: '',
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDepartmentDataLoading, departmentsData]);

    const handleRowClick = (params: GridRowParams) => {
        const currentDep = departmentsData?.data?.find(
            (dep) => dep.inst === params.id
        );

        setSelectedDep((prevState) => ({
            ...prevState,
            id: currentDep?.inst || '',
            deptname: currentDep?.deptname.replace('Τμήμα ', '') || '',
            university: currentDep?.university || '',
        }));
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
                                columns={columns(
                                    isMobile,
                                    sliceShowFullName,
                                    departmentsData?.data
                                )}
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
            <StaffsTotalResearch selectedDepInfo={selectedDep} />
        </>
    );
};

export default DepartmentDataTable;

interface DepartmentRow {
    id: string;
    inst: string;
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
