import validator from "validator";

function validateEditProfile(data, t) {

  const errors = {};
  if (validator.isEmpty(data.first_name.trim()))
    errors.first_name = t("FIRST_NAME_REQUIRED")
  if (validator.isEmpty(data.last_name.trim()))
    errors.last_name = t("LAST_NAME_REQUIRED")
  if (validator.isEmpty(data.email.trim()))
    errors.email = t("EMAIL_REQUIRED")
  else if (!validator.isEmail(data.email))
    errors.email = t("VALID_EMAIL_ADDRESS_REQUIRED")

  if (data.mobile === undefined) {
    errors.mobile = t("MOBILE_REQUIRED")
  } else {
    if (data.mobile.length >= 20)
      errors.mobile = t("MOBILE_MAX_REQUIRED")
    if (validator.isEmpty(data.mobile))
      errors.mobile = t("MOBILE_REQUIRED")
  }

  if (validator.isEmpty(data.location.trim()))
    errors.location = t("LOCATION_REQUIRED")
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
  if (data.camera_id.length === 0)
    errors.camera_id = t("CAMERA_ID_REQUIRED")
  if (data.lens_id.length === 0)
    errors.lens_id = t("LENS_ID_REQUIRED")
  if (data.speed_light_id.length === 0)
    errors.speed_light_id = t("SPEED_LIGHT_ID_REQUIRED")
  if (data.tripod_id.length === 0)
    errors.tripod_id = t("TRIPODS_ID_REQUIRED")
  if (data.strobe_id.length === 0)
    errors.strobe_id = t("STROBE_ID_REQUIRED")
  if (data.specialize_item_id.length === 0)
    errors.specialize_item_id = t("SPECIALIZED_ITEM_ID_REQUIRED")
  if (data.smartphone_id.length === 0)
    errors.smartphone_id = t("SMART_PHONE_ID_REQUIRED")
  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default validateEditProfile;