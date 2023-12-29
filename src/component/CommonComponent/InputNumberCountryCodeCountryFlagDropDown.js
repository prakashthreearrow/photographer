import React from "react";
import PropTypes from "prop-types";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

const InputNumberCountryCodeCountryFlagDropDown = ({
  name,
  value,
  onChange,
  placeholder,
  type,
  error,
  label,
  isRequired,
  preferredCountries,
  defaultCountry,
  defaultValue,
  className,
  disabled

}) => {
  return (
    <>
      <div className={`${className} position-relative custom-placeholder2 tel-input-two tel-input-three`} data-placeholder={label}>
        <PhoneInput
          country={'cl'}
          value={value}
          disabled={disabled}
          onChange={onChange}
          // defaultCountry="CL"
        />
      </div>
      {error && <div className={`invalid`}>{error}</div>}
    </>
  );
};

InputNumberCountryCodeCountryFlagDropDown.propTypes = {
  name: PropTypes.string,
  country: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.string,
  isRequired: PropTypes.bool,
};

export default InputNumberCountryCodeCountryFlagDropDown;