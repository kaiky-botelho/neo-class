import React from "react";
import './input.css';

interface InputProps {
  label: string;
  name?: string; 
  type: string;
  placeholder?: string;
  value: string;
  readonly?: boolean;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  placeholder,
  value,
  name,
  readonly = false,
  required = false,
  onChange,
}) => {
  return (
    <div className="input-container">
      {label && <label className="input-label">{label}</label>}
      <input
        className="input"
        type={type}
        placeholder={placeholder}
        value={value}
        name={name}
        onChange={onChange}
        readOnly={readonly}
        required={required}
      />
    </div>
  );
};

export default Input;
