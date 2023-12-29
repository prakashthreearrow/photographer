import { UPDATE_CLIENT_PROFILE, UPDATE_CLIENT_PROFILE_SUCCESS, UPDATE_CLIENT_PROFILE_FAILURE } from "../types";

export const updateClientProfile = (payload) => ({
    type: UPDATE_CLIENT_PROFILE,
    payload,
});

export const updateClientProfileSuccess = () => ({
    type: UPDATE_CLIENT_PROFILE_SUCCESS,
});

export const updateClientProfileFailure = () => ({
    type: UPDATE_CLIENT_PROFILE_FAILURE,
});