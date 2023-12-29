import { CLIENT_LOGIN, CLIENT_LOGIN_SUCCESS, CLIENT_LOGIN_FAILURE } from "../types";

export const clientLogin = (payload) => ({
    type: CLIENT_LOGIN,
    payload,
});

export const clientLoginSuccess = (payload) => ({
    type: CLIENT_LOGIN_SUCCESS,
    payload
});

export const clientLoginFailure = () => ({
    type: CLIENT_LOGIN_FAILURE,
});