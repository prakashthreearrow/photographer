import validator from "validator";

function validateLogin(data, t) {
  const errors = {};
  if (validator.isEmpty(data.email.trim()))
    errors.email = t("EMAIL_REQUIRED")
  else if (!validator.isEmail(data.email))
    errors.email = t("VALID_EMAIL_ADDRESS_REQUIRED")
  if (validator.isEmpty(data.password.trim()))
    errors.password = t("PASSWORD_REQUIRED")
  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default validateLogin;