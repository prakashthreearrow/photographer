import validator from "validator";

function validateSignUpClient3(data, t) {
    const errors = {};
    if (validator.isEmpty(data.first_name.trim()))
        errors.first_name = t("FIRST_NAME_REQUIRED");
    if (validator.isEmpty(data.last_name.trim()))
        errors.last_name = t("LAST_NAME_REQUIRED");
    if (typeof data.country_id === "object") {
        if (data?.country_id?.length === 0)
            errors.country_id = t("COUNTRY_REQUIRED");
    } else {
        if ((validator.isEmpty(data.country_id)))
            errors.country_id = t("COUNTRY_REQUIRED");
    }
    if (typeof data.time_zone === "object") {
        if (data?.time_zone?.length === 0)
            errors.time_zone = t("TIME_ZONE_REQUIRED");
    } else {
        if (validator.isEmpty(data.time_zone))
            errors.time_zone = t("TIME_ZONE_REQUIRED");
    }
    if (data.mobile === undefined) {
        errors.mobile = t("MOBILE_REQUIRED");
    } else {
        if (data.mobile.length >= 20)
            errors.mobile = t("MOBILE_MAX_REQUIRED");
        if (validator.isEmpty(data.mobile))
            errors.mobile = t("MOBILE_REQUIRED");
    }

    if (validator.isEmpty(data.position.trim()))
        errors.position = t("POSITION_REQUIRED");
    return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default validateSignUpClient3;