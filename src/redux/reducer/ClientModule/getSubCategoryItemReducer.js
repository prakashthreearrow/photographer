import {
    GET_SUB_CATEGORY_ITEM,
    GET_SUB_CATEGORY_ITEM_SUCCESS,
    GET_SUB_CATEGORY_ITEM_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    subCategoryItem: null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_SUB_CATEGORY_ITEM:
            return { ...state, loading: true };
        case GET_SUB_CATEGORY_ITEM_SUCCESS:
            return { ...state, subCategoryItem: action.payload, loading: false };
        case GET_SUB_CATEGORY_ITEM_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};