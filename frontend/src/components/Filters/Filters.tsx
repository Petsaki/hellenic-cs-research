import { Slider, Typography, Box } from '@mui/material';
import { useMemo, useState } from 'react';
import { PublicationsYear } from '../../models/api/response/publications/publications.data';
import { useGetPublicationsYearsQuery } from '../../services/publicationApi';

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

function Filters() {
    const [value, setValue] = useState<number[]>([0, 100]);
    const { data, isFetching, isError } = useGetPublicationsYearsQuery();

    const testData = useMemo((): any => {
        if (data) {
            setValue([
                data.data[0].year,
                data.data[data.data.length - 1].year,
            ] as number[]);
        }

        return testRange(data?.data);
    }, [data]);

    const handleChange = (event: Event, newValue: number | number[]) => {
        console.log(newValue);
        setValue(newValue as number[]);
    };

    return (
        <>
            <Typography
                variant="h5"
                noWrap
                component="div"
                sx={{
                    fontWeight: 'light',
                    mb: 4,
                }}
            >
                Filters
            </Typography>
            {data && (
                <Box sx={{ width: 300 }}>
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
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
            <p>aaaaaaaa</p>
        </>
    );
}

export default Filters;
