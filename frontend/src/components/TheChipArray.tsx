import Box from '@mui/material/Box/Box';
import Chip from '@mui/material/Chip/Chip';
import Paper from '@mui/material/Paper/Paper';
import Skeleton from '@mui/material/Skeleton/Skeleton';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RootState } from '../app/store';
import { useGetAcademicStaffPositionsQuery } from '../services/academicStaffApi';
import { useGetJesusQuery } from '../services/departmentApi';
import { ParamNames } from '../app/hooks/useUrlParams';
import { useGetYearsRangeQuery } from '../services/yearsRangeApi';

interface ChipData {
    key: string;
    label: string;
}

const ListItem = styled('li')(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

const TheChipArray = () => {
    const dispatch = useDispatch();
    const testSliceData = useSelector((state: RootState) => state.testSlice);
    const [chipData, setChipData] = React.useState<readonly ChipData[]>([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const { isLoading: isYearsDataLoading } = useGetYearsRangeQuery();

    const { isLoading: isPositionsDataLoading } =
        useGetAcademicStaffPositionsQuery();

    const { isLoading: isDepartmenentDataLoading } = useGetJesusQuery({
        filter: 'id',
    });

    useEffect(() => {
        console.log('ESPASE!');
        console.log(testSliceData);
        const chipDataTemp: ChipData[] = [];
        if (
            testSliceData.yearsRange.join(',') !==
            testSliceData.maxYearsRange.join(',')
        ) {
            chipDataTemp.push({
                key: '1',
                label: `${testSliceData.yearsRange[0]} - ${testSliceData.yearsRange[1]}`,
            });
        }
        if (testSliceData.academicPos.length) {
            testSliceData.academicPos.forEach((pos) => {
                chipDataTemp.push({
                    key: `pos-${pos}`,
                    label: pos,
                });
            });
        }
        if (testSliceData.departments.length) {
            console.log(testSliceData.departments.length);

            testSliceData.departments.forEach((department) => {
                chipDataTemp.push({
                    key: `dep-${department}`,
                    label: department,
                });
            });
        }
        setChipData([...chipDataTemp]);
    }, [testSliceData]);

    const handleDelete = (chipToDelete: ChipData) => () => {
        setChipData((chips) =>
            chips.filter((chip) => chip.key !== chipToDelete.key)
        );
        if (chipToDelete.key === '1') {
            searchParams.delete(ParamNames.YearsRange);
            setSearchParams(searchParams);
        } else if (chipToDelete.key.startsWith('pos-')) {
            const academicPosURL = searchParams
                .get(ParamNames.AcademicPos)
                ?.split(',');
            console.log(academicPosURL);
            if (academicPosURL?.length) {
                const newAcademicPositions = academicPosURL
                    .filter((pos) => pos !== chipToDelete.label)
                    .join(',');
                console.log(newAcademicPositions);
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
        } else if (chipToDelete.key.startsWith('dep-')) {
            const departmentURL = searchParams
                .get(ParamNames.Departments)
                ?.split(',');
            console.log(departmentURL);
            if (departmentURL?.length) {
                const newDepartments = departmentURL
                    .filter((pos) => pos !== chipToDelete.label)
                    .join(',');
                console.log(newDepartments);
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
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                listStyle: 'none',
                p: 0.5,
                pt: 0,
                m: 0,
                flexWrap: { xs: 'nowrap', sm: 'wrap' },
                overflowX: 'auto',
            }}
            component="ul"
        >
            {/* {isYearsDataLoading &&
                isPositionsDataLoading &&
                isDepartmenentDataLoading && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            listStyle: 'none',
                            p: 0.5,
                            pt: 0,
                            m: 0,
                            flexWrap: { xs: 'nowrap', sm: 'wrap' },
                            overflowX: 'auto',
                        }}
                        component="ul"
                    >
                        {[...Array(5).keys()].map((key) => (
                            <ListItem key={key}>
                                <Skeleton
                                    animation="wave"
                                    variant="rounded"
                                    width={120}
                                    height={28}
                                    sx={{ borderRadius: '9999px' }}
                                />
                            </ListItem>
                        ))}
                    </Box>
                )} */}
            {chipData &&
                chipData.map((data) => {
                    return (
                        <ListItem key={data.key}>
                            <Chip
                                label={data.label}
                                onDelete={handleDelete(data)}
                            />
                        </ListItem>
                    );
                })}
        </Box>
    );
};

export default TheChipArray;
