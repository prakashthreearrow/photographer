import {
    REJECT_PHOTOGRAPHER_JOB,
    REJECT_PHOTOGRAPHER_JOB_SUCCESS,
    REJECT_PHOTOGRAPHER_JOB_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case REJECT_PHOTOGRAPHER_JOB:
            return { ...state, loading: true };
        case REJECT_PHOTOGRAPHER_JOB_SUCCESS:
            return { ...state, loading: false };
        case REJECT_PHOTOGRAPHER_JOB_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};