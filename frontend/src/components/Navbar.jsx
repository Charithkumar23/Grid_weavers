import React, { useEffect, useState } from "react";
import { RefreshCw, Bell, LogOut } from "lucide-react";
import { api } from "../service/api";
import "./Navbar.css";

function Navbar() {

    const [user, setUser] = useState({
        name: "Loading...",
        email: "",
        role: "Administrator"
    });

    const [loadingUser, setLoadingUser] = useState(true);

    /* =====================================================
       LOAD LOGGED-IN USER FROM DATABASE
    ===================================================== */

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const fetchCurrentUser = async () => {

        try {

            setLoadingUser(true);

            const response = await api.get("/user/me");

            console.log("Current user from database:", response.data);

            const userData =
                response.data?.user ||
                response.data;

            setUser({
                name: userData?.name || userData?.fullName || "Grid Admin",
                email: userData?.email || "",
                role: userData?.role || "Administrator"
            });

        } catch (error) {

            console.error(
                "Unable to load current user:",
                error
            );

            /*
             * If API fails, try localStorage user
             * as a fallback.
             */

            try {

                const savedUser =
                    JSON.parse(
                        localStorage.getItem("user")
                    );

                if (savedUser) {

                    setUser({
                        name:
                            savedUser.name ||
                            savedUser.fullName ||
                            "Grid Admin",

                        email:
                            savedUser.email || "",

                        role:
                            savedUser.role ||
                            "Administrator"
                    });

                } else {

                    setUser({
                        name: "Grid Admin",
                        email: "",
                        role: "Administrator"
                    });

                }

            } catch (storageError) {

                console.error(
                    "Unable to read saved user:",
                    storageError
                );

                setUser({
                    name: "Grid Admin",
                    email: "",
                    role: "Administrator"
                });
            }

        } finally {

            setLoadingUser(false);
        }
    };


    /* =====================================================
       REFRESH
    ===================================================== */

    const handleRefresh = () => {

        window.location.reload();

    };


    /* =====================================================
       LOGOUT
    ===================================================== */

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";

    };


    /* =====================================================
       USER INITIALS
    ===================================================== */

    const getInitials = (name) => {

        if (!name || name === "Loading...") {
            return "GW";
        }

        const words = name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (words.length === 1) {

            return words[0]
                .substring(0, 2)
                .toUpperCase();

        }

        return (
            words[0].charAt(0) +
            words[words.length - 1].charAt(0)
        ).toUpperCase();
    };


    return (

        <header className="grid-navbar">

            {/* =================================================
                NAVBAR TITLE
            ================================================= */}

            <div className="navbar-title">

                <div>

                    <h2>
                        Microgrid Dashboard
                    </h2>

                    <p>
                        Real-time IoT infrastructure monitoring
                    </p>

                </div>

            </div>


            {/* =================================================
                NAVBAR ACTIONS
            ================================================= */}

            <div className="navbar-actions">


                {/* =============================================
                    LIVE
                ============================================= */}

                <div className="navbar-live">

                    <span className="navbar-live-dot"></span>

                    LIVE

                </div>


                {/* =============================================
                    REFRESH
                ============================================= */}

                <button
                    className="navbar-icon-btn"
                    onClick={handleRefresh}
                    title="Refresh Dashboard"
                >

                    <RefreshCw size={18} />

                </button>


                {/* =============================================
                    NOTIFICATION
                ============================================= */}

                <button
                    className="navbar-icon-btn"
                    title="Notifications"
                >

                    <Bell size={18} />

                </button>


                {/* =============================================
                    DATABASE USER
                ============================================= */}

                <div className="navbar-user">

                    {/* USER AVATAR */}

                    <div className="navbar-avatar">

                        {loadingUser
                            ? "..."
                            : getInitials(user.name)}

                    </div>


                    {/* USER INFORMATION */}

                    <div className="navbar-user-info">

                        <strong>

                            {loadingUser
                                ? "Loading..."
                                : user.name}

                        </strong>

                        <span>

                            {loadingUser
                                ? "Loading..."
                                : user.role}

                        </span>

                    </div>

                </div>


                {/* =============================================
                    LOGOUT
                ============================================= */}

                <button
                    className="navbar-logout"
                    onClick={handleLogout}
                    title="Logout"
                >

                    <LogOut size={17} />

                </button>

            </div>

        </header>
    );
}

export default Navbar;