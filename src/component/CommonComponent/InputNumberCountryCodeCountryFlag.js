import React, {useState} from "react";
import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form";
import PhoneInput, {
    parsePhoneNumber,
    getCountryCallingCode
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import flags from 'react-phone-number-input/flags'

const InputNumberCountryCodeCountryFlag = ({
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
  const [countryCode, setCountryCode] = useState("React!!!");
  const [mobile, setMobile] = useState("");

  const {
    control,
    formState: { errors },
    handleSubmit
} = useForm();

  return (
    <>
      <div className={`${className} position-relative custom-placeholder2 tel-input-two`} data-placeholder={label}>
        <Controller
                name="cellphone"
                rules={{
                    validate: {
                        isValid: (value) => {
                            if (value) {
                                const callingCode = getCountryCallingCode(countryCode);
                                if (!new RegExp(`^\\+${callingCode}$`).test(value)) {
                                    return !!parsePhoneNumber(value);
                                }
                            }
                            return true;
                        }
                    }
                }}
                control={control}
                render={({ field }) => (
                    <PhoneInput
                        {...field}
                        onCountryChange={(v) => setCountryCode(v)}
                        value={value}
                        disabled={disabled}
                        onChange={onChange}
                        limitMaxLength={true}
                        international={true}
                        defaultCountry="DE"
                        flags={flags}
                    />
                )}
            />
      </div>
      {error && <div className={`invalid`}>{error}</div>}
    </>
  );
};

InputNumberCountryCodeCountryFlag.propTypes = {
  name: PropTypes.string,
  country: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  error: PropTypes.string,
  isRequired: PropTypes.bool,
};

export default InputNumberCountryCodeCountryFlag;