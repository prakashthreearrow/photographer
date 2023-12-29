import validator from "validator";

function validateResetPassword(data, t) {
  const errors = {};

  if (validator.isEmpty(data.password.trim()))
    errors.password = t("PASSWORD_REQUIRED")
  if (validator.isEmpty(data.confirm_password.trim()))
    errors.confirm_password = t("CONFIRM_PASSWORD_REQUIRED")
  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default validateResetPassword;
