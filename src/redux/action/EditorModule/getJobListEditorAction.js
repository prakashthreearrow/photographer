import { GET_JOB_LIST_EDITOR, GET_JOB_LIST_EDITOR_SUCCESS, GET_JOB_LIST_EDITOR_FAILURE } from "./../types";

export const getJobListEditor = (payload) => ({
    type: GET_JOB_LIST_EDITOR,
    payload,
});

export const getJobListEditorSuccess = (payload) => ({
    type: GET_JOB_LIST_EDITOR_SUCCESS,
    payload,
});

export const getJobListEditorFailure = () => ({
    type: GET_JOB_LIST_EDITOR_FAILURE,
});