import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FixFilters from '../components/fixMui/FixFilter';
import TestSlide from '../components/TestSlide';
import Chart from '../pages/Chart';
import DrawerTest from '../pages/DrawerTest';
import { FixMui } from '../pages/FixMui';
import Home from '../pages/Home';
import TestMui from '../pages/TestMui';
import TheSlide from '../components/TheSlide';

function Paths() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/chart" element={<Chart />} />
                <Route path="/mui" element={<TestMui />} />
                <Route path="/fixmui" element={<FixMui />} />
                <Route path="/fixfilters" element={<FixFilters />} />
                <Route path="/drawer" element={<DrawerTest />} />
                <Route path="/slide" element={<TestSlide />} />
                {/* <Route path="/slide2" element={<TheSlide />} /> */}
            </Routes>
        </BrowserRouter>
    );
}

export default Paths;
