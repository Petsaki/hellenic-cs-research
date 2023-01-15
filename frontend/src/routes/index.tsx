import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chart from '../pages/Chart';
import Home from '../pages/Home';

function Paths() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/chart" element={<Chart />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Paths;
