import { EDITOR_UPDATE, EDITOR_UPDATE_SUCCESS, EDITOR_UPDATE_FAILURE } from "../types";

export const editorUpdate = (payload) => ({
    type: EDITOR_UPDATE,
    payload,
});

export const editorUpdateSuccess = () => ({
    type: EDITOR_UPDATE_SUCCESS,
});

export const editorUpdateFailure = () => ({
    type: EDITOR_UPDATE_FAILURE,
});