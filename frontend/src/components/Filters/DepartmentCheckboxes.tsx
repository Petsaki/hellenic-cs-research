import Checkbox from '@mui/material/Checkbox/Checkbox';
import FormControl from '@mui/material/FormControl/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import FormGroup from '@mui/material/FormGroup/FormGroup';
import FormLabel from '@mui/material/FormLabel/FormLabel';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField/TextField';
import Box from '@mui/material/Box/Box';
import { useSearchParams } from 'react-router-dom';
import { Switch, Tooltip } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { DepartmentId } from '../../models/api/response/departments/departments.data';
import useUrlParams, { ParamNames } from '../../app/hooks/useUrlParams';
import ClearButton from '../ClearButton';
import { RootState } from '../../app/store';

import { setShowDepFullName } from '../../app/slices/filtersSlice';

// TODO - Maybe it will break when deployed
let departmentTimeout: ReturnType<typeof setTimeout>;

export interface DepartmentCheckboxesProp {
    data: DepartmentId[];
    isCitations: boolean;
}

const DepartmentCheckboxes: React.FC<DepartmentCheckboxesProp> = ({
    data,
    isCitations,
}: DepartmentCheckboxesProp) => {
    const [paramValue, handleInputChange] = useUrlParams({
        name: ParamNames.Departments,
        data,
    });
    const dispatch = useDispatch();
    const sliceShowFullName = useSelector(
        (state: RootState) => state.filtersSlice.showDepFullName
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [checked, setChecked] = useState<Array<string>>([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [showFullName, setshowFullName] = useState(sliceShowFullName);

    const filteredDepsArray = data
        ? data.filter(
              (dep) =>
                  dep.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  dep.deptname
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                  dep.university
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
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
                    paddingBottom: '0.3rem',
                    alignItems: 'flex-end',
                }}
            >
                <FormLabel
                    sx={{ padding: '0', lineHeight: 'normal' }}
                    component="legend"
                >
                    Departments
                </FormLabel>
                {isCitations && (
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
                )}
            </Box>
            <Tooltip
                title="If true, then the full name of the department will be displayed, otherwise the id"
                enterDelay={800}
                enterNextDelay={300}
            >
                <FormControlLabel
                    sx={{
                        m: '0',
                        paddingBottom: '0.3rem',
                        '& .MuiFormControlLabel-label': {
                            flex: '1',
                        },
                    }}
                    control={<Switch checked={showFullName} />}
                    label="Show full name"
                    labelPlacement="start"
                    onChange={() => {
                        setshowFullName(!showFullName);
                        dispatch(setShowDepFullName(!showFullName));
                    }}
                />
            </Tooltip>
            {isCitations && (
                <>
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
                                            height: showFullName
                                                ? '62px'
                                                : 'auto',
                                            '& .MuiFormControlLabel-label': {
                                                flex: '1',
                                                height: 'inherit',
                                                position: 'relative',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'center',
                                                '& .MuiBox-root': {
                                                    fontSize: showFullName
                                                        ? '0.725rem'
                                                        : 'unset',
                                                },
                                            },
                                            '&:hover': {
                                                '& .MuiFormControlLabel-label':
                                                    {
                                                        '& .MuiBox-root': {
                                                            position:
                                                                'absolute',
                                                            WebkitLineClamp:
                                                                '4',
                                                        },
                                                    },
                                            },
                                        }}
                                        labelPlacement="start"
                                        key={dep.id}
                                        control={
                                            <Checkbox
                                                name={dep.id}
                                                onChange={handleCheckboxChange}
                                                checked={checked.includes(
                                                    dep.id
                                                )}
                                            />
                                        }
                                        label={
                                            <Tooltip
                                                title={
                                                    <>
                                                        {showFullName && (
                                                            <strong>
                                                                {dep.id}
                                                                <br />
                                                            </strong>
                                                        )}
                                                        {dep.deptname},&nbsp;
                                                        <strong>
                                                            {dep.university}
                                                        </strong>
                                                    </>
                                                }
                                                enterDelay={300}
                                                enterNextDelay={150}
                                                disableInteractive
                                                enterTouchDelay={300}
                                            >
                                                <Box
                                                    sx={{
                                                        maxWidth: '150px',
                                                        overflow: 'hidden',
                                                        textOverflow:
                                                            'ellipsis',
                                                        WebkitLineClamp: '2',
                                                        WebkitBoxOrient:
                                                            'vertical',
                                                        display: '-webkit-box',
                                                    }}
                                                >
                                                    <a
                                                        href={dep.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            color: 'inherit',
                                                        }}
                                                    >
                                                        {showFullName
                                                            ? `${dep.deptname.replace(
                                                                  'Τμήμα ',
                                                                  ''
                                                              )}, ${
                                                                  dep.university
                                                              }`
                                                            : dep.id}
                                                    </a>
                                                </Box>
                                            </Tooltip>
                                        }
                                    />
                                ))}
                            </FormGroup>
                        )}
                    </Box>
                </>
            )}
        </FormControl>
    );
};

export default DepartmentCheckboxes;
