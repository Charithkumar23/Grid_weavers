import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";

// Other pages
import Batteries from "./pages/Batteries";
import Grid from "./pages/Grid";
import Events from "./pages/Events";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";


/* ================================
   PROTECTED ROUTE
================================ */

function ProtectedRoute({ children }) {

    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}


/* ================================
   APP
================================ */

function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* ================================
                    DEFAULT
                ================================= */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />


                {/* ================================
                    AUTH PAGES
                ================================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* ================================
                    DASHBOARD
                ================================= */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                {/* ================================
                    DEVICES
                ================================= */}

                {/* Device List */}

                <Route
                    path="/devices"
                    element={
                        <ProtectedRoute>
                            <Devices />
                        </ProtectedRoute>
                    }
                />


                {/* Single Device */}

                {/* <Route
                    path="/devices/:id"
                    element={
                        <ProtectedRoute>
                            <Devices />
                        </ProtectedRoute>
                    }
                /> */}


                {/* ================================
                    BATTERIES
                ================================= */}

                <Route
                    path="/batteries"
                    element={
                        <ProtectedRoute>
                            <Batteries />
                        </ProtectedRoute>
                    }
                />


                {/* ================================
                    GRID
                ================================= */}

                <Route
                    path="/grid"
                    element={
                        <ProtectedRoute>
                            <Grid />
                        </ProtectedRoute>
                    }
                />


                {/* ================================
                    EVENTS
                ================================= */}

                <Route
                    path="/events"
                    element={
                        <ProtectedRoute>
                            <Events />
                        </ProtectedRoute>
                    }
                />


                {/* ================================
                    ANALYTICS
                ================================= */}

                <Route
                    path="/analytics"
                    element={
                        <ProtectedRoute>
                            <Analytics />
                        </ProtectedRoute>
                    }
                />


                {/* ================================
                    SETTINGS
                ================================= */}

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    }
                /> 


                {/* ================================
                    UNKNOWN URL
                ================================= */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;