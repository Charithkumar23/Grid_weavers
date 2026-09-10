import { useState } from "react";
import "./Sidebar.css";

function Sidebar() {
  const [active, setActive] = useState("Dashboard");

  const menuItems = [
    {
      section: "MAIN MENU",
      items: [
        { name: "Dashboard", icon: "▦" },
        { name: "Grid Nodes", icon: "◉" },
        { name: "Energy Flow", icon: "⚡" },
        { name: "Events", icon: "◌" },
      ],
    },
    {
      section: "SYSTEM",
      items: [
        { name: "State Machine", icon: "◇" },
        { name: "Analytics", icon: "▥" },
        { name: "Settings", icon: "⚙" },
      ],
    },
  ];

  return (
    <aside className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">

        <div className="logo-box">
          ⚡
        </div>

        <div className="logo-text">
          <h2>GridWeaver</h2>
          <span>IoT Grid Engine</span>
        </div>

      </div>


      {/* Menu */}
      <div className="sidebar-menu">

        {menuItems.map((section) => (
          <div className="menu-section" key={section.section}>

            <div className="section-title">
              {section.section}
            </div>

            {section.items.map((item) => (

              <button
                key={item.name}
                className={`menu-item ${
                  active === item.name ? "active" : ""
                }`}
                onClick={() => setActive(item.name)}
              >

                <span className="menu-icon">
                  {item.icon}
                </span>

                <span className="menu-name">
                  {item.name}
                </span>

              </button>

            ))}

          </div>
        ))}

      </div>


      {/* Bottom Status */}
      <div className="sidebar-status">

        <div className="online-row">

          <span className="online-dot"></span>

          <strong>System Online</strong>

        </div>

        <p>Backend connected</p>

        <span className="backend">
          Spring Boot : 8080
        </span>

      </div>

    </aside>
  );
}

export default Sidebar;