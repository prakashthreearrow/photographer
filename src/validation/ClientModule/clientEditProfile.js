import validator from "validator";

function validateEditProfile(data, t, company_details, parent_id) {

  const errors = {};
  if (validator.isEmpty(data.first_name.trim()))
    errors.first_name = t("FIRST_NAME_REQUIRED")
  if (validator.isEmpty(data.last_name.trim()))
    errors.last_name = t("LAST_NAME_REQUIRED")
  if (data.mobile === undefined) {
    errors.mobile = t("MOBILE_REQUIRED")
  } else {
    if (data.mobile.length >= 20)
      errors.mobile = t("MOBILE_MAX_REQUIRED")
    if (validator.isEmpty(data.mobile))
      errors.mobile = t("MOBILE_REQUIRED")
  }

  if (typeof data.country_id === "object") {
    if ((validator.isEmpty(data?.country_id?.value)))
      errors.country_id = t("COUNTRY_REQUIRED")
  } else {
    if ((validator.isEmpty(data.country_id)))
      errors.country_id = t("COUNTRY_REQUIRED")
  }
  if (data.notification.length === 0)
    errors.notification = t("NOTIFICATION_REQUIRED")

  if (company_details === 1) {
    if (validator.isEmpty(data.position.trim()))
      errors.position = t("POSITION_REQUIRED")

    if (validator.isEmpty(data.company_name.trim()))
      errors.company_name = t("COMPANY_NAME_REQUIRED")

    if (typeof data.sector === "object") {
      if (data?.sector?.value === undefined)
        errors.sector = t("SECTOR_REQUIRED")
    } else {
      if (validator.isEmpty(data.sector))
        errors.sector = t("SECTOR_REQUIRED")
    }

    if (validator.isEmpty(data.company_address.trim()))
      errors.company_address = t("COMPANY_ADDRESS_REQUIRED")

    if (validator.isEmpty(data.company_mobile))
      errors.company_mobile = t("MOBILE_REQUIRED")
    if (validator.isEmpty(data.vat_number.trim()))
      errors.vat_number = t("VAT_NUMBER_REQUIRED")
  }

  if (typeof data.time_zone === "object") {
    if (validator.isEmpty(data?.time_zone?.value))
      errors.time_zone = t("TIME_ZONE_REQUIRED")
  } else {
    if (validator.isEmpty(data.time_zone))
      errors.time_zone = t("TIME_ZONE_REQUIRED")
  }


  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default validateEditProfile;