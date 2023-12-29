import React from "react";
import PropTypes from "prop-types";

const Input = (props) => <input {...props} />;

const InputGroup = ({
  name,
  value,
  onChange,
  placeholder,
  type,
  className,
  error,
  disabled,
  min,
  max,
  pattern,
  onKeyUp,
  maxLength,
  prepend,
  prependText,
  append,
  appendText,
  label,
  isRequired,
}) => {
  const commonProps = {
    name,
    className: `form-control ${className} ${error ? "error" : ""}`,
    value,
    onChange,
    placeholder,
    type,
    disabled,
    min,
    max,
    pattern,
    onKeyUp,
    maxLength,
  };
  return (
    <>
      <div>
        {isRequired && <span className="astric">&#42;</span>}
        <label htmlFor={name} className="col-form-label">
          {label}
        </label>
      </div>
      <div className="position-relative">
        {prepend ? (
          <div className="d-flex">
            <div className="input-group-prepend">
              <span className="input-group-text prepend" id="basic-addon1">
                {prependText}
              </span>
            </div>
            <Input {...commonProps} />
          </div>
        ) : (
          append && (
            <div className="d-flex">
              <Input {...commonProps} />
              <div className="input-group-append">
                <span className="input-group-text append" id="basic-addon1">
                  {appendText}
                </span>
              </div>
            </div>
          )
        )}
      </div>
      {error && <div className={`invalid`}>{error}</div>}
    </>
  );
};

InputGroup.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  min: PropTypes.string,
  max: PropTypes.string,
  pattern: PropTypes.string,
  onKeyUp: PropTypes.func,
  maxLength: PropTypes.string,
  prepend: PropTypes.bool,
  prependText: PropTypes.string,
  append: PropTypes.bool,
  appendText: PropTypes.string,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
};

export default InputGroup;