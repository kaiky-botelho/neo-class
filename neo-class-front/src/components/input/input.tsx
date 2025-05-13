import React from "react";
import './input.css';

interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  placeholder,
}) => {
  return (
    <div className="input-container">
      {label && <label className="input-label">{label}</label>}
      <input
        className="input"
        type={type}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
