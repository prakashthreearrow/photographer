import React from "react";

function Switch(props) {
  const { text } = props;
  return (
    <label class="switch-wrapper">
      <input type="checkbox" />
      {text && <i className="text">{text}</i>}
      <span class="slider"></span>
    </label>
  );
}

export default Switch;
