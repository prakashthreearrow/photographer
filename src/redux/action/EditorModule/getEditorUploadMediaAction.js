import { GET_EDITOR_UPLOAD_MEDIA, GET_EDITOR_UPLOAD_MEDIA_SUCCESS, GET_EDITOR_UPLOAD_MEDIA_FAILURE } from "./../types";

export const getEditorUploadMedia = (payload) => ({
    type: GET_EDITOR_UPLOAD_MEDIA,
    payload,
});

export const getEditorUploadMediaSuccess = (payload) => ({
    type: GET_EDITOR_UPLOAD_MEDIA_SUCCESS,
    payload,
});

export const getEditorUploadMediaFailure = () => ({
    type: GET_EDITOR_UPLOAD_MEDIA_FAILURE,
});