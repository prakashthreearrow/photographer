import { IS_IMAGE_UPLOADED, IS_IMAGE_UPLOADED_SUCCESS, IS_IMAGE_UPLOADED_FAILURE } from "./../types";

export const isImageUploaded = (payload) => ({
    type: IS_IMAGE_UPLOADED,
    payload,
});

export const isImageUploadedSuccess = (payload) => ({
    type: IS_IMAGE_UPLOADED_SUCCESS,
    payload,
});

export const isImageUploadedFailure = () => ({
    type: IS_IMAGE_UPLOADED_FAILURE,
});