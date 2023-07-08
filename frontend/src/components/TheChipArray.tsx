import Box from '@mui/material/Box/Box';
import Chip from '@mui/material/Chip/Chip';
import Paper from '@mui/material/Paper/Paper';
import Skeleton from '@mui/material/Skeleton/Skeleton';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RootState } from '../app/store';
import { setYearsRange } from '../app/slices/testSlice';
import { useGetPublicationsYearsQuery } from '../services/publicationApi';
import { useGetAcademicStaffPositionsQuery } from '../services/academicStaffApi';
import { useGetJesusQuery } from '../services/departmentApi';

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
    const [chipData, setChipData] = React.useState<readonly ChipData[]>([
        { key: '0', label: 'Angular' },
        { key: '1', label: 'jQuery' },
        { key: '2', label: 'Polymer' },
        { key: '3', label: 'React' },
        { key: '4', label: 'Vue.js' },
    ]);
    const [searchParams, setSearchParams] = useSearchParams();

    const { isLoading: isYearsDataLoading } = useGetPublicationsYearsQuery();

    const { isLoading: isPositionsDataLoading } =
        useGetAcademicStaffPositionsQuery();

    const { isLoading: isDepartmenentDataFetching } = useGetJesusQuery({
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
                    key: `pos-${pos.position}`,
                    label: pos.position,
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
            searchParams.delete('yearsRange');
            setSearchParams(searchParams);
        } else if (chipToDelete.key.startsWith('pos-')) {
            const newAcademicPositions = testSliceData.academicPos
                .filter((pos) => pos.position !== chipToDelete.label)
                .map((pos) => pos.position)
                .toString();
            console.log(newAcademicPositions);

            if (newAcademicPositions) {
                setSearchParams((prevSearchParams) => {
                    prevSearchParams.set(
                        'academicPositions',
                        newAcademicPositions
                    );
                    return prevSearchParams;
                });
            } else if (searchParams.has('academicPositions')) {
                searchParams.delete('academicPositions');
                setSearchParams(searchParams);
            }
        }
    };

    if (
        isYearsDataLoading &&
        isPositionsDataLoading &&
        isDepartmenentDataFetching
    )
        return (
            <Skeleton
                animation="wave"
                variant="rounded"
                width="100%"
                height={44}
            />
        );

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
            {chipData.map((data) => {
                let icon;

                return (
                    <ListItem key={data.key}>
                        <Chip
                            icon={icon}
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
