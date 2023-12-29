import { CLIENT_REGISTER, CLIENT_REGISTER_SUCCESS, CLIENT_REGISTER_FAILURE } from "../types";

export const clientRegister = (payload) => ({
    type: CLIENT_REGISTER,
    payload,
});

export const clientRegisterSuccess = () => ({
    type: CLIENT_REGISTER_SUCCESS,
});

export const clientRegisterFailure = () => ({
    type: CLIENT_REGISTER_FAILURE,
});