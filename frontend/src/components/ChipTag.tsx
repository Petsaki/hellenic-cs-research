import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import CancelIcon from '@mui/icons-material/Cancel';
import { useEffect, useMemo, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useGetAcademicStaffPositionsQuery } from '../services/academicStaffApi';
import { PublicationsYear } from '../models/api/response/publications/publications.data';
import { AcademicStaffPosition } from '../models/api/response/academicStaff/academicStaff.data';
import { setAcademicPos } from '../app/slices/testSlice';
import { RootState } from '../app/store';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function getStyles(name: string, positions: readonly string[], theme: Theme) {
    return {
        fontWeight:
            positions.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

export interface ChipTagProp {
    data: AcademicStaffPosition[];
}

const ChipTag: React.FC<ChipTagProp> = ({ data }: ChipTagProp) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const positionsData = useSelector(
        (state: RootState) => state.testSlice.academicPos
    );
    const [position, setPosition] = useState<AcademicStaffPosition[]>([]);
    // const { data, isFetching, isError } = useGetAcademicStaffPositionsQuery();

    // if (isFetching || !data?.data) return <>Loading...</>;

    const [searchParams, setSearchParams] = useSearchParams();

    const academicPositions = searchParams.get('academicPositions');

    useEffect(() => {
        console.log(positionsData);
        setPosition(positionsData);
    }, [positionsData]);

    const handleChange = (
        event: React.SyntheticEvent,
        value: AcademicStaffPosition[]
    ) => {
        console.log(value);
        console.log(value.map((academicPos) => academicPos.position));

        setPosition(value);
        if (value.length) {
            setSearchParams((prevSearchParams) => {
                prevSearchParams.set(
                    'academicPositions',
                    value.map((academicPos) => academicPos.position).toString()
                );
                return prevSearchParams;
            });
        } else if (searchParams.has('academicPositions')) {
            searchParams.delete('academicPositions');
            setSearchParams(searchParams);
        }
        // dispatch(setAcademicPos(value));
    };

    return (
        <div>
            <FormControl sx={{ m: 1, width: 240 }}>
                <Autocomplete
                    disableCloseOnSelect
                    multiple
                    onChange={handleChange}
                    id="tags-outlined"
                    options={data}
                    isOptionEqualToValue={(option, value) =>
                        option.position === value.position
                    }
                    getOptionLabel={(option) => option.position}
                    filterSelectedOptions
                    value={position}
                    renderInput={({ inputProps, ...params }) => (
                        <TextField
                            {...params}
                            inputProps={{ ...inputProps, readOnly: true }}
                            label="Select Acedemic Position"
                        />
                    )}
                />
            </FormControl>
        </div>
    );
};

export default ChipTag;
