import { PHOTOGRAPHER_JOB, PHOTOGRAPHER_JOB_SUCCESS, PHOTOGRAPHER_JOB_FAILURE } from "./../types";

export const getPhotographerJob = (payload) => ({
    type: PHOTOGRAPHER_JOB,
    payload,
});

export const getPhotographerJobSuccess = (payload) => ({
    type: PHOTOGRAPHER_JOB_SUCCESS,
    payload,
});

export const getPhotographerJobFailure = () => ({
    type: PHOTOGRAPHER_JOB_FAILURE,
});