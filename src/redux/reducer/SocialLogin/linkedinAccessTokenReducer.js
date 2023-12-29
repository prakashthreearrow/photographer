import {
    LINKEDIN_ACCESS_TOKEN_USER,
    LINKEDIN_ACCESS_TOKEN_USER_SUCCESS,
    LINKEDIN_ACCESS_TOKEN_USER_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case LINKEDIN_ACCESS_TOKEN_USER:
            return { ...state, loading: true };
        case LINKEDIN_ACCESS_TOKEN_USER_SUCCESS:
            return { ...state, loading: false };
        case LINKEDIN_ACCESS_TOKEN_USER_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};