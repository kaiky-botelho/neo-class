import React from "react";
import { Link } from "react-router-dom";

import "./linkButtons.css";

interface LinkButtonProps {
  text: string;
  image: string;
  href: string;
  className?: string; 
}

const LinkButton: React.FC<LinkButtonProps> = ({
  text,
  image,
  href,
  className = ""         
}) => {
  return (
    <Link
      to={href}
      className={`link-button ${className}`.trim()} >
      <img src={image} className="link-button-image" alt={text} />
      <span className="link-button-text">{text}</span>
    </Link>
  );
};

export default LinkButton;
