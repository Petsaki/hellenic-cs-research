import { useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box/Box';
import Slider from '@mui/material/Slider/Slider';
import Typography from '@mui/material/Typography/Typography';
import {
    SxProps,
    useTheme,
    Theme,
    FormControlLabel,
    Checkbox,
    Tooltip,
} from '@mui/material';
import FormLabel from '@mui/material/FormLabel/FormLabel';
import FormControl from '@mui/material/FormControl/FormControl';
import FormGroup from '@mui/material/FormGroup/FormGroup';
import useUrlParams, { ParamNames } from '../../app/hooks/useUrlParams';
import { stringToYearArray } from '../../app/untils/yearsRange';
import { YearsArray } from '../../models/api/response/departments/departments.data';

// Style
const slider: SxProps = {
    '& .MuiSlider-mark': {
        display: 'none',
    },
};

const sliderLabel: SxProps<Theme> = (theme) => ({
    fontWeight: 'light',
    bgcolor: theme.palette.mode === 'dark' ? '#272727' : '#55a1e5',
    p: 1.5,
    borderRadius: 1,
    color: 'white',
});

interface ISliderMark {
    label?: number;
    value: number;
}

export const createMarks = (
    years: YearsArray | undefined
): Array<ISliderMark> => {
    console.log(years);
    const marks: Array<ISliderMark> = [];
    years?.map((year, index) => {
        if (index === 0 || years.length - 1 === index) {
            return marks.push({ value: year, label: year });
        }
        return marks.push({ value: year });
    });
    console.log(marks);

    return marks;
};

let sliderTimeout: ReturnType<typeof setTimeout>;
let unknownYearTimeout: ReturnType<typeof setTimeout>;

export interface FixSliderProp {
    data: YearsArray;
}
const FixSlide: React.FC<FixSliderProp> = ({ data }: FixSliderProp) => {
    const theme = useTheme();
    const [paramValue, handleInputChange] = useUrlParams({
        name: ParamNames.YearsRange,
        data,
    });

    const [unknownYearParamValue, handleInputChangeunknownYear] = useUrlParams({
        name: ParamNames.UnknownYear,
        data: true,
    });

    const [value, setValue] = useState<number[]>([0, 0]);
    const [unknownYearValue, setUnknownYearValue] = useState<boolean>(false);

    useEffect(() => {
        if (paramValue) {
            const yearsRangeArray = stringToYearArray(paramValue);
            setValue(yearsRangeArray);
        } else {
            setValue([data[0], data[data.length - 1]]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramValue]);

    useEffect(() => {
        setUnknownYearValue(unknownYearParamValue === 'true');
    }, [unknownYearParamValue]);

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

    useEffect(() => {
        clearTimeout(unknownYearTimeout);
        unknownYearTimeout = setTimeout(() => {
            handleInputChangeunknownYear({ unknownYear: unknownYearValue });
        }, 450);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unknownYearValue]);

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
                    <FormGroup>
                        <Box sx={{ padding: '0 28px' }}>
                            <Slider
                                sx={slider}
                                getAriaLabel={() => 'Years range'}
                                value={value}
                                onChange={handleChange}
                                valueLabelDisplay="auto"
                                marks={sliderMarks}
                                step={null}
                                min={data[0]}
                                max={data[data.length - 1]}
                            />
                        </Box>
                    </FormGroup>
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
            <Tooltip
                title={`It will fetch citations and publications that they don't year`}
                enterDelay={1300}
                enterNextDelay={300}
            >
                <FormControlLabel
                    sx={{
                        margin: '1rem 0.5rem 0 0.75rem',
                        justifyContent: 'space-between',
                    }}
                    disabled={
                        !(
                            data[0] === value[0] &&
                            data[data.length - 1] === value[1]
                        )
                    }
                    value={unknownYearValue}
                    labelPlacement="start"
                    control={
                        <Checkbox
                            onClick={() =>
                                setUnknownYearValue(!unknownYearValue)
                            }
                            checked={unknownYearValue}
                        />
                    }
                    label="Unknown year"
                />
            </Tooltip>
        </Box>
    );
};

export default FixSlide;
