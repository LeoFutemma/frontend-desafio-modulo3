import React from "react";
import "./styles.css";

const Input = ({ label, type, value, onChange }) => {
  return (
    <div className="input">
      <label className="input__label">{label}</label>
      <input
        style={{
          fontSize: "16px",
          border: "1px solid #555555",
          borderRadius: "5px",
          height: "63px",
          padding: "10px",
        }}
        className="input__content"
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
