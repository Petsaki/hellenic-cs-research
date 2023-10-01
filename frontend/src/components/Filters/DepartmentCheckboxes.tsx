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

// TODO - Maybe it will broke when deploy
let departmentTimeout: NodeJS.Timeout;

export interface DepartmentCheckboxesProp {
    data: DepartmentId[];
}

const DepartmentCheckboxes: React.FC<DepartmentCheckboxesProp> = ({
    data,
}: DepartmentCheckboxesProp) => {
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
        console.log('depId', depId);
        console.log('checked', checked);

        if (event.target.checked) {
            if (!checked.some((id) => id === depId)) {
                setChecked([...checked, depId]);
            }
        } else {
            setChecked(checked.filter((id) => id !== depId));
        }
        console.log(data);
    };

    useEffect(() => {
        clearTimeout(departmentTimeout);
        departmentTimeout = setTimeout(() => {
            handleInputChange({
                checkboxList: checked,
            });
        }, 500);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checked]);

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
                    mt: '0.5rem',
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

export default DepartmentCheckboxes;
