import {
    ACCEPT_PHOTOGRAPHER_JOB,
    ACCEPT_PHOTOGRAPHER_JOB_SUCCESS,
    ACCEPT_PHOTOGRAPHER_JOB_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case ACCEPT_PHOTOGRAPHER_JOB:
            return { ...state, loading: true };
        case ACCEPT_PHOTOGRAPHER_JOB_SUCCESS:
            return { ...state, loading: false };
        case ACCEPT_PHOTOGRAPHER_JOB_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};