import validator from "validator";

function validateSignUpClient1(data, t) {
    const errors = {};
    if (validator.isEmpty(data.position.trim()))
        errors.position = t("POSITION_REQUIRED")
    if (validator.isEmpty(data.company_name.trim()))
        errors.company_name = t("COMPANY_NAME_REQUIRED")
    if (validator.isEmpty(data.vat_number.trim()))
        errors.vat_number = t("VAT_NUMBER_REQUIRED")
    if (typeof data.company_country === "object") {
        if ((validator.isEmpty(data?.company_country?.value)))
            errors.company_country = t("COUNTRY_REQUIRED")
    } else {
        if ((validator.isEmpty(data.company_country)))
            errors.company_country = t("COUNTRY_REQUIRED")
    }
    if (validator.isEmpty(data.company_address.trim()))
        errors.company_address = t("COMPANY_ADDRESS_REQUIRED")
    if (validator.isEmpty(data.company_mobile))
        errors.company_mobile = t("MOBILE_REQUIRED")
    if (data.company_mobile.length >= 20)
        errors.company_mobile = t("MOBILE_MAX_REQUIRED")
    if (typeof data.sector === "object") {
        if (validator.isEmpty(data?.sector?.value?.toString()))
            errors.sector = t("SECTOR_REQUIRED")
    } else {
        if (validator.isEmpty(data.sector))
            errors.sector = t("SECTOR_REQUIRED")
    }
    if (typeof data.team_member === "object") {
        if (validator.isEmpty(data?.team_member?.value))
            errors.team_member = t("TEAM_MEMBER_REQUIRED")
    } else {
        if (validator.isEmpty(data.team_member))
            errors.team_member = t("TEAM_MEMBER_REQUIRED")
    }
    if (data.is_confirmed === false || data.is_confirmed === '')
        errors.is_confirmed = t("CONFIRM_REQUIRED")
    return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default validateSignUpClient1;