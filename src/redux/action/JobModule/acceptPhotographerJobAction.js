import { ACCEPT_PHOTOGRAPHER_JOB, ACCEPT_PHOTOGRAPHER_JOB_SUCCESS, ACCEPT_PHOTOGRAPHER_JOB_FAILURE } from "./../types";

export const acceptPhotographerJob = (payload) => ({
    type: ACCEPT_PHOTOGRAPHER_JOB,
    payload,
});

export const acceptPhotographerJobSuccess = (payload) => ({
    type: ACCEPT_PHOTOGRAPHER_JOB_SUCCESS,
    payload,
});

export const acceptPhotographerJobFailure = () => ({
    type: ACCEPT_PHOTOGRAPHER_JOB_FAILURE,
});