import {
    EDIT_JOB_PROFILE,
    EDIT_JOB_PROFILE_SUCCESS,
    EDIT_JOB_PROFILE_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case EDIT_JOB_PROFILE:
            return { ...state, loading: true };
        case EDIT_JOB_PROFILE_SUCCESS:
            return { ...state, loading: false };
        case EDIT_JOB_PROFILE_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};