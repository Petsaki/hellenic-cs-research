import { SxProps } from '@mui/material';
import Typography from '@mui/material/Typography/Typography';

const title: SxProps = {
    fontWeight: 'bold',
    letterSpacing: '0.03rem',
    textTransform: 'capitalize',
};

export interface SectionTitleProp {
    titleText: string;
    align?: 'center' | 'inherit' | 'justify' | 'left' | 'right';
    sxPropstest?: SxProps;
}

const SectionTitle: React.FC<SectionTitleProp> = ({
    titleText,
    align,
    sxPropstest,
}: SectionTitleProp) => {
    return (
        <Typography
            variant="h4"
            sx={{ title, ...sxPropstest }}
            gutterBottom
            align={align ?? 'center'}
        >
            {titleText}
        </Typography>
    );
};

export default SectionTitle;
