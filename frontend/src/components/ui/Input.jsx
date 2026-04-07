import React from 'react';

export default function Input({ label, type = 'text', options, ...props }) {
  return (
    <div className="input-group">
      {label && <label>{label}</label>}
      {type === 'textarea' ? (
        <textarea rows="4" {...props}></textarea>
      ) : type === 'select' ? (
        <select {...props}>
          {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input type={type} {...props} />
      )}
    </div>
  );
}