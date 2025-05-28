// sideBar.tsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./sideBar.css";

interface NavItem {
  icon: React.ReactNode;
  text: string;
  href: string;
}

interface SideBarProps {
  navItems: NavItem[];
  buttonText: string; 
}

const SideBar: React.FC<SideBarProps> = ({ navItems, buttonText }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="sideBar">
      <div className="sideBar-header">
        <img src="/image/neoClassLogo.png" alt="Logo" />
      </div>

      <div className="sideBar-nav">
        {navItems.map((item, i) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={i}
              to={item.href}
              className={`sideBar-nav-item ${isActive ? "active" : ""}`}
            >
              {item.icon}
              <span>{item.text}</span>
            </Link>
          );
        })}
      </div>

      <button className="sideBar-button" onClick={handleLogout}>
        {buttonText}
      </button>
    </div>
  );
};

export default SideBar;
