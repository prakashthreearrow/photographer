import {
    IMAGES_UPLOAD,
    IMAGES_UPLOAD_SUCCESS,
    IMAGES_UPLOAD_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    images:null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case IMAGES_UPLOAD:
            return { ...state, loading: true };
        case IMAGES_UPLOAD_SUCCESS:
            return { ...state, images: action.payload, loading: false };
        case IMAGES_UPLOAD_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};