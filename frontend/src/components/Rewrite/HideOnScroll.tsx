import useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery';
import Slide from '@mui/material/Slide/Slide';
import useScrollTrigger from '@mui/material/useScrollTrigger/useScrollTrigger';
import React, { ReactElement, forwardRef } from 'react';
import useTheme from '@mui/material/styles/useTheme';

// A component only to hide the header element
const HideOnScroll = forwardRef<HTMLDivElement, { children: ReactElement }>(
    function HideOnScroll(props, ref) {
        const theme = useTheme();
        const isMobile = useMediaQuery(theme.breakpoints.down('md'));
        const { children } = props;
        const trigger = useScrollTrigger();

        return (
            <Slide appear={false} direction="down" in={!trigger || isMobile}>
                {React.cloneElement(children, { ref })}
            </Slide>
        );
    }
);

export default HideOnScroll;
