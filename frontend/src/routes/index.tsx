import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Citations from '../containers/Citations';
import TheLayout from '../components/TheLayout';
import NotFound from '../pages/NotFound';
import DepartmentsStats from '../containers/DepartmentsStats';
import FilterAndDataComponent from '../pages/FilterAndDataComponent';

function Paths() {
    // Marios - I can do it with react-router inside FilterAndDataComponent and not using pure javascript
    if (window.location.pathname === '/') {
        window.history.replaceState({}, '', '/citations');
        return <Navigate to="/citations" />;
    }

    return (
        <BrowserRouter>
            <TheLayout>
                <Routes>
                    <Route path="/" element={<FilterAndDataComponent />}>
                        <Route path="/citations" element={<Citations />} />
                        <Route
                            path="/departments"
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
