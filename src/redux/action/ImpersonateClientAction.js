
import { IMPERSONATE_CLIENT_LOGIN_USER, IMPERSONATE_CLIENT_LOGIN_USER_SUCCESS, IMPERSONATE_CLIENT_LOGIN_USER_FAILURE } from "./types";

export const impersonateClientLoginUser = (payload) => ({
    type: IMPERSONATE_CLIENT_LOGIN_USER,
    payload,
});

export const impersonateClientLoginUserSuccess = (payload) => ({
    type: IMPERSONATE_CLIENT_LOGIN_USER_SUCCESS,
    payload,
});

export const impersonateClientLoginUserFailure = () => ({
    type: IMPERSONATE_CLIENT_LOGIN_USER_FAILURE,
});