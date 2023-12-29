import { LOGOUT_USER, LOGOUT_USER_SUCCESS, LOGOUT_USER_FAILURE } from "./types";

export const logoutUser = (payload) => ({
    type: LOGOUT_USER,
    payload,
});

export const logoutUserSuccess = (payload) => ({
    type: LOGOUT_USER_SUCCESS,
    payload,
});

export const logoutUserFailure = () => ({
    type: LOGOUT_USER_FAILURE,
});