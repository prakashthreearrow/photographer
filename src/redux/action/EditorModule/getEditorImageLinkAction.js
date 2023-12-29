import { GET_EDITOR_IMAGE_LINK, GET_EDITOR_IMAGE_LINK_SUCCESS, GET_EDITOR_IMAGE_LINK_FAILURE } from "./../types";

export const getEditorImageLink = (payload) => ({
    type: GET_EDITOR_IMAGE_LINK,
    payload,
});

export const getEditorImageLinkSuccess = (payload) => ({
    type: GET_EDITOR_IMAGE_LINK_SUCCESS,
    payload,
});

export const getEditorImageLinkFailure = () => ({
    type: GET_EDITOR_IMAGE_LINK_FAILURE,
});