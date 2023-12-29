import validator from "validator";

function validateSignUpNext5(data, t) {
    const errors = {};
    if (data.maximum_commuting_id === '5' && validator.isEmpty(data.maximum_commuting_other))
        errors.maximum_commuting_other = t("MAX_COMMUTING_OTHER_REQUIRED")
    if (validator.isEmpty(data.maximum_commuting_id))
        errors.maximum_commuting_id = t("MAX_COMMUTING_ID_REQUIRED")
    return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default validateSignUpNext5;