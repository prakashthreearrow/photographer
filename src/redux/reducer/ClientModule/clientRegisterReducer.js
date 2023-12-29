import {
    CLIENT_REGISTER,
    CLIENT_REGISTER_SUCCESS,
    CLIENT_REGISTER_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case CLIENT_REGISTER:
            return { ...state, loading: true };
        case CLIENT_REGISTER_SUCCESS:
            return { ...state, loading: false };
        case CLIENT_REGISTER_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};