import Checkbox from '@mui/material/Checkbox/Checkbox';
import FormControl from '@mui/material/FormControl/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel/FormControlLabel';
import FormGroup from '@mui/material/FormGroup/FormGroup';
import FormLabel from '@mui/material/FormLabel/FormLabel';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField/TextField';
import Box from '@mui/material/Box/Box';
import { useGetJesusQuery } from '../../services/departmentApi';
import { addDepartment, deleteDepartment } from '../../app/slices/testSlice';
import { RootState } from '../../app/store';
import { DepartmentsData } from '../../models/api/response/departments/departments.data';
import { AcademicStaffPosition } from '../../models/api/response/academicStaff/academicStaff.data';

export interface FixCheckBoxProp {
    resetFilters: boolean;
    data: AcademicStaffPosition[];
}

const NewAcademicStaff: React.FC<FixCheckBoxProp> = ({
    resetFilters,
    data,
}: FixCheckBoxProp) => {
    const dispatch = useDispatch();
    // const { data: departmenentData, isLoading: isDepartmenentFetching } =
    //     useGetJesusQuery({
    //         filter: 'id',
    //     });
    const departmentsDataTestSlice = useSelector(
        (state: RootState) => state.testSlice.departments
    );
    const positionsData = useSelector(
        (state: RootState) => state.testSlice.academicPos
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [checked, setChecked] = useState<Array<string>>([]);
    const firstRenderRef = useRef(true);

    const filteredDepsArray = data
        ? data.filter((position) =>
              position.position
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
          )
        : [];

    const handleCheckboxChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const depId = event.target.name;

        if (event.target.checked) {
            console.log(checked.length);

            if (checked.length) {
                setChecked([...checked, depId]);
                dispatch(addDepartment({ deps: depId }));
            } else {
                setChecked([...checked, depId]);
                dispatch(addDepartment({ deps: depId, removeDeps: true }));
            }
        } else {
            console.log(checked.length);
            if (checked.length !== 1) {
                setChecked(checked.filter((id) => id !== depId));
                dispatch(deleteDepartment(depId));
            } else {
                setChecked([]);
                if (data) {
                    console.log(data);
                    const depsId: string[] = data.map((dep) => dep.position);
                    dispatch(addDepartment({ deps: depsId }));
                }
            }
        }
    };

    useEffect(() => {
        if (departmentsDataTestSlice.length) {
            setChecked(departmentsDataTestSlice);
        }
        console.log('EFAGA RESET GAMW ALLA DES TI EXW APO TO STORE');
        console.log(checked);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return;
        }
        console.log('poses fores mphka edw?');
        if (data) {
            console.log(data);
            const depsId: string[] = data.map((dep) => dep.position);
            dispatch(addDepartment({ deps: depsId }));
        }
        setChecked([]);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetFilters]);

    // useEffect(() => {
    //     console.log('THE CURRENT VALUE OF CHECKED IS: ', checked);
    //     if (!checked.length) dispatch(addDepartment({ deps: depId }));
    // }, [checked]);

    return (
        <Box
            sx={{
                maxHeight: '350px',
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
            <FormControl
                sx={{ width: '100%' }}
                component="fieldset"
                variant="standard"
            >
                <FormLabel component="legend">Academic Positions</FormLabel>
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
                                key={depID.position}
                                control={
                                    <Checkbox
                                        name={depID.position}
                                        onChange={handleCheckboxChange}
                                        checked={checked.includes(
                                            depID.position
                                        )}
                                    />
                                }
                                label={depID.position}
                            />
                            // <p key={depID.position}>{depID.position}</p>
                        ))}
                    </FormGroup>
                )}
            </FormControl>
        </Box>
    );
};

export default NewAcademicStaff;
