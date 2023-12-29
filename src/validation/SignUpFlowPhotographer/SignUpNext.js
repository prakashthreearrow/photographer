function validateSignUpNext(data, t) {
    const errors = {};
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

export default validateSignUpNext;