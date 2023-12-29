
import { LOGIN_USER, LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE } from "./types";

export const loginUser = (payload) => ({
    type: LOGIN_USER,
    payload,
});

export const loginUserSuccess = (payload) => ({
    type: LOGIN_USER_SUCCESS,
    payload,
});

export const loginUserFailure = () => ({
    type: LOGIN_USER_FAILURE,
});