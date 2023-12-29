import React from "react";
import Select, { components as Components } from "react-select";
import PropTypes from "prop-types";
import downIndicator from "../../assets/images/downIndicator.png";

const MultipleSearchSelect = ({
  className,
  options,
  disabled,
  onChange,
  error,
  value,
  isClearable,
  isRequired,
  label,
}) => {
  const DropdownIndicator = props => {
    return (
      <Components.DropdownIndicator {...props}>
        <img src={downIndicator} alt="downIndicator" />
      </Components.DropdownIndicator>
    );
  };

  const customStyles = {
    control: base => ({
      ...base,
      height: 85,
      minHeight: 67,
    })
  };

  const tmpArray = [];
  value &&
    value.length > 0 &&
    value.map((itm) => {
      const find = options.find((item) => item.value === itm);
      tmpArray.push(find);
    });
  return (
    <>
      <div className={`${className} position-relative custom-placeholder-role `} data-placeholder={label}>
        <Select
          components={{
            IndicatorSeparator: () => null, DropdownIndicator
          }}
          styles={customStyles}
          isMulti
          className={`${className} ${error ? "error" : ""}`}
          classNamePrefix="react-select"
          value={tmpArray}
          isDisabled={disabled}
          isSearchable={true}
          options={options}
          onChange={onChange}
          isClearable={isClearable}
        />
        {error && <div className="invalid">{error}</div>}
      </div>
    </>
  );
};

MultipleSearchSelect.propTypes = {
  className: PropTypes.string,
  value: PropTypes.any,
  options: PropTypes.array,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  error: PropTypes.string,
  type: PropTypes.string,
  isClearable: PropTypes.bool,
  isRequired: PropTypes.bool,
  label: PropTypes.string,
};

export default MultipleSearchSelect;