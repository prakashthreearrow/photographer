import {
    PHOTOGRAPHER_REGISTER,
    PHOTOGRAPHER_REGISTER_SUCCESS,
    PHOTOGRAPHER_REGISTER_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case PHOTOGRAPHER_REGISTER:
            return { ...state, loading: true };
        case PHOTOGRAPHER_REGISTER_SUCCESS:
            return { ...state, loading: false };
        case PHOTOGRAPHER_REGISTER_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};