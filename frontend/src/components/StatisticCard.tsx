import {
    Card,
    CardContent,
    SxProps,
    Typography,
    useTheme,
    Skeleton,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Tooltip from '@mui/material/Tooltip';

const container: SxProps = {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    color: 'white',
    borderRadius: '8px',
};

const cardContentStyle: SxProps = {
    pt: {
        xs: '20px',
        lg: '24px',
    },
    px: {
        xs: '8px',
        lg: '16px',
    },
    gap: { xs: '4px', sm: '12px' },
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    '&.MuiCardContent-root': {
        pb: '0px',
    },
    '>:last-child': {
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        width: 'calc(100%)',
        WebkitBoxOrient: 'vertical',
        display: '-webkit-box',
        WebkitLineClamp: '2',
    },
};

const statisticsTitles = new Map<string, ICardTexts>([
    [
        'avg_citations_per_staff',
        {
            title: 'Avg Citations per Member',
            tooltip:
                'Average Citations per Member from the selected departments.',
        },
    ],
    [
        'avg_citations_per_staff_per_year',
        {
            title: 'Avg Citations per Member per Year',
            tooltip: `Average Citations per Member per Year from the selected departments.
                Years are count base of if the year had any Publication or Citations and for the given academic positions.`,
        },
    ],
    [
        'avg_hindex',
        {
            title: 'Avg H',
            tooltip: 'Average H index from the selected departments.',
        },
    ],
    [
        'avg_hindex5',
        {
            title: 'Avg H5',
            tooltip:
                'Average H index for the last 5 years from the selected departments.',
        },
    ],
    [
        'avg_publications_per_staff',
        {
            title: 'Avg Publications per Member',
            tooltip:
                'Average Publications per Member from the selected departments.',
        },
    ],
    [
        'avg_publications_per_staff_per_year',
        {
            title: 'Avg Publications per Member per Year',
            tooltip: `Average Publications per Member per Year from the selected departments.
            Years are count base of if the year had any Publication or Citations and for the given academic positions.`,
        },
    ],
    [
        'sum_citations',
        {
            title: 'Citations',
            tooltip: 'Total Citations from the selected departments.',
        },
    ],
    [
        'sum_citations5',
        {
            title: 'Citations5',
            tooltip:
                'Total Citations for the last 5 years from the selected departments.',
        },
    ],
    [
        'sum_publications',
        {
            title: 'Publications',
            tooltip: 'Total Publications from the selected departments.',
        },
    ],
    [
        'sum_publications5',
        {
            title: 'Publications5',
            tooltip:
                'Total Publications for the last 5 years from the selected departments.',
        },
    ],
]);

export interface ICardTexts {
    title: string;
    tooltip: string;
}

export interface StatisticCardProp {
    keyMap?: string;
    value?: string;
    skeleton?: boolean;
}

const StatisticCard: React.FC<StatisticCardProp> = ({
    keyMap,
    value,
    skeleton,
}: StatisticCardProp) => {
    const theme = useTheme();
    const [cardTexts, setcardTexts] = useState<ICardTexts | undefined>();
    const backgroundCard =
        theme.palette.mode === 'dark'
            ? 'linear-gradient(126deg,#005a87,#7096d6 67%)'
            : 'linear-gradient(126deg,#0188cc,#8ab2f6 67%)';

    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

    useEffect(() => {
        if (keyMap) {
            setcardTexts(statisticsTitles.get(keyMap));
        }
    }, [keyMap]);

    return (
        <Tooltip title={cardTexts?.tooltip}>
            <Card
                sx={{
                    ...container,
                    background: backgroundCard,
                }}
            >
                <CardContent
                    sx={{
                        ...cardContentStyle,
                        ...(skeleton && {
                            gap: 2,
                        }),
                    }}
                >
                    {skeleton && (
                        <>
                            <Skeleton
                                animation="wave"
                                variant="rounded"
                                width={120}
                                height={26}
                            />
                            <Skeleton
                                animation="wave"
                                variant="rounded"
                                width={90}
                                height={18}
                            />
                        </>
                    )}
                    {!skeleton && (
                        <>
                            <Typography
                                variant={isSmallScreen ? 'h6' : 'h5'}
                                align="center"
                                sx={{ fontWeight: 'bold' }}
                            >
                                {value || 0}
                            </Typography>
                            <Typography
                                variant={
                                    isSmallScreen ? 'subtitle2' : 'inherit'
                                }
                                align="center"
                            >
                                {cardTexts?.title}
                            </Typography>
                        </>
                    )}
                </CardContent>
            </Card>
        </Tooltip>
    );
};

export default StatisticCard;
