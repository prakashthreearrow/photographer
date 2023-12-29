import { GET_EDITOR_ASSIGNING_MEDIA, GET_EDITOR_ASSIGNING_MEDIA_SUCCESS, GET_EDITOR_ASSIGNING_MEDIA_FAILURE } from "./../types";

export const getEditorAssigningMedia = (payload) => ({
    type: GET_EDITOR_ASSIGNING_MEDIA,
    payload,
});

export const getEditorAssigningMediaSuccess = (payload) => ({
    type: GET_EDITOR_ASSIGNING_MEDIA_SUCCESS,
    payload,
});

export const getEditorAssigningMediaFailure = () => ({
    type: GET_EDITOR_ASSIGNING_MEDIA_FAILURE,
});