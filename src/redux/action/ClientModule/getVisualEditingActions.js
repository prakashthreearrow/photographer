import { GET_VISUAL_EDITING, GET_VISUAL_EDITING_SUCCESS, GET_VISUAL_EDITING_FAILURE } from "../types";

export const getVisualEditing = (payload) => ({
    type: GET_VISUAL_EDITING,
    payload,
});

export const getVisualEditingSuccess = (payload) => ({
    type: GET_VISUAL_EDITING_SUCCESS,
    payload
});

export const getVisualEditingFailure = () => ({
    type: GET_VISUAL_EDITING_FAILURE,
});