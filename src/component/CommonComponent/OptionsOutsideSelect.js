import Select, { components as Components } from "react-select";
import styled from "styled-components";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import downIndicator from "../../assets/images/downIndicator.png";
library.add(faCaretDown);

const ValuesContainer = styled.div`
  margin-top: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

const Value = styled.div`
  padding: 0.3rem 0.5rem 0.3rem 0.5rem;
  margin: 0 0.55rem 0.55rem 0;
  font-size: 0.75rem;
  color: black;
  background-color: #FFFFFF;
  user-select: none;
  border-radius:15px;
`;

const XButton = styled.button`
  all: unset;
  margin-left: 0.3rem;
  color: black;
  transition: fill 0.15s ease-in-out;
  cursor: pointer !important;
  &:hover {
    color: #bb392d;
  }
  &:focus {
    color: #c82f21;
  }
`;

const customStyles = {
  control: base => ({
    ...base,
    height: 78,
    minHeight: 67,
  })
};

const DropdownIndicator = props => {
  return (
    <Components.DropdownIndicator {...props}>
      <img src={downIndicator} alt="downIndicator" />
    </Components.DropdownIndicator>
  );
};

const OptionsOutsideSelect = (props) => {
  const { isMulti, value, onChange, placeholder, error, isLoading } = props;
  const handleRemoveValue = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!onChange) return;
    const { value: buttonName } = e.currentTarget;
    let buttonValue = undefined;

    if (typeof value[0]?.value === 'number') {
      buttonValue = parseInt(buttonName);
    } else {
      buttonValue = buttonName;
    }

    const removedValue = value.find((val) => val.value === buttonValue);
   
    if (!removedValue) return;
 
    onChange(
      value.filter((val) => val.value !== buttonValue),
      { action: "remove-value", removedValue }
    );
  };

  return (
    <div>
      <Select
        isLoading={isLoading}
        className="select-option-pg"
        theme={theme => ({
          ...theme,
          colors: {
            ...theme.colors,
            neutral50: 'black',  // Placeholder color
          },
        })} styles={customStyles} placeholder={placeholder} isClearable={true} components={{
          IndicatorSeparator: () => null, DropdownIndicator,
        }}
        {...props} controlShouldRenderValue={!isMulti} />
      {error && <div className="invalid">{error}</div>}
      <ValuesContainer>
        {isMulti
          ? value.map((val, index) => (
            <Value key={index}>
              {val.label}
              <XButton type="button" value={val.value} onClick={(e) =>{
              
                handleRemoveValue(e)
              }}>
                ✕
              </XButton>
            </Value>
          ))
          : null}
      </ValuesContainer>
    </div>
  );
};

export default OptionsOutsideSelect;