import Slide from '@mui/material/Slide';
import useScrollTrigger from '@mui/material/useScrollTrigger';

export interface TheSlideProps {
    children: any;
}

const TheSlide: React.FC<TheSlideProps> = ({ children }: TheSlideProps) => {
    return (
        <Slide appear={false} direction="down">
            {children}
        </Slide>
    );
};

export default TheSlide;
