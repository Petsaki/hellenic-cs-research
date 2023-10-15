import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useGetAcademicStaffDataMutation } from '../services/departmentApi';
import { RootState } from '../app/store';
import AcademicStaffDataTable from './DataTables/AcademicStaffDataTable';
import ResearchActivityTable from './DataTables/ResearchActivityTable';

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

    useEffect(() => {
        // When the 'data' changes, update 'labelTest' state with the transformed data
        if (selectedDeps.length && selectedYears.length) {
            academicStaffDataReq({
                departments: selectedDeps,
                positions: selectedPositions,
                years: selectedYears,
            });
            setShowTable(false);
        } else {
            setShowTable(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDeps, selectedPositions, selectedYears]);

    return (
        <>
            <AcademicStaffDataTable
                data={academicStaffData?.data}
                loading={isAcademicStaffDataLoading}
                hidden={showTable}
            />

            <ResearchActivityTable
                data={academicStaffData?.data}
                loading={isAcademicStaffDataLoading}
                hidden={showTable}
            />
        </>
    );
};

export default CitationsTableGroup;
