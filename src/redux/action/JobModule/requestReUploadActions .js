import { REQUEST_REUPLOAD, REQUEST_REUPLOAD_SUCCESS, REQUEST_REUPLOAD_FAILURE } from "../types";

export const requestReUpload = (payload) => ({
    type: REQUEST_REUPLOAD,
    payload,
});

export const requestReUploadSuccess = (payload) => ({
    type: REQUEST_REUPLOAD_SUCCESS,
    payload
});

export const requestReUploadFailure = () => ({
    type: REQUEST_REUPLOAD_FAILURE,
});