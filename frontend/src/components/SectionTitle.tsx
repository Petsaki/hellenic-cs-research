import { SxProps } from '@mui/material';
import Typography from '@mui/material/Typography/Typography';

const title: SxProps = {
    letterSpacing: '0.03rem',
    textTransform: 'capitalize',
    fontSize: { xs: '1.725rem', md: '2.125rem' },
};

export interface SectionTitleProp {
    titleText: string;
    align?: 'center' | 'inherit' | 'justify' | 'left' | 'right';
    sxPropsCustom?: SxProps;
}

const SectionTitle: React.FC<SectionTitleProp> = ({
    titleText,
    align,
    sxPropsCustom,
}: SectionTitleProp) => {
    return (
        <Typography
            variant="h4"
            sx={{ ...title, ...sxPropsCustom }}
            gutterBottom
            align={align ?? 'center'}
        >
            {titleText}
        </Typography>
    );
};

export default SectionTitle;
