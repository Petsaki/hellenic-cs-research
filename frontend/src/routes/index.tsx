import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Citations from '../containers/Citations';
import TheLayout from '../components/TheLayout';
import NotFound from '../pages/NotFound';
import DepartmentsStats from '../containers/DepartmentsStats';
import FilterAndDataComponent from '../pages/FilterAndDataComponent';

function Paths() {
    return (
        <BrowserRouter>
            <TheLayout>
                <Routes>
                    <Route path="/" element={<FilterAndDataComponent />}>
                        <Route index element={<Navigate to="/citations" />} />
                        <Route path="/citations" element={<Citations />} />
                        <Route
                            path="/departments-stats"
                            element={<DepartmentsStats />}
                        />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </TheLayout>
        </BrowserRouter>
    );
}

export default Paths;
