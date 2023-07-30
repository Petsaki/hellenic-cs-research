import {
    Slider,
    Typography,
    Box,
    Drawer,
    Button,
    TextField,
    FormGroup,
    FormHelperText,
    FormLabel,
    FormControl,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { reset, setYearsRange } from '../../app/slices/testSlice';
import store, { RootState } from '../../app/store';
import { DepartmentsData } from '../../models/api/response/departments/departments.data';
import { PublicationsYear } from '../../models/api/response/publications/publications.data';
import {
    useGetDeparmentMutation,
    useGetJesusQuery,
} from '../../services/departmentApi';
import ChipTag from '../ChipTag';
import { useGetYearsRangeQuery } from '../../services/yearsRangeApi';

function valuetext(value: number) {
    return `${value}°C`;
}

export const testRange = (years: PublicationsYear[] | undefined): any => {
    console.log(years);
    const marks: any = [];
    years?.map((year, index) => {
        if (index === 0 || years.length - 1 === index) {
            return marks.push({ value: year.year, label: year.year });
        }
        return marks.push({ value: year.year });
    });
    console.log(marks);

    return marks;
};

// const marks = [
//     {
//         value: 0,
//         label: '0°C',
//     },
//     {
//         value: 20,
//     },
//     {
//         value: 37,
//     },
//     {
//         value: 100,
//         label: '100°C',
//     },
// ];

export interface FiltersProp {
    drawerStatus: boolean;
}
let testTimeout: any;

const Filters: React.FC<FiltersProp> = ({ drawerStatus }: FiltersProp) => {
    const theme = useTheme();
    const large = useMediaQuery(theme.breakpoints.up('md'));
    const [value, setValue] = useState<number[]>([0, 100]);
    const [filteredDeps, setFilteredDeps] = useState<DepartmentsData[]>([]);
    const { data, isFetching, isError } = useGetYearsRangeQuery();
    // const [
    //     filter,
    //     { data: departmenentData, isLoading: isDepartmenentFetching },
    // ] = useGetDeparmentMutation({
    //     fixedCacheKey: 'shared-update-post',
    // });

    const { data: departmenentData, isLoading: isDepartmenentFetching } =
        useGetJesusQuery({
            filter: 'id',
        });

    const dispatch = useDispatch();
    // TODO: Fix the problem with drawer that starts opens
    const [mobileOpen, setMobileOpen] = useState(drawerStatus);

    if (large) {
        console.log('omg is sooo big uwu');
        if (mobileOpen) {
            setMobileOpen(false);
        }
    } else {
        console.log('haha small pp');
    }

    const filterStore = useSelector(
        (state: RootState) => state.testSlice.yearsRange
    );

    const testData = useMemo((): any => {
        return testRange(data?.data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data?.data]);

    useEffect(() => {
        console.log(
            'XXXXXXXXXXMMMMMMMMMMM TI KANEIS RE REACT POULAKI MOU POUPOULA'
        );
        if (data?.data) {
            console.log('exw data kai prepei na treksw');
            console.log(data?.data);
            setValue([
                data.data[0].year,
                data.data[data.data.length - 1].year,
            ] as number[]);

            dispatch(
                setYearsRange([
                    data.data[0].year,
                    data.data[data.data.length - 1].year,
                ])
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data?.data]);

    const handleChange = (event: Event, newValue: number | number[]) => {
        // console.log(newValue);
        setValue(newValue as number[]);
        clearTimeout(testTimeout);
        testTimeout = setTimeout(function () {
            console.log('hello world!');

            dispatch(setYearsRange(newValue as number[]));
        }, 450);
    };

    useEffect(() => {
        console.log('WHAT ARE YOU WAITING FOR?!?!?!');
        setMobileOpen((currentDrawerStatus) => !currentDrawerStatus);
    }, [drawerStatus]);

    useEffect(() => {
        console.log(mobileOpen);
    }, [mobileOpen]);

    // useEffect(() => {
    //     filter({ filter: 'id' });
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    useEffect(() => {
        if (departmenentData?.data) {
            setFilteredDeps(departmenentData?.data);
        }
    }, [departmenentData?.data]);

    const drawer = (
        <>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '12px',
                    mb: 4,
                }}
            >
                <Typography
                    variant="h5"
                    noWrap
                    component="div"
                    sx={{
                        fontWeight: 'light',
                    }}
                >
                    Filters
                </Typography>
                <Button
                    disableElevation
                    disableRipple
                    variant="text"
                    sx={{
                        color: 'blue',
                        fontSize: '12px',
                        p: 0,
                        '&.MuiButtonBase-root:hover': {
                            bgcolor: 'transparent',
                            textDecoration: 'underline',
                            filter: 'brightness(85%)',
                        },
                    }}
                    onClick={() => {
                        if (data?.data) {
                            setValue([
                                data.data[0].year,
                                data.data[data.data.length - 1].year,
                            ]);
                            dispatch(
                                reset([
                                    data.data[0].year,
                                    data.data[data.data.length - 1].year,
                                ])
                            );
                        }
                    }}
                >
                    Clear
                </Button>
            </Box>
            {data && (
                <Box sx={{ width: 240 }}>
                    <Slider
                        getAriaLabel={() => 'Years range'}
                        value={value}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        marks={testData}
                        step={null}
                        min={data.data[0].year}
                        max={data.data[data.data.length - 1].year}
                    />
                </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                    variant="body2"
                    noWrap
                    component="div"
                    sx={{
                        fontWeight: 'light',
                        mb: 4,
                        bgcolor: 'blue',
                        border: 1,
                        p: 1.5,
                        borderRadius: 1,
                    }}
                >
                    {value[0]}
                </Typography>
                <Typography
                    variant="body2"
                    noWrap
                    component="div"
                    sx={{
                        fontWeight: 'light',
                        mb: 4,
                        bgcolor: 'blue',
                        border: 1,
                        p: 1.5,
                        borderRadius: 1,
                    }}
                >
                    {value[1]}
                </Typography>
            </Box>
            <ChipTag />

            <TextField
                hiddenLabel
                id="filled-hidden-label-small"
                variant="outlined"
                size="small"
                placeholder="Search for Department"
                onChange={(
                    event: React.ChangeEvent<
                        HTMLTextAreaElement | HTMLInputElement
                    >
                ) => {
                    if (departmenentData?.data) {
                        const tempFilteredDeps = departmenentData?.data.filter(
                            (depID) => {
                                return depID.id.includes(event.target.value);
                            }
                        );
                        console.log(event.target.value);
                        console.log(tempFilteredDeps);
                        setFilteredDeps(tempFilteredDeps);
                    }
                }}
            />
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
                    <FormLabel component="legend">Departments</FormLabel>
                    <FormGroup>
                        {filteredDeps.map((depID) => (
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
                                        onChange={(
                                            event: React.ChangeEvent<HTMLInputElement>
                                        ) => {
                                            console.log(event.target.checked);

                                            console.log(depID.id);
                                        }}
                                    />
                                }
                                label={depID.id}
                            />
                            // <p key={depID.id}>{depID.id}</p>
                        ))}
                    </FormGroup>
                </FormControl>
            </Box>
        </>
    );

    return (
        <>
            <Box
                sx={{
                    display: { xs: 'none', md: 'block' },
                }}
            >
                {drawer}
            </Box>
            <Drawer
                // container={container}
                variant="temporary"
                open={mobileOpen}
                onClose={() =>
                    setMobileOpen((currentMobileOpen) => !currentMobileOpen)
                }
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: 290,
                        display: 'block',
                    },
                }}
            >
                {drawer}
            </Drawer>
        </>
    );
};

export default Filters;
