import {
    GET_VISUAL_EDITING,
    GET_VISUAL_EDITING_SUCCESS,
    GET_VISUAL_EDITING_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    editingType: null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_VISUAL_EDITING:
            return { ...state, loading: true };
        case GET_VISUAL_EDITING_SUCCESS:
            return { ...state, editingType: action.payload, loading: false };
        case GET_VISUAL_EDITING_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};