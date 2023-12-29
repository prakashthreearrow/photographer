import React, { useState } from "react";
import PropTypes from "prop-types";
import tagClose from "../../assets/images/input-close-tag.png";

const MultipleInputTags = ({
  className,
  tags,
  setTags,
  setRemoveTags,
  label,
  error,
  handleKeyDown,
  onChange,
  removeTagFlag
}) => {

  const removeTag = (index) => {
    setTags(tags.filter((el, i) => i !== index));
    if (removeTagFlag) {
      setRemoveTags(tags.filter((el, i) => i !== index))
    }

  }
  return (
    <>
      <div className={`${className} position-relative custom-placeholder `} data-placeholder={label}>
        <div className="tags-input-container">
          {tags.map((tag, index) => {
            return (
              <div className="tag-item" key={index}>
                <span className="text">{tag}</span>
                <span className="close" onClick={() => removeTag(index)}>X</span>
                {/* <img src={tagClose} className="close" onClick={() => removeTag(index)} alt="logo" /> */}
              </div>
            )
          })}
          <input onKeyDown={handleKeyDown} onChange={onChange} type="text" className="tags-input" />
        </div>
      </div>
      {error && <div className="invalid">{error}</div>}

    </>
  );
};

MultipleInputTags.propTypes = {
  // className: PropTypes.string,
  // tags: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  // setTags: PropTypes.func,
};

export default MultipleInputTags;