import { useEffect, useMemo, useState } from 'react';
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
import { YearsArray } from '../../models/api/response/departments/departments.data';

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
    const marks: Array<ISliderMark> = [];

    years?.map((year, index) => {
        if (index === 0 || years.length - 1 === index) {
            return marks.push({ value: year, label: year });
        }
        return marks.push({ value: year });
    });

    return marks;
};

let yearsFiltersTimeout: ReturnType<typeof setTimeout>;

export interface YearsFilters {
    yearsRange: number[];
    unknownYear: boolean;
}

export interface FixSliderProp {
    data: YearsArray;
}
const FixSlide: React.FC<FixSliderProp> = ({ data }: FixSliderProp) => {
    const theme = useTheme();
    const [paramValue, handleInputChange] = useUrlParams({
        name: ParamNames.YearsRange,
        data,
    });

    const [unknownParamValue, handleUnknownInputChange] = useUrlParams({
        name: ParamNames.UnknownYear,
        data,
    });

    const [yearsFilters, setYearsFilters] = useState<YearsFilters>({
        yearsRange: [data[0], data[data.length - 1]],
        unknownYear: false,
    });

    useEffect(() => {
        if (paramValue) {
            const yearsFitlersValue = JSON.parse(paramValue) as YearsFilters;
            const yearsRangeArray = yearsFitlersValue.yearsRange;

            if (yearsRangeArray.length === 2) {
                setYearsFilters({
                    yearsRange: yearsRangeArray,
                    unknownYear: !!yearsFitlersValue.unknownYear,
                });
            } else {
                setYearsFilters({
                    ...yearsFilters,
                    yearsRange: [data[0], data[data.length - 1]],
                });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paramValue]);

    useEffect(() => {
        if (unknownParamValue) {
            const unknownYearValue = JSON.parse(unknownParamValue) as boolean;

            setYearsFilters((prevValue) => {
                return {
                    ...prevValue,
                    unknownYear: unknownYearValue,
                };
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [unknownParamValue]);

    const sliderMarks = useMemo((): Array<ISliderMark> => {
        return createMarks(data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const handleChange = (newYearsFilters: YearsFilters) => {
        clearTimeout(yearsFiltersTimeout);
        yearsFiltersTimeout = setTimeout(() => {
            handleInputChange({ yearsFilters: newYearsFilters });
        }, 450);
    };

    const SliderOnChange = (event: Event, newValue: number | number[]) => {
        if (Array.isArray(newValue)) {
            setYearsFilters({
                ...yearsFilters,
                yearsRange: [newValue[0], newValue[newValue.length - 1]],
            });
            handleChange({
                ...yearsFilters,
                yearsRange: [newValue[0], newValue[newValue.length - 1]],
            });
        }
    };

    const CheckboxOnChange = () => {
        setYearsFilters({
            ...yearsFilters,
            unknownYear: !yearsFilters.unknownYear,
        });
        handleChange({
            ...yearsFilters,
            unknownYear: !yearsFilters.unknownYear,
        });
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
                    <FormGroup>
                        <Box sx={{ padding: '0 28px' }}>
                            <Slider
                                sx={slider}
                                getAriaLabel={() => 'Years range'}
                                value={yearsFilters.yearsRange}
                                onChange={SliderOnChange}
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
                        {yearsFilters.yearsRange[0]}
                    </Typography>
                    <Typography
                        variant="body2"
                        noWrap
                        component="div"
                        sx={sliderLabel(theme)}
                    >
                        {yearsFilters.yearsRange[1]}
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
                            data[0] === yearsFilters.yearsRange[0] &&
                            data[data.length - 1] === yearsFilters.yearsRange[1]
                        )
                    }
                    value={yearsFilters.unknownYear}
                    labelPlacement="start"
                    control={
                        <Checkbox
                            onClick={CheckboxOnChange}
                            checked={yearsFilters.unknownYear}
                        />
                    }
                    label="Unknown year"
                />
            </Tooltip>
        </Box>
    );
};

export default FixSlide;
