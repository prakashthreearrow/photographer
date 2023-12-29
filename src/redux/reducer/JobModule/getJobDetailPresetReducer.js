import {
    GET_JOB_DETAIL_PRESET,
    GET_JOB_DETAIL_PRESET_SUCCESS,
    GET_JOB_DETAIL_PRESET_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    jobDetailPreset :null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_JOB_DETAIL_PRESET:
            return { ...state, loading: true };
        case GET_JOB_DETAIL_PRESET_SUCCESS:
            return { ...state, jobDetailPreset: action.payload, loading: false };
        case GET_JOB_DETAIL_PRESET_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};