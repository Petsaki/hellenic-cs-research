import Box from '@mui/material/Box/Box';
import Chip from '@mui/material/Chip/Chip';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SxProps } from '@mui/material';
import { RootState } from '../app/store';
import { ParamNames } from '../app/hooks/useUrlParams';

import { setYearsFilters } from '../app/slices/filtersSlice';

enum ChipKey {
    YearsRange = 'YearsRange',
    Position = 'Position',
    Department = 'Department',
    UnknownYear = 'UnknownYear',
}

interface ChipData {
    key: string;
    label: string;
}
const ContainerChipStyle: SxProps = {
    display: 'flex',
    justifyContent: 'flex-start',
    listStyle: 'none',
    p: 0.5,
    pt: 0,
    m: 0,
    flexWrap: { xs: 'nowrap', sm: 'wrap' },
    overflowX: 'auto',
};

const chipStyle: SxProps = {
    margin: '0.25rem',
};

const TheChipArray = () => {
    const filtersSliceData = useSelector(
        (state: RootState) => state.filtersSlice
    );
    const [chipData, setChipData] = React.useState<readonly ChipData[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();

    useEffect(() => {
        const chipDataTemp: ChipData[] = [];

        if (
            filtersSliceData.yearsFilters.yearsRange.join(',') !==
            filtersSliceData.maxYearsRange.join(',')
        ) {
            chipDataTemp.push({
                key: ChipKey.YearsRange,
                label: `${filtersSliceData.yearsFilters.yearsRange[0]} - ${filtersSliceData.yearsFilters.yearsRange[1]}`,
            });
        }

        if (filtersSliceData.yearsFilters.unknownYear) {
            chipDataTemp.push({
                key: `${ChipKey.UnknownYear}`,
                label: 'unknown year',
            });
        }

        filtersSliceData.academicPos.forEach((pos) => {
            chipDataTemp.push({
                key: `${ChipKey.Position}-${pos}`,
                label: pos,
            });
        });

        filtersSliceData.departments.forEach((department) => {
            chipDataTemp.push({
                key: `${ChipKey.Department}-${department}`,
                label: department,
            });
        });

        setChipData([...chipDataTemp]);
    }, [filtersSliceData]);

    const handleDelete = (deletedChip: ChipData) => () => {
        if (deletedChip.key.startsWith(ChipKey.YearsRange)) {
            searchParams.delete(ParamNames.YearsRange);
            setSearchParams(searchParams);
        } else if (deletedChip.key.startsWith(ChipKey.UnknownYear)) {
            searchParams.delete(ParamNames.UnknownYear);
            setSearchParams(searchParams);
            dispatch(setYearsFilters({ unknownYear: false }));
        } else if (deletedChip.key.startsWith(ChipKey.Position)) {
            const academicPosURL = searchParams
                .get(ParamNames.AcademicPos)
                ?.split(',');
            if (academicPosURL?.length) {
                const newAcademicPositions = academicPosURL
                    .filter((pos) => pos !== deletedChip.label)
                    .join(',');
                if (newAcademicPositions) {
                    setSearchParams((prevSearchParams) => {
                        prevSearchParams.set(
                            ParamNames.AcademicPos,
                            newAcademicPositions
                        );
                        return prevSearchParams;
                    });
                } else {
                    searchParams.delete(ParamNames.AcademicPos);
                    setSearchParams(searchParams);
                }
            }
        } else if (deletedChip.key.startsWith(ChipKey.Department)) {
            const departmentURL = searchParams
                .get(ParamNames.Departments)
                ?.split(',');
            if (departmentURL?.length) {
                const newDepartments = departmentURL
                    .filter((pos) => pos !== deletedChip.label)
                    .join(',');
                if (newDepartments) {
                    setSearchParams((prevSearchParams) => {
                        prevSearchParams.set(
                            ParamNames.Departments,
                            newDepartments
                        );
                        return prevSearchParams;
                    });
                } else {
                    searchParams.delete(ParamNames.Departments);
                    setSearchParams(searchParams);
                }
            }
        }
    };

    return (
        <Box sx={ContainerChipStyle} component="ul">
            {chipData &&
                chipData.map((data) => {
                    return (
                        <Chip
                            key={data.key}
                            label={data.label}
                            onDelete={handleDelete(data)}
                            sx={chipStyle}
                        />
                    );
                })}
        </Box>
    );
};

export default TheChipArray;
