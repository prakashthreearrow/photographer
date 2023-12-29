import { GET_SUB_CATEGORY, GET_SUB_CATEGORY_SUCCESS, GET_SUB_CATEGORY_FAILURE } from "../types";

export const getSubCategory = (payload) => ({
    type: GET_SUB_CATEGORY,
    payload,
});

export const getSubCategorySuccess = (payload) => ({
    type: GET_SUB_CATEGORY_SUCCESS,
    payload
});

export const getSubCategoryFailure = () => ({
    type: GET_SUB_CATEGORY_FAILURE,
});