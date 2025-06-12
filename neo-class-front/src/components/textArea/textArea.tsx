// src/components/textArea/TextArea.tsx
import React from "react";
import './textArea.css';

interface TextAreaProps {
  label?: string;
  name?: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  cols?: number;
  disabled?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder = "Digite aqui...",
  rows = 4,
  cols = 50,
  disabled = false,
}) => {
  return (
    <div className="text-area-container">
      {label && <label className="text-area-label" htmlFor={name}>{label}</label>}
      <textarea
        id={name}
        name={name}
        className="text-area"
        value={value}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        cols={cols}
        disabled={disabled}
      />
    </div>
  );
};

export default TextArea;
