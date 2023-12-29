import validator from "validator";

function validateSignUpNext4(data, t) {
    const errors = {};
    if (validator.isEmpty(data.month_1))
        errors.month_1 = t("MONTH_1_REQUIRED")
    if (validator.isEmpty(data.month_2))
        errors.month_2 = t("MONTH_2_REQUIRED")
    if (validator.isEmpty(data.month_3))
        errors.month_3 = t("MONTH_3_REQUIRED")
    return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default validateSignUpNext4;