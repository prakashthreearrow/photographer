import React from "react";
import PropTypes from "prop-types";
import 'react-phone-input-2/lib/style.css'
import IntlTelInput from 'react-bootstrap-intl-tel-input'

const InputGroupCountryAndCountryCode = ({
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
      <div className={`${className} position-relative custom-placeholder2 tel-input`} data-placeholder={label}>
        {/* <div className={`position-relative custom-placeholder phone-input`} data-placeholder={label}> */}
        <IntlTelInput
          preferredCountries={preferredCountries}
          value={value}
          disabled={disabled}
          maxLengthMessage="7"
          defaultCountry={defaultCountry}
          defaultValue={defaultValue}
          onChange={onChange}
        />
      </div>
      {error && <div className={`invalid`}>{error}</div>}
    </>
  );
};

InputGroupCountryAndCountryCode.propTypes = {
  name: PropTypes.string,
  country: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.string,
  isRequired: PropTypes.bool,
};

export default InputGroupCountryAndCountryCode;