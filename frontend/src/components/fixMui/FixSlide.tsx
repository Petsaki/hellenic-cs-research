import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box/Box';
import Slider from '@mui/material/Slider/Slider';
import Typography from '@mui/material/Typography/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { setMaxYearsRange, setYearsRange } from '../../app/slices/testSlice';
import { useGetPublicationsYearsQuery } from '../../services/publicationApi';
import { PublicationsYear } from '../../models/api/response/publications/publications.data';
import { RootState } from '../../app/store';

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

let testTimeout: any;

export interface FixSlideProp {
    resetFilters: boolean;
    data: PublicationsYear[];
}
const FixSlide: React.FC<FixSlideProp> = ({
    resetFilters,
    data,
}: FixSlideProp) => {
    const dispatch = useDispatch();
    const yearsDataTestSlice = useSelector(
        (state: RootState) => state.testSlice.yearsRange
    );
    console.log('KANW RERENDER!!');

    // const { data, isFetching, isError } = useGetPublicationsYearsQuery();
    const [value, setValue] = useState<number[]>([
        yearsDataTestSlice[0],
        yearsDataTestSlice[1],
    ]);

    useEffect(() => {
        console.log('poses fores mphka edw?');

        if (yearsDataTestSlice.length) {
            setValue([yearsDataTestSlice[0], yearsDataTestSlice[1]]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetFilters]);

    // useEffect(() => {
    //     console.log('EGW TREXW OTAN KANEI RE-RENDER MONO STO ONMOUNT');
    //     console.log(yearsDataTestSlice);

    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    const testData = useMemo((): any => {
        return testRange(data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        console.log(
            'XXXXXXXXXXMMMMMMMMMMM TI KANEIS RE REACT POULAKI MOU POUPOULA'
        );
        if (data) {
            console.log('exw data kai prepei na treksw');
            console.log(data);
            if (yearsDataTestSlice.length) {
                setValue([yearsDataTestSlice[0], yearsDataTestSlice[1]]);
                console.log(
                    'TO yearsDataTestSlice EXEI DATA OPOTE MHN KANEIS RESET GMTX'
                );
            } else {
                setValue([
                    data[0].year,
                    data[data.length - 1].year,
                ] as number[]);

                dispatch(
                    setYearsRange([data[0].year, data[data.length - 1].year])
                );
                dispatch(
                    setMaxYearsRange([data[0].year, data[data.length - 1].year])
                );
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const [searchParams, setSearchParams] = useSearchParams();

    const yearsRange = searchParams.get('yearsRange');

    useEffect(() => {
        console.log('PROSEXE POSES FORES THA MPEI TWRA EDW');

        setValue(yearsDataTestSlice);
    }, [yearsDataTestSlice]);

    // const handleUrlParams = () => {
    //     setSearchParams({ test: Math.floor(Math.random() * 1000) });
    // };

    const handleChange = (event: Event, newValue: number | number[]) => {
        console.log(newValue);
        setValue(newValue as number[]);
        clearTimeout(testTimeout);
        testTimeout = setTimeout(function () {
            console.log('hello world!');
            if (Array.isArray(newValue)) {
                setSearchParams((prevSearchParams) => {
                    prevSearchParams.set(
                        'yearsRange',
                        `${newValue[0]}-${newValue[1]}`
                    );
                    return prevSearchParams;
                });
                // dispatch(setYearsRange(newValue));
            }
        }, 450);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                width: '100%',
                maxWidth: '380px',
                flexDirection: 'column',
                alignSelf: 'center',
            }}
        >
            {data && (
                <Box sx={{ padding: '0 28px' }}>
                    <Slider
                        getAriaLabel={() => 'Years range'}
                        value={value}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        getAriaValueText={valuetext}
                        marks={testData}
                        step={null}
                        min={data[0].year}
                        max={data[data.length - 1].year}
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
        </Box>
    );
};

export default FixSlide;
