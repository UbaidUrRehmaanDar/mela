import React from 'react';

export default function Input({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  options,
  required,
  className = '',
  ...props
}) {
  const id = `input-${name}`;
  return (
    <div className={`input-group ${className}`.trim()}>
      {label && <label htmlFor={id}>{label}</label>}
      {type === 'select' && options ? (
        <select id={id} name={name} value={value} onChange={onChange} required={required} {...props}>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea id={id} name={name} placeholder={placeholder} value={value} onChange={onChange} required={required} {...props} />
      ) : (
        <input id={id} name={name} type={type} placeholder={placeholder} value={value} onChange={onChange} required={required} {...props} />
      )}
    </div>
  );
}
