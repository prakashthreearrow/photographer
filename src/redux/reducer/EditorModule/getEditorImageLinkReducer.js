import {
    GET_EDITOR_IMAGE_LINK,
    GET_EDITOR_IMAGE_LINK_SUCCESS,
    GET_EDITOR_IMAGE_LINK_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_EDITOR_IMAGE_LINK:
            return { ...state, loading: true };
        case GET_EDITOR_IMAGE_LINK_SUCCESS:
            return { ...state, loading: false };
        case GET_EDITOR_IMAGE_LINK_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};