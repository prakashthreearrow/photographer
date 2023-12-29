import { DELETE_RAW_IMAGE, DELETE_RAW_IMAGE_SUCCESS, DELETE_RAW_IMAGE_FAILURE } from "../types";

export const deleteRawImage = (payload) => ({
    type: DELETE_RAW_IMAGE,
    payload,
});

export const deleteRawImageSuccess = (payload) => ({
    type: DELETE_RAW_IMAGE_SUCCESS,
    payload,
});

export const deleteRawImageFailure = () => ({
    type: DELETE_RAW_IMAGE_FAILURE,
});