import {
    UPDATE_PHOTOGRAPHER,
    UPDATE_PHOTOGRAPHER_SUCCESS,
    UPDATE_PHOTOGRAPHER_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case UPDATE_PHOTOGRAPHER:
            return { ...state, loading: true };
        case UPDATE_PHOTOGRAPHER_SUCCESS:
            return { ...state, loading: false };
        case UPDATE_PHOTOGRAPHER_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};