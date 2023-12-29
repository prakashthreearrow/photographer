import { EDITOR_STATUS_UPDATE, EDITOR_STATUS_UPDATE_SUCCESS, EDITOR_STATUS_UPDATE_FAILURE } from "../types";

export const editorStatusUpdate = (payload) => ({
    type: EDITOR_STATUS_UPDATE,
    payload,
});

export const editorStatusUpdateSuccess = (payload) => ({
    type: EDITOR_STATUS_UPDATE_SUCCESS,
    payload
});

export const editorStatusUpdateFailure = () => ({
    type: EDITOR_STATUS_UPDATE_FAILURE,
});