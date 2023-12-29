import { PHOTOGRAPHER_REGISTER, PHOTOGRAPHER_REGISTER_SUCCESS, PHOTOGRAPHER_REGISTER_FAILURE } from "./../types";

export const photographerRegister = (payload) => ({
    type: PHOTOGRAPHER_REGISTER,
    payload,
});

export const photographerRegisterSuccess = () => ({
    type: PHOTOGRAPHER_REGISTER_SUCCESS,
});

export const photographerRegisterFailure = () => ({
    type: PHOTOGRAPHER_REGISTER_FAILURE,
});