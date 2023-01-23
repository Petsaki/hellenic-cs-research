import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chart from '../pages/Chart';
import Home from '../pages/Home';
import TestMui from '../pages/TestMui';

function Paths() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/chart" element={<Chart />} />
                <Route path="/mui" element={<TestMui />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Paths;
