import {
    LINKEDIN_GET_PROFILE_USER,
    LINKEDIN_GET_PROFILE_USER_SUCCESS,
    LINKEDIN_GET_PROFILE_USER_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case LINKEDIN_GET_PROFILE_USER:
            return { ...state, loading: true };
        case LINKEDIN_GET_PROFILE_USER_SUCCESS:
            return { ...state, loading: false };
        case LINKEDIN_GET_PROFILE_USER_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};