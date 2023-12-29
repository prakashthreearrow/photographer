import {
    GET_VIDEO_EDITING,
    GET_VIDEO_EDITING_SUCCESS,
    GET_VIDEO_EDITING_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    videoEditing :null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_VIDEO_EDITING:
            return { ...state, loading: true };
        case GET_VIDEO_EDITING_SUCCESS:
            return { ...state, videoEditing: action.payload, loading: false };
        case GET_VIDEO_EDITING_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};