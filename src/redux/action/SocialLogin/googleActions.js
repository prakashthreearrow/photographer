import { GOOGLE_USER, GOOGLE_USER_SUCCESS, GOOGLE_USER_FAILURE } from "./../types";

export const googleLoginUser = (payload) => ({
    type: GOOGLE_USER,
    payload,
});

export const googleLoginUserSuccess = (payload) => ({
    type: GOOGLE_USER_SUCCESS,
    payload,
});

export const googleLoginUserFailure = () => ({
    type: GOOGLE_USER_FAILURE,
});