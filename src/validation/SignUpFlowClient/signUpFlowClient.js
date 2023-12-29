import validator from "validator";

function validateSignUpClient(data, t) {
    const errors = {};
    if (validator.isEmpty(data.first_name.trim()))
        errors.first_name = t("FIRST_NAME_REQUIRED")
    if (validator.isEmpty(data.last_name.trim()))
        errors.last_name = t("LAST_NAME_REQUIRED")   
    if (typeof data.country_id === "object") {
        if ((validator.isEmpty(data?.country_id?.value)))
            errors.country_id = t("COUNTRY_REQUIRED")
    } else {
        if ((validator.isEmpty(data.country_id)))
            errors.country_id = t("COUNTRY_REQUIRED")
    }
    if (typeof data.time_zone === "object") {
        if (validator.isEmpty(data?.time_zone?.value))
            errors.time_zone = t("TIME_ZONE_REQUIRED")
    } else {
        if (validator.isEmpty(data.time_zone))
            errors.time_zone = t("TIME_ZONE_REQUIRED")
    }
    if (data.mobile.length >= 20)
        errors.mobile = t("MOBILE_MAX_REQUIRED")
    if (validator.isEmpty(data.mobile))
        errors.mobile = t("MOBILE_REQUIRED")
    if (data.company_details === false || data.company_details === '')
        errors.company_details = t("COMPANY_DETAILS_REQUIRED")
    return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default validateSignUpClient;