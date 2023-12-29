import React from "react";
import PropTypes from "prop-types";

const Button = ({ type, className, onClick, text, disabled }) => {
  return (
    <>
      <button
        type={type}
        className={`${className} btn-common cursor-pointer`}
        onClick={onClick}
        disabled={disabled}
      >
        {text}
      </button>
    </>
  );
};

Button.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  text: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;