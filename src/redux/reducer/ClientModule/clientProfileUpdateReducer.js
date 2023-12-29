import {
    UPDATE_CLIENT_PROFILE,
    UPDATE_CLIENT_PROFILE_SUCCESS,
    UPDATE_CLIENT_PROFILE_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case UPDATE_CLIENT_PROFILE:
            return { ...state, loading: true };
        case UPDATE_CLIENT_PROFILE_SUCCESS:
            return { ...state, loading: false };
        case UPDATE_CLIENT_PROFILE_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};