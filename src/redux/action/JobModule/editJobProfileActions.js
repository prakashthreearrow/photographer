import { EDIT_JOB_PROFILE, EDIT_JOB_PROFILE_SUCCESS, EDIT_JOB_PROFILE_FAILURE } from "./../types";

export const editJobProfile = (payload) => ({
    type: EDIT_JOB_PROFILE,
    payload,
});

export const editJobProfileSuccess = () => ({
    type: EDIT_JOB_PROFILE_SUCCESS,
});

export const editJobProfileFailure = () => ({
    type: EDIT_JOB_PROFILE_FAILURE,
});