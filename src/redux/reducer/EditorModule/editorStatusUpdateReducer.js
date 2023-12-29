import {
    EDITOR_STATUS_UPDATE,
    EDITOR_STATUS_UPDATE_SUCCESS,
    EDITOR_STATUS_UPDATE_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    editorStatus:null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case EDITOR_STATUS_UPDATE:
            return { ...state, loading: true };
        case EDITOR_STATUS_UPDATE_SUCCESS:
            return { ...state, editorStatus: action.payload, loading: false };
        case EDITOR_STATUS_UPDATE_FAILURE:
            return { ...state, editorStatus: action.payload, loading: false };
        default:
            return state;
    }
};