import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      path: "/",
    },
    {
      name: "Planner",
      path: "/planner",
    },
    {
      name: "Focus Mode",
      path: "/focus",
    },
    {
      name: "Progress",
      path: "/progress",
    },
    {
      name: "AI Insights",
      path: "/insights",
    },
  ];

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "15px",
        }}
      >
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          style={{
            textDecoration: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg, #312e81, #4f46e5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: "22px",
              }}
            >
              🎓
            </div>

            <div>
              <div
                style={{
                  fontSize: "17px",
                  fontWeight: "800",
                  color: "#0f172a",
                }}
              >
                AI Study Planner
              </div>

              <div
                style={{
                  fontSize: "10px",
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontWeight: "700",
                }}
              >
                Smart learning assistant
              </div>
            </div>
          </div>
        </Link>

        {/* Desktop */}
        <div
          style={{
            display: "flex",
            gap: "5px",
            alignItems: "center",
          }}
          className="desktop-nav"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              style={({ isActive }) => ({
                textDecoration: "none",
                padding: "9px 12px",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: "700",
                backgroundColor: isActive
                  ? "#eef2ff"
                  : "transparent",
                color: isActive
                  ? "#4338ca"
                  : "#64748b",
              })}
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() =>
            setMenuOpen((current) => !current)
          }
          style={{
            display: "none",
            border: "1px solid #e2e8f0",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            padding: "8px 10px",
            cursor: "pointer",
          }}
          className="mobile-menu-button"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            borderTop: "1px solid #f1f5f9",
            padding: "10px 20px 15px",
            backgroundColor: "#ffffff",
          }}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                display: "block",
                textDecoration: "none",
                padding: "12px",
                borderRadius: "10px",
                marginBottom: "4px",
                fontWeight: "700",
                fontSize: "14px",
                backgroundColor: isActive
                  ? "#eef2ff"
                  : "transparent",
                color: isActive
                  ? "#4338ca"
                  : "#475569",
              })}
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;