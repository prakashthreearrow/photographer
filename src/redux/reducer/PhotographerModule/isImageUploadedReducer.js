import {
    IS_IMAGE_UPLOADED,
    IS_IMAGE_UPLOADED_SUCCESS,
    IS_IMAGE_UPLOADED_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case IS_IMAGE_UPLOADED:
            return { ...state, loading: true };
        case IS_IMAGE_UPLOADED_SUCCESS:
            return { ...state, loading: false };
        case IS_IMAGE_UPLOADED_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};