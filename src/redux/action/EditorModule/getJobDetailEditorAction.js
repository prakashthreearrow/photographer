import { GET_JOB_DETAIL_EDITOR, GET_JOB_DETAIL_EDITOR_SUCCESS, GET_JOB_DETAIL_EDITOR_FAILURE } from "./../types";

export const getJobDetailEditor = (payload) => ({
    type: GET_JOB_DETAIL_EDITOR,
    payload,
});

export const getJobDetailEditorSuccess = (payload) => ({
    type: GET_JOB_DETAIL_EDITOR_SUCCESS,
    payload,
});

export const getJobDetailEditorFailure = () => ({
    type: GET_JOB_DETAIL_EDITOR_FAILURE,
});