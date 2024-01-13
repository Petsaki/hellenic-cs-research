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
                    {/* Redirect from "/" to "/citations" without leaving "/" in history */}
                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/citations"
                                replace // Use replace to skip adding "/" to history
                            />
                        }
                    />
                    <Route
                        path="/citations"
                        element={<FilterAndDataComponent />}
                    />
                    <Route
                        path="/departments"
                        element={<FilterAndDataComponent />}
                    />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </TheLayout>
        </BrowserRouter>
    );
}

export default Paths;
