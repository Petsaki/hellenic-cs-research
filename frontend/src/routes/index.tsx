import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FixFilters from '../components/fixMui/FixFilter';
import TestSlide from '../components/TestSlide';
import Chart from '../pages/Chart';
import DrawerTest from '../pages/DrawerTest';
import { FixMui } from '../pages/FixMui';
import Home from '../pages/Home';
import TestMui from '../pages/TestMui';
import TheSlide from '../components/TheSlide';
import Rewrite from '../pages/Rewrite';
import TheLayout from '../components/TheLayout';
import NotFound from '../pages/NotFound';
import DepartmentsStats from '../pages/DepartmentsStats';

function Paths() {
    return (
        <BrowserRouter>
            <TheLayout>
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/chart" element={<Chart />} />
                    <Route path="/mui" element={<TestMui />} />
                    <Route path="/fixmui" element={<FixMui />} />
                    <Route path="/fixfilters" element={<FixFilters />} />
                    <Route path="/drawer" element={<DrawerTest />} />
                    <Route path="/slide" element={<TestSlide />} />
                    <Route path="/rewrite" element={<Rewrite />} />
                    <Route
                        path="/departments-stats"
                        element={<DepartmentsStats />}
                    />
                    <Route path="*" element={<NotFound />} />
                    {/* <Route path="/slide2" element={<TheSlide />} /> */}
                </Routes>
            </TheLayout>
        </BrowserRouter>
    );
}

export default Paths;
