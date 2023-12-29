import { INSTAGRAM_GET_PROFILE_USER, INSTAGRAM_GET_PROFILE_USER_SUCCESS, INSTAGRAM_GET_PROFILE_USER_FAILURE } from "./../types";

export const instagramGetProfileUser = (payload) => ({
    type: INSTAGRAM_GET_PROFILE_USER,
    payload,
});

export const instagramGetProfileUserSuccess = (payload) => ({
    type: INSTAGRAM_GET_PROFILE_USER_SUCCESS,
    payload,
});

export const instagramGetProfileUserFailure = () => ({
    type: INSTAGRAM_GET_PROFILE_USER_FAILURE,
});