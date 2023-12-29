
import React from "react";
import Select, { components as Components } from 'react-select';
import PropTypes from "prop-types";
import downIndicator from "../../assets/images/downIndicator.png";

const SearchableSelect = ({
  className,
  options,
  disabled,
  onChange,
  error,
  value,
  type,
  isClearable,
  label,
  isRequired,
  isFlag,
}) => {
  const tmpValue =
    type === "string"
      ? options?.find((itm) => itm.value === value)
      : options?.find((itm) => itm.value === parseInt(value));


  const DropdownIndicator = props => {
    return (
      <Components.DropdownIndicator {...props}>
        <img src={downIndicator} alt="downIndicator" />
      </Components.DropdownIndicator>
    );
  };

  return (
    <>
      {!isFlag && (
        <div>
          {isRequired && <span className="astric">&#42;</span>}
        </div>
      )}
      <div className="position-relative custom-placeholder-role" data-placeholder={label}>
        <Select
          className={`${className} search-option-one ${error ? "error" : ""}`}
          classNamePrefix="react-select"
          value={tmpValue || ""}
          isDisabled={disabled}
          isSearchable={true}
          options={options}
          onChange={onChange}
          isClearable={isClearable}
          components={{
            DropdownIndicator,
            IndicatorSeparator: () => null,
          }}
        />
        {error && <div className="invalid">{error}</div>}
      </div>
    </>
  );
};

SearchableSelect.propTypes = {
  className: PropTypes.string,
  value: PropTypes.any,
  options: PropTypes.array,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  error: PropTypes.string,
  type: PropTypes.string,
  isClearable: PropTypes.bool,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  isFlag: PropTypes.bool,
};

export default SearchableSelect;