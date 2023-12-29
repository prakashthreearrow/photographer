
import { IMPERSONATE_LOGIN_USER, IMPERSONATE_LOGIN_USER_SUCCESS, IMPERSONATE_LOGIN_USER_FAILURE } from "./types";

export const impersonateLoginUser = (payload) => ({
    type: IMPERSONATE_LOGIN_USER,
    payload,
});

export const impersonateLoginUserSuccess = (payload) => ({
    type: IMPERSONATE_LOGIN_USER_SUCCESS,
    payload,
});

export const impersonateLoginUserFailure = () => ({
    type: IMPERSONATE_LOGIN_USER_FAILURE,
});