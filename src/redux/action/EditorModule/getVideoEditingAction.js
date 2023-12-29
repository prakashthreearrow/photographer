import { GET_VIDEO_EDITING, GET_VIDEO_EDITING_SUCCESS, GET_VIDEO_EDITING_FAILURE } from "./../types";

export const getVideoEditing = (payload) => ({
    type: GET_VIDEO_EDITING,
    payload,
});

export const getVideoEditingSuccess = (payload) => ({
    type: GET_VIDEO_EDITING_SUCCESS,
    payload,
});

export const getVideoEditingFailure = () => ({
    type: GET_VIDEO_EDITING_FAILURE,
});