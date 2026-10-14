import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: "▦",
        },
        {
            name: "Devices",
            path: "/devices",
            icon: "◉",
        },
        {
            name: "Batteries",
            path: "/batteries",
            icon: "▣",
        },
        {
            name: "Grid",
            path: "/grid",
            icon: "⌁",
        },
        {
            name: "Events",
            path: "/events",
            icon: "◷",
        },
        {
            name: "Analytics",
            path: "/analytics",
            icon: "▥",
        },
        {
            name: "Settings",
            path: "/settings",
            icon: "⚙",
        },
    ];

    return (
        <aside className="sidebar">

            {/* Logo */}
            <div className="sidebar-logo">
                <div className="logo-icon">
                    GW
                </div>

                <div className="logo-content">
                    <h2>GridWeaver</h2>
                    <span>Microgrid Platform</span>
                </div>
            </div>

            {/* Navigation */}
            <div className="sidebar-section-title">
                MAIN MENU
            </div>

            <nav className="sidebar-menu">

                {menuItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            isActive
                                ? "sidebar-link active"
                                : "sidebar-link"
                        }
                    >
                        <span className="sidebar-icon">
                            {item.icon}
                        </span>

                        <span className="sidebar-text">
                            {item.name}
                        </span>
                    </NavLink>
                ))}

            </nav>

            {/* Bottom Information */}
            <div className="sidebar-bottom">

                <div className="system-status">

                    <div className="status-dot"></div>

                    <div>
                        <span className="status-title">
                            System Status
                        </span>

                        <span className="status-value">
                            All Systems Operational
                        </span>
                    </div>

                </div>

                <div className="sidebar-user">

                    <div className="user-avatar">
                        GW
                    </div>

                    <div className="user-info">
                        <strong>Grid Admin</strong>
                        <span>Administrator</span>
                    </div>

                </div>

            </div>

        </aside>
    );
}

export default Sidebar;