import {
    GOOGLE_USER,
    GOOGLE_USER_SUCCESS,
    GOOGLE_USER_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GOOGLE_USER:
            return { ...state, loading: true };
        case GOOGLE_USER_SUCCESS:
            return { ...state, loading: false };
        case GOOGLE_USER_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};