import validator from "validator";

function validateSignUpEditor(data, t) {
    const errors = {};
    if (validator.isEmpty(data.first_name.trim()))
        errors.first_name = t("FIRST_NAME_REQUIRED")
    if (validator.isEmpty(data.last_name.trim()))
        errors.last_name = t("LAST_NAME_REQUIRED")
    if (validator.isEmpty(data.location.trim()))
        errors.location = t("LOCATION_REQUIRED")
    if (data.country_id?.length === 0) {
        errors.country_id = t("COUNTRY_REQUIRED")
    } else if (data.country_id === undefined) {
        errors.country_id = t("COUNTRY_REQUIRED")
    }else if (data.country_id?.label === undefined) {
        errors.country_id = t("COUNTRY_REQUIRED")
    }
    if (data.time_zone?.length === 0) {
        errors.time_zone = t("TIME_ZONE_REQUIRED")
    } else if (data.time_zone === undefined) {
        errors.time_zone = t("TIME_ZONE_REQUIRED")
    }
    if (validator.isEmpty(data.showreel_link.trim()))
        errors.showreel_link = "Please enter showreel link."
    if (data.editing_suite?.length === 0) {
        errors.editing_suite = "Please select editing suite."
        if (data.image_editor.length === 0)
        errors.image_editor = t("IMAGE_EDITOR_REQUIRED")
        if (data.video_editor.length === 0)
        errors.video_editor = t("VIDEO_EDITOR_REQUIRED")
    }else{
        if (data.editing_suite?.value === 1) {
            if (data.image_editor.length === 0)
            errors.image_editor = t("IMAGE_EDITOR_REQUIRED")
        }else if(data.editing_suite?.value === 2){
            if (data.video_editor.length === 0)
            errors.video_editor = t("VIDEO_EDITOR_REQUIRED")
        }
    }
    
    if (data.mobile === undefined) {
        errors.mobile = t("MOBILE_REQUIRED")
    } else {
        if (data.mobile.length >= 20)
            errors.mobile = t("MOBILE_MAX_REQUIRED")
        if (validator.isEmpty(data.mobile))
            errors.mobile = t("MOBILE_REQUIRED")
    }

    return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default validateSignUpEditor;