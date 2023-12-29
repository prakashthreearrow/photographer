import { UPDATE_PHOTOGRAPHER, UPDATE_PHOTOGRAPHER_SUCCESS, UPDATE_PHOTOGRAPHER_FAILURE } from "./../types";

export const updatePhotographer = (payload) => ({
    type: UPDATE_PHOTOGRAPHER,
    payload,
});

export const updatePhotographerSuccess = (payload) => ({
    type: UPDATE_PHOTOGRAPHER_SUCCESS,
    payload
});

export const updatePhotographerFailure = () => ({
    type: UPDATE_PHOTOGRAPHER_FAILURE,
});