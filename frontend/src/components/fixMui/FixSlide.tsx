import { useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box/Box';
import Slider from '@mui/material/Slider/Slider';
import Typography from '@mui/material/Typography/Typography';
import { SxProps, useTheme, Theme } from '@mui/material';
import FormLabel from '@mui/material/FormLabel/FormLabel';
import FormControl from '@mui/material/FormControl/FormControl';
import { PublicationsYear } from '../../models/api/response/publications/publications.data';
import useUrlParams, { ParamNames } from '../../app/hooks/useUrlParams';
import { stringToYearArray } from '../../app/untils/yearsRange';

// Style
const slider: SxProps = {
    '& .MuiSlider-mark': {
        display: 'none',
    },
};

const sliderLabel: SxProps<Theme> = (theme) => ({
    fontWeight: 'light',
    bgcolor: theme.palette.mode === 'dark' ? '#272727' : '#7096d6',
    p: 1.5,
    borderRadius: 1,
    color: 'white',
});

interface ISliderMark {
    label?: number;
    value: number;
}

export const createMarks = (
    years: PublicationsYear[] | undefined
): Array<ISliderMark> => {
    console.log(years);
    const marks: Array<ISliderMark> = [];
    years?.map((year, index) => {
        if (index === 0 || years.length - 1 === index) {
            return marks.push({ value: year.year, label: year.year });
        }
        return marks.push({ value: year.year });
    });
    console.log(marks);

    return marks;
};

let sliderTimeout: NodeJS.Timeout;

export interface FixSliderProp {
    resetFilters: boolean;
    data: PublicationsYear[];
}
const FixSlide: React.FC<FixSliderProp> = ({
    resetFilters,
    data,
}: FixSliderProp) => {
    const theme = useTheme();
    const [paramValue, handleInputChange] = useUrlParams({
        name: ParamNames.YearsRange,
        data,
    });

    const [value, setValue] = useState<number[]>([0, 0]);
    const isFirstRender = useRef(true);

    useEffect(() => {
        console.log('Parameter value:', paramValue);
        if (paramValue) {
            const yearsRangeArray = stringToYearArray(paramValue);
            console.log(yearsRangeArray);
            setValue(yearsRangeArray);
            console.log('DO I HAVE DATA??? ', data);
        } else {
            setValue([data[0].year, data[data.length - 1].year]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramValue]);

    useEffect(() => {
        console.log('clear slider value');

        if (data && !isFirstRender.current) {
            setValue([data[0].year, data[data.length - 1].year]);
            handleInputChange({
                years: `${data[0].year}-${data[data.length - 1].year}`,
            });
        }
        isFirstRender.current = false;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetFilters]);

    const sliderMarks = useMemo((): Array<ISliderMark> => {
        return createMarks(data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number[]);
        clearTimeout(sliderTimeout);
        sliderTimeout = setTimeout(() => {
            console.log('hello world!');
            if (Array.isArray(newValue)) {
                handleInputChange({ years: `${newValue[0]}-${newValue[1]}` });
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
            <FormControl
                sx={{ width: '100%' }}
                component="fieldset"
                variant="standard"
            >
                <FormLabel component="legend">Years Range</FormLabel>

                {data && (
                    <Box sx={{ padding: '0 28px' }}>
                        <Slider
                            sx={slider}
                            getAriaLabel={() => 'Years range'}
                            value={value}
                            onChange={handleChange}
                            valueLabelDisplay="auto"
                            marks={sliderMarks}
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
                        sx={sliderLabel(theme)}
                    >
                        {value[0]}
                    </Typography>
                    <Typography
                        variant="body2"
                        noWrap
                        component="div"
                        sx={sliderLabel(theme)}
                    >
                        {value[1]}
                    </Typography>
                </Box>
            </FormControl>
        </Box>
    );
};

export default FixSlide;
