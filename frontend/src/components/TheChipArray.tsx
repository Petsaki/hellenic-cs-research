import Box from '@mui/material/Box/Box';
import Chip from '@mui/material/Chip/Chip';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SxProps, Tooltip } from '@mui/material';
import { RootState } from '../app/store';
import { ParamNames } from '../app/hooks/useUrlParams';

import { setYearsFilters } from '../app/slices/filtersSlice';
import { useGetDepartmentsQuery } from '../services/departmentApi';

enum ChipKey {
    YearsRange = 'YearsRange',
    Position = 'Position',
    Department = 'Department',
    UnknownYear = 'UnknownYear',
}

interface DepartmentInfo {
    deptname: string;
    university: string;
}

interface ChipData {
    key: string;
    label: string;
    department?: DepartmentInfo;
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
    overflowY: { xs: 'auto', sm: 'scroll' },
    maxHeight: { xs: 'none', sm: '320px' },
    '.MuiButtonBase-root.MuiChip-root': {
        maxWidth: 'none',
    },
};

const chipStyle: SxProps = {
    margin: '0.25rem',
};

const TheChipArray = () => {
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const [chipData, setChipData] = React.useState<readonly ChipData[]>([]);
    const filtersSliceData = useSelector(
        (state: RootState) => state.filtersSlice
    );

    const { data: departmenentData, isLoading: isDepartmenentDataFetching } =
        useGetDepartmentsQuery({
            filter: ['id', 'url', 'deptname', 'university'],
        });

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
            const depInfo = departmenentData?.data?.find(
                (depData) => depData.id === department
            );
            chipDataTemp.push({
                key: `${ChipKey.Department}-${department}`,
                label: filtersSliceData.showDepFullName
                    ? `${depInfo?.deptname.replace('Τμήμα ', '')}, ${
                          depInfo?.university
                      }`
                    : department,
                ...(depInfo && {
                    department: {
                        deptname: depInfo.deptname.replace('Τμήμα ', ''),
                        university: depInfo.university,
                    },
                }),
            });
        });

        setChipData([...chipDataTemp]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filtersSliceData]);

    const handleDelete = (deletedChip: ChipData) => () => {
        switch (deletedChip.key.split('-')[0]) {
            case ChipKey.YearsRange:
                searchParams.delete(ParamNames.YearsRange);
                setSearchParams(searchParams);
                break;
            case ChipKey.UnknownYear:
                searchParams.delete(ParamNames.UnknownYear);
                setSearchParams(searchParams);
                dispatch(setYearsFilters({ unknownYear: false }));
                break;
            case ChipKey.Position: {
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
                break;
            }
            case ChipKey.Department: {
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
                break;
            }
            default:
                break;
        }
    };

    return (
        <Box sx={ContainerChipStyle} component="ul">
            {chipData &&
                chipData.map((data) => {
                    return data.key
                        .split('-')[0]
                        .startsWith(ChipKey.Department) ? (
                        <Tooltip
                            title={
                                filtersSliceData.showDepFullName ? (
                                    data.key.split('-')[1]
                                ) : (
                                    <>
                                        {data?.department?.deptname},&nbsp;
                                        <strong>
                                            {data?.department?.university}
                                        </strong>
                                    </>
                                )
                            }
                            enterDelay={600}
                            enterNextDelay={150}
                            disableInteractive
                            enterTouchDelay={300}
                            key={data.key}
                            slotProps={{
                                popper: {
                                    modifiers: [
                                        {
                                            name: 'offset',
                                            options: {
                                                offset: [0, -10],
                                            },
                                        },
                                    ],
                                },
                            }}
                        >
                            <Chip
                                label={data.label}
                                onDelete={handleDelete(data)}
                                sx={{
                                    ...chipStyle,
                                    ...{
                                        fontSize:
                                            filtersSliceData.showDepFullName
                                                ? '0.675rem'
                                                : '0.8125rem',
                                    },
                                }}
                                key={data.key}
                            />
                        </Tooltip>
                    ) : (
                        <Chip
                            label={data.label}
                            onDelete={handleDelete(data)}
                            sx={chipStyle}
                            key={data.key}
                        />
                    );
                })}
        </Box>
    );
};

export default TheChipArray;
