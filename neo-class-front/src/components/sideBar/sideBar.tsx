// sideBar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./sideBar.css";

interface NavItem {
  icon: React.ReactNode; // agora é um componente React
  text: string;
  href: string;
}

interface SideBarProps {
  buttonText: string;
  navItems: NavItem[];
}

const SideBar: React.FC<SideBarProps> = ({ buttonText, navItems }) => {
  const location = useLocation();

  return (
    <div className="sideBar">
      <div className="sideBar-header">
        <img src="/image/neoClassLogo.png" alt="Logo" />
      </div>

      <div className="sideBar-nav">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={index}
              to={item.href}
              className={`sideBar-nav-item ${isActive ? "active" : ""}`}
            >
              {item.icon}
              <span>{item.text}</span>
            </Link>
          );
        })}
      </div>

      <button className="sideBar-button">{buttonText}</button>
    </div>
  );
};

export default SideBar;
