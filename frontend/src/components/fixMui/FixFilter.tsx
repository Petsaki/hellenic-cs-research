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
    useMediaQuery,
    useTheme,
    Skeleton,
    Radio,
    RadioGroup,
} from '@mui/material';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    addDepartment,
    deleteDepartment,
    reset,
    setYearsRange,
} from '../../app/slices/testSlice';
import { RootState } from '../../app/store';
import { DepartmentsData } from '../../models/api/response/departments/departments.data';
import { PublicationsYear } from '../../models/api/response/publications/publications.data';
import {
    useGetDeparmentMutation,
    useGetJesusQuery,
} from '../../services/departmentApi';
import { useGetPublicationsYearsQuery } from '../../services/publicationApi';
import ChipTag from '../ChipTag';
import FixCheckBox from './FixCheckBox';
import FixSlide from './FixSlide';
import { useGetAcademicStaffPositionsQuery } from '../../services/academicStaffApi';
import FixAcademicStaff from './FixAcademicStaff';
import { CompareByType } from '../../models/api/model';
import NewAcademicStaff from './NewAcademicStaff';

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

const FixFilters: React.FC<FiltersProp> = ({ drawerStatus }: FiltersProp) => {
    const theme = useTheme();
    const large = useMediaQuery(theme.breakpoints.up('md'));
    const dispatch = useDispatch();
    // const { data: departmenentData, isLoading: isDepartmenentFetching } =
    //     useGetJesusQuery({
    //         filter: 'id',
    //     });
    const [resetFilters, setResetFilters] = useState<boolean>(false);
    const [value, setValue] = useState<number[]>([0, 100]);
    const [filteredDeps, setFilteredDeps] = useState<DepartmentsData[]>([]);
    const {
        data: yearsData,
        isLoading: isYearsDataLoading,
        isError: isYearsDataError,
    } = useGetPublicationsYearsQuery();

    const {
        data: positionsData,
        isLoading: isPositionsDataLoading,
        isError: isPositionsDataError,
    } = useGetAcademicStaffPositionsQuery();

    const {
        data: departmenentData,
        isLoading: isDepartmenentDataFetching,
        isError: isDepartmenentDataError,
    } = useGetJesusQuery({
        filter: 'id',
    });

    // COMPARE BY CODE ---------------------------------------------------------
    const [compareBy, setCompareBy] = useState<CompareByType>('department');

    const handleCompareByRadioGroup = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setCompareBy(event.target.value as CompareByType);
    };

    useEffect(() => {
        console.log(compareBy);
    }, [compareBy]);

    // COMPARE BY CODE ---------------------------------------------------------

    const firstRenderRef = useRef(true);

    // const [searchQuery, setSearchQuery] = useState('');
    // const [checked, setChecked] = useState<Array<string>>([]);

    // const filteredDepsArray = departmenentData?.data
    //     ? departmenentData?.data.filter((dep) =>
    //           dep.id.toLowerCase().includes(searchQuery.toLowerCase())
    //       )
    //     : [];

    // const handleCheckboxChange = (
    //     event: React.ChangeEvent<HTMLInputElement>
    // ) => {
    //     const depId = event.target.name;

    //     if (event.target.checked) {
    //         setChecked([...checked, depId]);
    //         dispatch(addDepartment(depId));
    //     } else {
    //         setChecked(checked.filter((id) => id !== depId));
    //         dispatch(deleteDepartment(depId));
    //     }
    // };

    // TODO: Fix the problem with drawer that starts opens
    const [mobileOpen, setMobileOpen] = useState(drawerStatus);
    // if (large) {
    //     console.log('omg is sooo big uwu');
    //     if (mobileOpen) {
    //         // setMobileOpen(false);
    //     }
    // } else {
    //     console.log('haha small pp');
    // }
    // const filterStore = useSelector(
    //     (state: RootState) => state.testSlice.yearsRange
    // );
    useEffect(() => {
        if (large) setMobileOpen(false);
        console.log(mobileOpen);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [large]);

    useEffect(() => {
        console.log(resetFilters);
    }, [resetFilters]);

    useEffect(() => {
        console.log('WHAT ARE YOU WAITING FOR?!?!?!');
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            return;
        }
        setMobileOpen((currentDrawerStatus) => !currentDrawerStatus);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [drawerStatus]);

    // const testData = useMemo((): any => {
    //     return testRange(data?.data);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [data?.data]);

    // useEffect(() => {
    //     console.log(
    //         'XXXXXXXXXXMMMMMMMMMMM TI KANEIS RE REACT POULAKI MOU POUPOULA'
    //     );
    //     if (data?.data) {
    //         console.log('exw data kai prepei na treksw');
    //         console.log(data?.data);
    //         setValue([
    //             data.data[0].year,
    //             data.data[data.data.length - 1].year,
    //         ] as number[]);

    //         dispatch(
    //             setYearsRange([
    //                 data.data[0].year,
    //                 data.data[data.data.length - 1].year,
    //             ])
    //         );
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [data?.data]);

    // const handleChange = (event: Event, newValue: number | number[]) => {
    //     // console.log(newValue);
    //     setValue(newValue as number[]);
    //     clearTimeout(testTimeout);
    //     testTimeout = setTimeout(function () {
    //         console.log('hello world!');

    //         dispatch(setYearsRange(newValue as number[]));
    //     }, 450);
    // };

    useEffect(() => {
        console.log(mobileOpen);
    }, [mobileOpen]);

    // useEffect(() => {
    //     if (departmenentData?.data) {
    //         setFilteredDeps(departmenentData?.data);
    //     }
    // }, [departmenentData?.data]);

    // TODO: Na balw tous elegxous kapou allou gia na exw kalitero loading screen?
    const drawer = yearsData?.data &&
        positionsData?.data &&
        departmenentData?.data && (
            <>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '4px',
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
                            // setValue([
                            //     data.data[0].year,
                            //     data.data[data.data.length - 1].year,
                            // ]);
                            setResetFilters((currentValue) => !currentValue);
                            dispatch(
                                reset([
                                    yearsData.data[0].year,
                                    yearsData.data[yearsData.data.length - 1]
                                        .year,
                                ])
                            );
                        }}
                    >
                        Clear
                    </Button>
                </Box>
                <FixSlide resetFilters={resetFilters} data={yearsData.data} />
                {/* {data && (
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
            </Box> */}
                <ChipTag data={positionsData.data} />
                <NewAcademicStaff
                    resetFilters={resetFilters}
                    data={positionsData.data}
                />
                {/* COMPARE BY CODE --------------------------------------------------------- */}
                <Box>
                    <Typography
                        variant="h5"
                        noWrap
                        component="div"
                        sx={{
                            fontWeight: 'light',
                        }}
                    >
                        Compare by:
                    </Typography>
                    <FormControl>
                        <FormLabel id="demo-radio-buttons-group-label">
                            Compare by:
                        </FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            defaultValue={compareBy}
                            name="radio-buttons-group"
                            onChange={handleCompareByRadioGroup}
                        >
                            <FormControlLabel
                                value="department"
                                control={<Radio />}
                                label="Department"
                            />
                            <FormControlLabel
                                value="academicStaff"
                                control={<Radio />}
                                label="Academic Staff"
                            />
                        </RadioGroup>
                    </FormControl>
                </Box>
                {/* COMPARE BY CODE --------------------------------------------------------- */}
                <FixCheckBox
                    resetFilters={resetFilters}
                    data={departmenentData.data}
                />
                <FixAcademicStaff
                    resetFilters={resetFilters}
                    data={departmenentData.data}
                />
                {/* TODO: A checkbox that has parents and children.
                https://mui.com/joy-ui/react-checkbox/
            */}
                {/* <TextField
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
                    if (departmenentData?.data) {
                        // const tempFilteredDeps = departmenentData?.data.filter(
                        //     (depID) => {
                        //         return depID.id.includes(event.target.value);
                        //     }
                        // );
                        // console.log(event.target.value);
                        // console.log(tempFilteredDeps);
                        // setFilteredDeps(tempFilteredDeps);
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
                <FormControl
                    sx={{ width: '100%' }}
                    component="fieldset"
                    variant="standard"
                >
                    <FormLabel component="legend">Departments</FormLabel>
                    {departmenentData?.data && (
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
                                // <p key={depID.id}>{depID.id}</p>
                            ))}
                        </FormGroup>
                    )}
                </FormControl>
            </Box> */}
            </>
        );

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
                height={700}
            />
        );

    return (
        <>
            {/* <Box
                sx={{
                    display: { xs: 'none', md: 'block' },
                }}
            >
                {drawer}
            </Box> */}
            {/* TODO: Na krathsw mono to ena drawer kai tha allazw dinamika to variant analoga to width kai kapoia css gia na fainetai swsta sthn megalh othonh! */}
            <Drawer
                // container={container}
                variant={large ? 'persistent' : 'temporary'}
                open={large ? true : mobileOpen}
                onClose={(event: object, reason: string) => {
                    if (reason === 'backdropClick' && !mobileOpen) return;
                    setMobileOpen((currentMobileOpen) => !currentMobileOpen);
                }}
                transitionDuration={large ? 0 : undefined}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    // display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: { xs: '80%', sm: '55%', md: '100%' },
                        display: 'flex',
                        padding: { xs: '20px 15px', md: '0' },
                        backgroundColor: { md: 'transparent' },
                    },
                    '& .MuiPaper-root': {
                        position: { xs: 'fixed', md: 'relative' },
                        zIndex: { xs: 1200, md: 1 },
                        border: 'none',
                    },
                    '& .MuiGrid2-root': {
                        padding: 0,
                    },
                }}
            >
                {isYearsDataError ||
                isPositionsDataError ||
                isDepartmenentDataError ? (
                    <h1>ERROR</h1>
                ) : (
                    <>
                        {drawer}
                        <p>aaaaaaaaa</p>
                        <p>aaaaaaaaa</p>
                        <p>aaaaaaaaa</p>
                        <p>aaaaaaaaa</p>
                        <p>aaaaaaaaa</p>
                        <p>aaaaaaaaa</p>
                        <p>aaaaaaaaa</p>
                        <p>aaaaaaaaa</p>
                        <p>aaaaaaaaa</p>
                        <p>aaaaaaaaa</p>
                        <p>aaaaaaaaa</p>
                        <p>aaaaaaaaa</p>
                        <p>aaaaaaaaa</p>
                        <p>aaaaaaaaa</p>
                        <p>aaaaaaaaa</p>
                        <p>aaaaaaaaa</p>
                        <p>aaaaaaaaa</p>
                        <p>aaaaaaaaa</p>
                        <p>aaaaaaaaa</p>
                        <p>aaaaaaaaa</p>
                        <p>aaaaaaaaa</p>
                        <p>aaaaaaaaa</p>
                        <p>aaaaaaaaa</p>
                        <p>aaaaaaaaa</p>
                    </>
                )}
            </Drawer>
        </>
    );
};

export default FixFilters;
