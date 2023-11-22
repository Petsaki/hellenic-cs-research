import Checkbox from '@mui/material/Checkbox/Checkbox';
import FormControl from '@mui/material/FormControl/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import FormGroup from '@mui/material/FormGroup/FormGroup';
import FormLabel from '@mui/material/FormLabel/FormLabel';
import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box/Box';
import { AcademicStaffPosition } from '../../models/api/response/academicStaff/academicStaff.data';
import useUrlParams, { ParamNames } from '../../app/hooks/useUrlParams';

// TODO - Maybe it will broke when deploy
let academicPosTimeout: ReturnType<typeof setTimeout>;

export interface PositionCheckboxesProp {
    data: string[];
}

const PositionCheckboxes: React.FC<PositionCheckboxesProp> = ({
    data,
}: PositionCheckboxesProp) => {
    const [paramValue, handleInputChange] = useUrlParams({
        name: ParamNames.AcademicPos,
        data,
    });
    const [checked, setChecked] = useState<Array<string>>([]);

    const handleCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const academicPosID = event.target.name;
        console.log(academicPosID);

        console.log(event.target.checked);

        if (event.target.checked) {
            setChecked([...checked, academicPosID]);
        } else {
            setChecked(checked.filter((id) => id !== academicPosID));
        }
    };

    useEffect(() => {
        clearTimeout(academicPosTimeout);
        academicPosTimeout = setTimeout(() => {
            handleInputChange({
                checkboxList: checked,
            });
        }, 500);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checked]);

    useEffect(() => {
        console.log('Parameter value Academic Pos:', paramValue);
        if (paramValue) {
            setChecked(paramValue.split(','));
        } else {
            setChecked([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramValue]);

    return (
        <Box
            sx={{
                // color: (theme) =>
                //     theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
                // border: '1px solid',
                // borderColor: (theme) =>
                //     theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
                // borderRadius: 2,
                display: 'block',
            }}
        >
            <FormControl
                sx={{ width: `calc(100% - 8px)` }}
                component="fieldset"
                variant="standard"
            >
                <FormLabel component="legend">Academic Positions</FormLabel>
                {data && (
                    <FormGroup>
                        {data.map((depID) => (
                            <FormControlLabel
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mr: '0',
                                }}
                                labelPlacement="start"
                                key={depID}
                                control={
                                    <Checkbox
                                        name={depID}
                                        onChange={handleCheckboxChange}
                                        checked={checked.includes(depID)}
                                    />
                                }
                                label={depID}
                            />
                        ))}
                    </FormGroup>
                )}
            </FormControl>
        </Box>
    );
};

export default PositionCheckboxes;
