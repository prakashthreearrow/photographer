import {
    CLIENT_UPDATE,
    CLIENT_UPDATE_SUCCESS,
    CLIENT_UPDATE_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case CLIENT_UPDATE:
            return { ...state, loading: true };
        case CLIENT_UPDATE_SUCCESS:
            return { ...state, loading: false };
        case CLIENT_UPDATE_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};