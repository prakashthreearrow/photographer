import { GET_CLIENT_JOB, GET_CLIENT_JOB_SUCCESS, GET_CLIENT_JOB_FAILURE } from "../types";

export const getClientJob = (payload) => ({
    type: GET_CLIENT_JOB,
    payload,
});

export const getClientJobSuccess = (payload) => ({
    type: GET_CLIENT_JOB_SUCCESS,
    payload
});

export const getClientJobFailure = () => ({
    type: GET_CLIENT_JOB_FAILURE,
});