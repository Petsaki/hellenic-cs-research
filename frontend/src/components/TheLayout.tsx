import { ReactNode, useRef } from 'react';
import { Route } from 'react-router-dom';
import { Toolbar, SxProps } from '@mui/material';
import Header from './Header';
import HideOnScroll from './Rewrite/HideOnScroll';
import TheProgressBar from './TheProgressBar';

const toolbar: SxProps = {
    display: { xs: 'none', md: 'flex' },
};

interface TheLayoutProps {
    children: ReactNode;
}

const TheLayout: React.FC<TheLayoutProps> = ({ children }: TheLayoutProps) => {
    const headerRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <TheProgressBar />
            <HideOnScroll ref={headerRef}>
                <Header onChangeDrawer={() => {}} ref={headerRef} />
            </HideOnScroll>
            <Toolbar sx={toolbar} />
            <main>{children}</main>
        </>
    );
};

export default TheLayout;
