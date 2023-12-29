import React from "react";
import Select, { components as Components } from 'react-select';
import PropTypes from "prop-types";
import downIndicator from "../../assets/images/downIndicator.png";

const SelectDropDown = ({
    className,
    options,
    disabled,
    placeholder,
    onChange,
    error,
    value,
    name,
    label,
    defaultValue,
    isSearchable,
    loading
}) => {
    const customStyles = {
        option: (styles, state) => ({
            ...styles,
            cursor: "pointer",
            backgroundColor: state.isSelected ? "#deeafe" : styles.backgroundColor,
            textAlign: "left",
            innerHeight: 100,
            color: "#3F3F3F",
            "&:hover": {
                backgroundColor: "#F6F6F6",
            }
        }),
        control: (styles) => ({
            ...styles,
            cursor: "pointer",
            height: 78
        }),
    };

    const DropdownIndicator = props => {
        return (
            <Components.DropdownIndicator {...props}>
                <img src={downIndicator} alt="downIndicator" />
            </Components.DropdownIndicator>
        );
    };

    return (
        <div className={`${className} position-relative custom-placeholder-role `} data-placeholder={label}>
            <Select
                className={`select-format`}
                onChange={onChange}
                value={value}
                isDisabled={disabled}
                styles={customStyles}
                isSearchable={isSearchable}
                options={options}
                isLoading={loading}
                components={{
                    DropdownIndicator,
                    IndicatorSeparator: () => null,
                }}

            />
            {error && <div className="invalid">{error}</div>}
        </div>
    );
};

SelectDropDown.propTypes = {
    className: PropTypes.string,
    // value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    options: PropTypes.array,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    error: PropTypes.string,
    name: PropTypes.string,
    label: PropTypes.string,
};

export default SelectDropDown;