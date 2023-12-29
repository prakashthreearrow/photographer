import { INSTAGRAM_ACCESS_TOKEN_USER, INSTAGRAM_ACCESS_TOKEN_USER_SUCCESS, INSTAGRAM_ACCESS_TOKEN_USER_FAILURE } from "./../types";

export const instagramAccessTokenUser = (payload) => ({
    type: INSTAGRAM_ACCESS_TOKEN_USER,
    payload,
});

export const instagramAccessTokenUserSuccess = (payload) => ({
    type: INSTAGRAM_ACCESS_TOKEN_USER_SUCCESS,
    payload,
});

export const instagramAccessTokenUserFailure = () => ({
    type: INSTAGRAM_ACCESS_TOKEN_USER_FAILURE,
});