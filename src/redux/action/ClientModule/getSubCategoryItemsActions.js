import { GET_SUB_CATEGORY_ITEM, GET_SUB_CATEGORY_ITEM_SUCCESS, GET_SUB_CATEGORY_ITEM_FAILURE } from "../types";

export const getSubCategoryItem = (payload) => ({
    type: GET_SUB_CATEGORY_ITEM,
    payload,
});

export const getSubCategoryItemSuccess = (payload) => ({
    type: GET_SUB_CATEGORY_ITEM_SUCCESS,
    payload
});

export const getSubCategoryItemFailure = () => ({
    type: GET_SUB_CATEGORY_ITEM_FAILURE,
});