import validator from "validator";

function validateSignUpNext2(data, t) {
    const errors = {};
    if (data.car_access === '2' && validator.isEmpty(data.car_access_other))
        errors.car_access_other = t("CAR_ACCESS_OTHER_REQUIRED")
    if (validator.isEmpty(data.car_access))
        errors.car_access = t("CAR_ACCESS_REQUIRED")
    return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default validateSignUpNext2;