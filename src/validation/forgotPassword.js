import validator from "validator";

function validateForgotPassword(data) {
  const errors = {};
  if (validator.isEmpty(data.email.trim()))
    errors.email = "Please enter the email.";
  else if (!validator.isEmail(data.email))
    errors.email = "Please enter valid email address.";
  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default validateForgotPassword;