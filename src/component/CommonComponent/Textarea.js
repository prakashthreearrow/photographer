import React from "react";
import PropTypes from "prop-types";

const Textarea = ({
  name,
  value,
  onChange,
  placeholder,
  className,
  error,
  disabled,
  isRequired,
  label,
}) => {
  return (
    <>
      <div>
        {isRequired && <span className="astric">&#42;</span>}
      </div>
      <div className={`position-relative custom-placeholder `} data-placeholder={label}>
        <textarea
          className={`form-control text-area ${className} ${
            error ? "error" : ""
          }`}
          name={name}
          placeholder={placeholder}
          value={value}
          rows="3"
          cols="50"
          onChange={onChange}
          maxLength="255"
          disabled={disabled}
        />
      </div>
      {error && <div className="invalid">{error}</div>}
    </>
  );
};

Textarea.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
};

export default Textarea;
