import validator from "validator";

function validateSignUp(data, t) {
console.log("data",data)
    const errors = {};
    if (validator.isEmpty(data.first_name.trim()))
        errors.first_name = t("FIRST_NAME_REQUIRED")
    if (validator.isEmpty(data.last_name.trim()))
        errors.last_name = t("LAST_NAME_REQUIRED")
    if (validator.isEmpty(data.email.trim()))
        errors.email = t("EMAIL_REQUIRED")
    else if (!validator.isEmail(data.email))
        errors.email = t("VALID_EMAIL_ADDRESS_REQUIRED")
    if (validator.isEmpty(data.location.trim()))
        errors.location = t("LOCATION_REQUIRED")
    if (data.mobile === undefined) {
        errors.mobile = t("MOBILE_REQUIRED")
    } else {
        if (data.mobile.length >= 20)
            errors.mobile = t("MOBILE_MAX_REQUIRED")
        if (validator.isEmpty(data.mobile))
            errors.mobile = t("MOBILE_REQUIRED")
    }
    if (data.country_id?.length === 0) {
        errors.country_id = t("COUNTRY_REQUIRED")
    } else if (data.country_id === undefined) {
        errors.country_id = t("COUNTRY_REQUIRED")
    } else if (data.country_id?.label === undefined) {
        errors.country_id = t("COUNTRY_REQUIRED")
    }
    if (data.time_zone?.length === 0) {
        errors.time_zone = t("TIME_ZONE_REQUIRED")
    } else if (data.time_zone === undefined) {
        errors.time_zone = t("TIME_ZONE_REQUIRED")
    }
    if (validator.isEmpty(data.work_email.trim()))
        errors.work_email = t("WORK_EMAIL_REQUIRED")
    if (data.category_id.length === 0)
        errors.category_id = t("CATEGORY_ID_REQUIRED")
    if (data.confirm === false || data.confirm === '')
        errors.confirm = t("CONFIRM_REQUIRED")
    return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default validateSignUp;