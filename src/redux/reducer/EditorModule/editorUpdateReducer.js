import {
    EDITOR_UPDATE,
    EDITOR_UPDATE_SUCCESS,
    EDITOR_UPDATE_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case EDITOR_UPDATE:
            return { ...state, loading: true };
        case EDITOR_UPDATE_SUCCESS:
            return { ...state, loading: false };
        case EDITOR_UPDATE_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};