import { useState } from 'react';
import { SxProps, Theme, useTheme } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import DepartmentStaff from '../components/Charts/DepartmentStaff';
import Statistics from '../components/Statistics';
import AcademicDataTable from '../components/AcademicDataTable';
import { ParamNames } from '../app/hooks/useUrlParams';
import MessageComponent from '../components/MessageComponent';

const Rewrite = () => {
    const theme = useTheme();
    const [drawerOpen, setDrawerOpen] = useState(false);
    // const headerRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <MessageComponent
                param={ParamNames.Departments}
                filter="department"
            />
            <Grid2
                xs
                sx={{
                    width: '100%',
                }}
            >
                <Statistics />
            </Grid2>
            <Grid2
                xs
                sx={{
                    width: '100%',
                }}
            >
                <DepartmentStaff />
            </Grid2>
            <Grid2
                xs
                sx={{
                    width: '100%',
                }}
            >
                <AcademicDataTable />
                {/* <YearsChart /> */}
            </Grid2>
        </>
    );
};

export default Rewrite;
