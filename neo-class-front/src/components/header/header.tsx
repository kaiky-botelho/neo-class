import React from "react";
import './header.css';

interface HeaderProps {
    title: string;
    }

const Header: React.FC<HeaderProps> = ({ 
    title 
}) => {
    return (
        <header className="header-bg">
            <div className="container header">
            <img src="/image/neoClassLogo.png" alt="Logo" className="header-logo" />
            <h1 className="header-title">{title}</h1>
            </div>
        </header>
    )
}

export default Header;