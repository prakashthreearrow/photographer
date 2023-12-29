import {
    GET_SUB_CATEGORY,
    GET_SUB_CATEGORY_SUCCESS,
    GET_SUB_CATEGORY_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    subCategory: null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_SUB_CATEGORY:
            return { ...state, loading: true };
        case GET_SUB_CATEGORY_SUCCESS:
            return { ...state, subCategory: action.payload, loading: false };
        case GET_SUB_CATEGORY_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};