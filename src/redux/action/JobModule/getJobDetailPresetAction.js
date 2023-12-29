import { GET_JOB_DETAIL_PRESET, GET_JOB_DETAIL_PRESET_SUCCESS, GET_JOB_DETAIL_PRESET_FAILURE } from "./../types";

export const getJobDetailPreset = (payload) => ({
    type: GET_JOB_DETAIL_PRESET,
    payload,
});

export const getJobDetailPresetSuccess = (payload) => ({
    type: GET_JOB_DETAIL_PRESET_SUCCESS,
    payload,
});

export const getJobDetailPresetFailure = () => ({
    type: GET_JOB_DETAIL_PRESET_FAILURE,
});