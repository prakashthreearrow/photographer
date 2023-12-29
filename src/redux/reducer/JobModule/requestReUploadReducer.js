import {
    REQUEST_REUPLOAD,
    REQUEST_REUPLOAD_SUCCESS,
    REQUEST_REUPLOAD_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case REQUEST_REUPLOAD:
            return { ...state, loading: true };
        case REQUEST_REUPLOAD_SUCCESS:
            return { ...state, loading: false };
        case REQUEST_REUPLOAD_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};