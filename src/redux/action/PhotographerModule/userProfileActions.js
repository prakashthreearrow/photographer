import { USER_PROFILE, USER_PROFILE_SUCCESS, USER_PROFILE_FAILURE } from "./../types";

export const userProfile = (payload) => ({
    type: USER_PROFILE,
    payload,
});

export const userProfileSuccess = (payload) => ({
    type: USER_PROFILE_SUCCESS,
    payload,
});

export const userProfileFailure = () => ({
    type: USER_PROFILE_FAILURE,
});