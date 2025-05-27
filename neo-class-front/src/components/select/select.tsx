interface SelectProps {
  label: string;
  name: string; // ✅ ADICIONADO
  value: string;
  options: string[];
  title: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  title,
  required = false,
}) => {
  return (
    <div className="input-container">
      {label && <label className="input-label">{label}</label>}
      <select
        className="input"
        name={name} 
        value={value}
        onChange={onChange}
        required={required}
      >
        <option value="">Selecione {title}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
