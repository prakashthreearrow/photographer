
import React from "react";
import PropTypes from "prop-types";

const Input = ({
  autoComplete,
  name,
  value,
  onChange,
  placeholder,
  type,
  className,
  classNamePlaceHolder,
  error,
  showPassword,
  setShowPassword,
  showIcon,
  disabled,
  min,
  max,
  pattern,
  onKeyUp,
  maxLength,
  onKeyDown,
  label,
  isRequired,
}) => {

  return (
    <>
      <div>
        {isRequired && <span className="astric">&#42;</span>}
      </div>
      <div className={`${classNamePlaceHolder} position-relative custom-placeholder `} data-placeholder={label}>
        <input
          autoComplete={autoComplete}
          type={type}
          className={`form-control ${className} ${error ? "error" : ""}`}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          min={min}
          max={max}
          pattern={pattern}
          onKeyUp={onKeyUp}
          maxLength={maxLength}
          onKeyDown={onKeyDown}
        />
        {showIcon && (
          <div className="password-visibility">
            <i
              className={`${showPassword ? "fa fa-eye-slash" : "fa fa-eye"}`}
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        )}
      </div>
      {error && <div className="invalid">{error}</div>}
    </>
  );
};

Input.propTypes = {
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.any,
  showPassword: PropTypes.bool,
  setShowPassword: PropTypes.func,
  showIcon: PropTypes.bool,
  disabled: PropTypes.bool,
  min: PropTypes.string,
  max: PropTypes.string,
  pattern: PropTypes.string,
  onKeyUp: PropTypes.func,
  maxLength: PropTypes.any,
  onKeyDown: PropTypes.func,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
};

export default Input;