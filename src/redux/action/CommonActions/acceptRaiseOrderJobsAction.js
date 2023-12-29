import { ACCEPT_RAISE_ORDER_JOB, ACCEPT_RAISE_ORDER_JOB_SUCCESS, ACCEPT_RAISE_ORDER_JOB_FAILURE } from "../types";

export const acceptRaiseOrderJob = (payload) => ({
    type: ACCEPT_RAISE_ORDER_JOB,
    payload,
});

export const acceptRaiseOrderJobSuccess = (payload) => ({
    type: ACCEPT_RAISE_ORDER_JOB_SUCCESS,
    payload,
});

export const acceptRaiseOrderJobFailure = () => ({
    type: ACCEPT_RAISE_ORDER_JOB_FAILURE,
});