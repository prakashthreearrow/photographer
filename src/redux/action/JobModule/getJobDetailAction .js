import { GET_JOB_DETAIL, GET_JOB_DETAIL_SUCCESS, GET_JOB_DETAIL_FAILURE } from "./../types";

export const getJobDetail = (payload) => ({
    type: GET_JOB_DETAIL,
    payload,
});

export const getJobDetailSuccess = (payload) => ({
    type: GET_JOB_DETAIL_SUCCESS,
    payload,
});

export const getJobDetailFailure = () => ({
    type: GET_JOB_DETAIL_FAILURE,
});