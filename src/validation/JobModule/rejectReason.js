import validator from "validator";

function validateLogin(data, t) {
  const errors = {};
  if (validator.isEmpty(data.reason.trim()))
    errors.reason = "Please enter the reason"
  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default validateLogin;