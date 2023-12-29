import {
    PHOTOGRAPHER_JOB,
    PHOTOGRAPHER_JOB_SUCCESS,
    PHOTOGRAPHER_JOB_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    photoGrapherJob :null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case PHOTOGRAPHER_JOB:
            return { ...state, loading: true };
        case PHOTOGRAPHER_JOB_SUCCESS:
            return { ...state, photoGrapherJob: action.payload, loading: false };
        case PHOTOGRAPHER_JOB_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};