import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const navigate = useNavigate();

    const navItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: "▦"
        },
        {
            name: "Live Map",
            path: "/map",
            icon: "⌖"
        },
        {
            name: "Devices",
            path: "/devices",
            icon: "◉"
        },
        {
            name: "Batteries",
            path: "/batteries",
            icon: "▰"
        },
        {
            name: "Events",
            path: "/events",
            icon: "◌"
        },
        {
            name: "Analytics",
            path: "/analytics",
            icon: "◒"
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <header className="navbar">

            {/* LEFT SECTION */}
            <div className="navbar-left">

                {/* LOGO */}
                <NavLink to="/dashboard" className="logo">
                    <div className="logo-icon">
                        ⚡
                    </div>

                    <div className="logo-text">
                        <span className="logo-main">
                            GridWeaver
                        </span>

                        <span className="logo-subtitle">
                            MICROGRID CONTROL
                        </span>
                    </div>
                </NavLink>

                {/* NAVIGATION */}
                <nav className={`nav-menu ${menuOpen ? "open" : ""}`}>

                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                isActive
                                    ? "nav-link active"
                                    : "nav-link"
                            }
                            onClick={() => setMenuOpen(false)}
                        >
                            <span className="nav-icon">
                                {item.icon}
                            </span>

                            <span>
                                {item.name}
                            </span>
                        </NavLink>
                    ))}

                </nav>

            </div>

            {/* RIGHT SECTION */}
            <div className="navbar-right">

                {/* SYSTEM STATUS */}
                <div className="system-status">
                    <span className="status-dot"></span>

                    <div className="status-content">
                        <span className="status-title">
                            SYSTEM
                        </span>

                        <span className="status-online">
                            Online
                        </span>
                    </div>
                </div>

                {/* NOTIFICATION */}
                <button className="notification-btn">
                    <span className="notification-icon">
                        ♢
                    </span>

                    <span className="notification-badge">
                        3
                    </span>
                </button>

                {/* PROFILE */}
                <div className="profile-container">

                    <button
                        className="profile-btn"
                        onClick={() =>
                            setProfileOpen(!profileOpen)
                        }
                    >
                        <div className="avatar">
                            OP
                        </div>

                        <div className="profile-info">
                            <span className="profile-name">
                                Operator
                            </span>

                            <span className="profile-role">
                                Grid Admin
                            </span>
                        </div>

                        <span className="profile-arrow">
                            ▾
                        </span>
                    </button>

                    {profileOpen && (
                        <div className="profile-dropdown">

                            <NavLink
                                to="/profile"
                                onClick={() =>
                                    setProfileOpen(false)
                                }
                            >
                                👤 Profile
                            </NavLink>

                            <NavLink
                                to="/settings"
                                onClick={() =>
                                    setProfileOpen(false)
                                }
                            >
                                ⚙ Settings
                            </NavLink>

                            <div className="dropdown-divider"></div>

                            <button onClick={handleLogout}>
                                ⇥ Logout
                            </button>

                        </div>
                    )}

                </div>

                {/* MOBILE BUTTON */}
                <button
                    className="mobile-menu-btn"
                    onClick={() =>
                        setMenuOpen(!menuOpen)
                    }
                >
                    ☰
                </button>

            </div>

        </header>
    );
}

export default Navbar;