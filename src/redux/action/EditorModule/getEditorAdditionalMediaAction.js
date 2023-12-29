import { GET_EDITOR_ADDITIONAL_MEDIA, GET_EDITOR_ADDITIONAL_MEDIA_SUCCESS, GET_EDITOR_ADDITIONAL_MEDIA_FAILURE } from "./../types";

export const getEditorAdditionMedia = (payload) => ({
    type: GET_EDITOR_ADDITIONAL_MEDIA,
    payload,
});

export const getEditorAdditionMediaSuccess = (payload) => ({
    type: GET_EDITOR_ADDITIONAL_MEDIA_SUCCESS,
    payload,
});

export const getEditorAdditionMediaFailure = () => ({
    type: GET_EDITOR_ADDITIONAL_MEDIA_FAILURE,
});