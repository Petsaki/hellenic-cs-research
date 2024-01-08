import Checkbox from '@mui/material/Checkbox/Checkbox';
import FormControl from '@mui/material/FormControl/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import FormGroup from '@mui/material/FormGroup/FormGroup';
import FormLabel from '@mui/material/FormLabel/FormLabel';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField/TextField';
import Box from '@mui/material/Box/Box';
import { useSearchParams } from 'react-router-dom';
import { DepartmentId } from '../../models/api/response/departments/departments.data';
import useUrlParams, { ParamNames } from '../../app/hooks/useUrlParams';
import ClearButton from '../ClearButton';

// TODO - Maybe it will broke when deploy
let departmentTimeout: ReturnType<typeof setTimeout>;

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
    const [searchParams, setSearchParams] = useSearchParams();

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
            if (!checked.some((id) => id === depId)) {
                setChecked([...checked, depId]);
            }
        } else {
            setChecked(checked.filter((id) => id !== depId));
        }
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
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '0.75rem',
                    paddingTop: '0.5rem',
                    paddingBottom: '0.8rem',
                    alignItems: 'flex-end',
                }}
            >
                <FormLabel
                    sx={{ padding: '0', lineHeight: 'normal' }}
                    component="legend"
                >
                    Departments
                </FormLabel>
                <ClearButton
                    sx={{ fontSize: '0.78rem' }}
                    onClick={() =>
                        setSearchParams((prevSearchParams) => {
                            searchParams.delete(ParamNames.Departments);
                            return prevSearchParams;
                        })
                    }
                >
                    clear
                </ClearButton>
            </Box>
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
                    }
                }}
            />
            <Box
                sx={{
                    maxHeight: '350px',
                    minHeight: '350px',
                    overflow: 'auto',
                    display: 'block',
                    mt: '0.5rem',
                }}
            >
                {data && (
                    <FormGroup>
                        {filteredDepsArray.map((dep) => (
                            <FormControlLabel
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    mr: '0',
                                }}
                                labelPlacement="start"
                                key={dep.id}
                                control={
                                    <Checkbox
                                        name={dep.id}
                                        onChange={handleCheckboxChange}
                                        checked={checked.includes(dep.id)}
                                    />
                                }
                                label={
                                    <a
                                        href={dep.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            color: 'inherit',
                                        }}
                                    >
                                        {dep.id}
                                    </a>
                                }
                            />
                        ))}
                    </FormGroup>
                )}
            </Box>
        </FormControl>
    );
};

export default DepartmentCheckboxes;
