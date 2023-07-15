import Checkbox from '@mui/material/Checkbox/Checkbox';
import FormControl from '@mui/material/FormControl/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import FormGroup from '@mui/material/FormGroup/FormGroup';
import FormLabel from '@mui/material/FormLabel/FormLabel';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField/TextField';
import Box from '@mui/material/Box/Box';
import { DepartmentId } from '../../models/api/response/departments/departments.data';
import useUrlParams, { ParamNames } from '../../app/hooks/useUrlParams';

export interface FixAcademicStaffProp {
    data: DepartmentId[];
}

const FixAcademicStaff: React.FC<FixAcademicStaffProp> = ({
    data,
}: FixAcademicStaffProp) => {
    const [paramValue, handleInputChange] = useUrlParams({
        name: ParamNames.Departments,
        data,
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [checked, setChecked] = useState<Array<string>>([]);

    const filteredDepsArray = data
        ? data.filter((dep) =>
              dep.id.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];

    const handleCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const depId = event.target.name;

        if (event.target.checked) {
            setChecked([...checked, depId]);
        } else {
            setChecked(checked.filter((id) => id !== depId));
        }
        console.log(data);

        handleInputChange({
            checkbox: {
                id: depId,
                checked: event.target.checked,
            },
        });
    };

    useEffect(() => {
        console.log('Parameter value Department:', paramValue);
        if (paramValue) {
            setChecked(paramValue.split(','));
        } else {
            setChecked([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramValue]);

    return (
        <FormControl
            sx={{ width: '100%' }}
            component="fieldset"
            variant="standard"
        >
            <FormLabel component="legend">Departments</FormLabel>
            <TextField
                hiddenLabel
                id="filled-hidden-label-small"
                variant="outlined"
                size="small"
                value={searchQuery}
                placeholder="Search for Department"
                onChange={(
                    event: React.ChangeEvent<
                        HTMLTextAreaElement | HTMLInputElement
                    >
                ) => {
                    if (data) {
                        setSearchQuery(event.target.value);
                        console.log(searchQuery);
                        console.log(checked);
                    }
                }}
            />
            <Box
                sx={{
                    maxHeight: '350px',
                    minHeight: '350px',
                    overflow: 'auto',
                    // color: (theme) =>
                    //     theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
                    // border: '1px solid',
                    // borderColor: (theme) =>
                    //     theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
                    // borderRadius: 2,
                    display: 'block',
                }}
            >
                {data && (
                    <FormGroup>
                        {filteredDepsArray.map((depID) => (
                            <FormControlLabel
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mr: '0',
                                }}
                                labelPlacement="start"
                                key={depID.id}
                                control={
                                    <Checkbox
                                        name={depID.id}
                                        onChange={handleCheckboxChange}
                                        checked={checked.includes(depID.id)}
                                    />
                                }
                                label={depID.id}
                            />
                        ))}
                    </FormGroup>
                )}
            </Box>
        </FormControl>
    );
};

export default FixAcademicStaff;
