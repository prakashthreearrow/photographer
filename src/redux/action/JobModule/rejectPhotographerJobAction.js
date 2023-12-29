import { REJECT_PHOTOGRAPHER_JOB, REJECT_PHOTOGRAPHER_JOB_SUCCESS, REJECT_PHOTOGRAPHER_JOB_FAILURE } from "./../types";

export const rejectPhotographerJob = (payload) => ({
    type: REJECT_PHOTOGRAPHER_JOB,
    payload,
});

export const rejectPhotographerJobSuccess = (payload) => ({
    type: REJECT_PHOTOGRAPHER_JOB_SUCCESS,
    payload,
});

export const rejectPhotographerJobFailure = () => ({
    type: REJECT_PHOTOGRAPHER_JOB_FAILURE,
});