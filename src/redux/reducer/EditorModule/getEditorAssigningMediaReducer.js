import {
    GET_EDITOR_ASSIGNING_MEDIA,
    GET_EDITOR_ASSIGNING_MEDIA_SUCCESS,
    GET_EDITOR_ASSIGNING_MEDIA_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    editorAssigningMedia :null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_EDITOR_ASSIGNING_MEDIA:
            return { ...state, loading: true };
        case GET_EDITOR_ASSIGNING_MEDIA_SUCCESS:
            return { ...state, editorAssigningMedia: action.payload, loading: false };
        case GET_EDITOR_ASSIGNING_MEDIA_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};