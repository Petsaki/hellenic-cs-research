import { useSelector } from 'react-redux';
import { createContext, useEffect, useState } from 'react';
import { GridRowSelectionModel } from '@mui/x-data-grid';
import { useGetAcademicStaffDataMutation } from '../services/departmentApi';
import { RootState } from '../app/store';
import AcademicStaffDataTable from './DataTables/AcademicStaffDataTable';
import ResearchActivityTable from './DataTables/ResearchActivityTable';

export interface PaginationType {
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    pageSize: number;
    setPageSize: React.Dispatch<React.SetStateAction<number>>;
    rowSelectionModel: GridRowSelectionModel;
    setRowSelectionModel: React.Dispatch<
        React.SetStateAction<GridRowSelectionModel>
    >;
}

const CitationsTableGroup = () => {
    const [showTable, setShowTable] = useState(true);

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

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(50);
    const [rowSelectionModel, setRowSelectionModel] =
        useState<GridRowSelectionModel>([]);

    const getAcademicStaffData = () => {
        if (selectedDeps.length && selectedYears.length) {
            academicStaffDataReq({
                departments: selectedDeps,
                positions: selectedPositions,
                years: selectedYears,
                page,
                size: pageSize,
            });
            setShowTable(false);
        } else {
            setShowTable(true);
        }
    };

    useEffect(() => {
        if (page) {
            setPage(0);
        } else {
            getAcademicStaffData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDeps, selectedPositions, selectedYears, pageSize]);

    useEffect(() => {
        getAcademicStaffData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    return (
        <>
            <AcademicStaffDataTable
                data={academicStaffData?.data}
                loading={isAcademicStaffDataLoading}
                hidden={showTable}
                page={page}
                setPage={setPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                rowSelectionModel={rowSelectionModel}
                setRowSelectionModel={setRowSelectionModel}
            />

            <ResearchActivityTable
                data={academicStaffData?.data}
                loading={isAcademicStaffDataLoading}
                hidden={showTable}
                page={page}
                setPage={setPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                rowSelectionModel={rowSelectionModel}
                setRowSelectionModel={setRowSelectionModel}
            />
        </>
    );
};

export default CitationsTableGroup;
