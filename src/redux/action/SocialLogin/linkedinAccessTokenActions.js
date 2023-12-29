import { LINKEDIN_ACCESS_TOKEN_USER, LINKEDIN_ACCESS_TOKEN_USER_SUCCESS, LINKEDIN_ACCESS_TOKEN_USER_FAILURE } from "./../types";

export const linkedinAccessTokenLoginUser = (payload) => ({
    type: LINKEDIN_ACCESS_TOKEN_USER,
    payload,
});

export const linkedinAccessTokenLoginUserSuccess = (payload) => ({
    type: LINKEDIN_ACCESS_TOKEN_USER_SUCCESS,
    payload,
});

export const linkedinAccessTokenLoginUserFailure = () => ({
    type: LINKEDIN_ACCESS_TOKEN_USER_FAILURE,
});