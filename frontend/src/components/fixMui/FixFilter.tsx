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
    Divider,
} from '@mui/material';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
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
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch();
    // const { data: departmenentData, isLoading: isDepartmenentFetching } =
    //     useGetJesusQuery({
    //         filter: 'id',
    //     });
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
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '22px',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '4px',
                        mb: 2,
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
                            color: '#7096d6',
                            fontSize: '0.8rem',
                            p: 0,
                            '&.MuiButtonBase-root:hover': {
                                bgcolor: 'transparent',
                                textDecoration: 'underline',
                                filter: 'brightness(85%)',
                            },
                        }}
                        onClick={() => {
                            setSearchParams({});
                        }}
                    >
                        Clear
                    </Button>
                </Box>
                <FixSlide data={yearsData.data} />
                <Divider />
                {/* <ChipTag data={positionsData.data} /> */}
                <NewAcademicStaff data={positionsData.data} />
                <Divider />
                {/* COMPARE BY CODE --------------------------------------------------------- */}
                {/* <FixCheckBox
                    resetFilters={resetFilters}
                    data={departmenentData.data}
                /> */}
                <FixAcademicStaff data={departmenentData.data} />
                {/* TODO: A checkbox that has parents and children.
                https://mui.com/joy-ui/react-checkbox/
            */}
            </Box>
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
                height={900}
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
                        padding: { xs: '22px 15px', md: '0' },
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
                    drawer
                )}
            </Drawer>
        </>
    );
};

export default FixFilters;
