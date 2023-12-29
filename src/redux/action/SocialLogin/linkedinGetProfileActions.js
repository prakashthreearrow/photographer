import { LINKEDIN_GET_PROFILE_USER, LINKEDIN_GET_PROFILE_USER_SUCCESS, LINKEDIN_GET_PROFILE_USER_FAILURE } from "./../types";

export const linkedinGetProfileUser = (payload) => ({
    type: LINKEDIN_GET_PROFILE_USER,
    payload,
});

export const linkedinGetProfileUserSuccess = (payload) => ({
    type: LINKEDIN_GET_PROFILE_USER_SUCCESS,
    payload,
});

export const linkedinGetProfileUserFailure = () => ({
    type: LINKEDIN_GET_PROFILE_USER_FAILURE,
});