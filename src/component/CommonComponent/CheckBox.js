import React from "react";
import PropTypes from "prop-types";

const CheckBox = ({ name, className, id, label, onChange, checked, error }) => {
  return (
    <>
      <input
        type="checkbox"
        className={`${className} checkbox-common`}
        name={name}
        checked={checked}
        onChange={onChange}
        id={id}
      />
      <label className="font-size-10 marginb-20" htmlFor={id}>
        {label}
      </label>
      {error && <div className="invalid">{error}</div>}
    </>
  );
};

CheckBox.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  checked: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  error: PropTypes.any
};

export default CheckBox;