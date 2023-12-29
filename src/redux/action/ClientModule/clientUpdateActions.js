import { CLIENT_UPDATE, CLIENT_UPDATE_SUCCESS, CLIENT_UPDATE_FAILURE } from "../types";

export const clientUpdate = (payload) => ({
    type: CLIENT_UPDATE,
    payload,
});

export const clientUpdateSuccess = () => ({
    type: CLIENT_UPDATE_SUCCESS,
});

export const clientUpdateFailure = () => ({
    type: CLIENT_UPDATE_FAILURE,
});