import {
    INSTAGRAM_GET_PROFILE_USER,
    INSTAGRAM_GET_PROFILE_USER_SUCCESS,
    INSTAGRAM_GET_PROFILE_USER_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case INSTAGRAM_GET_PROFILE_USER:
            return { ...state, loading: true };
        case INSTAGRAM_GET_PROFILE_USER_SUCCESS:
            return { ...state, loading: false };
        case INSTAGRAM_GET_PROFILE_USER_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};