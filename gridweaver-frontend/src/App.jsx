import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
// import Devices from "./pages/Devices";
// import Batteries from "./pages/Batteries";
// import Events from "./pages/Events";
// import Analytics from "./pages/Analytics";
// import LiveMap from "./pages/LiveMap";
// import Login from "./pages/Login";

function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* LOGIN
                <Route
                    path="/login"
                    element={<Login />}
                /> */}

                {/* DASHBOARD AREA */}
                <Route
                    path="/*"
                    element={
                        <>
                            <Navbar />

                            <Routes>

                                <Route
                                    path="/dashboard"
                                    element={<Dashboard />}
                                />

                                {/* <Route
                                    path="/map"
                                    element={<LiveMap />}
                                />

                                <Route
                                    path="/devices"
                                    element={<Devices />}
                                />

                                <Route
                                    path="/batteries"
                                    element={<Batteries />}
                                />

                                <Route
                                    path="/events"
                                    element={<Events />}
                                />

                                <Route
                                    path="/analytics"
                                    element={<Analytics />}
                                /> */}

                            </Routes>
                        </>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;