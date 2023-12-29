import {
    GET_CATEGORY,
    GET_CATEGORY_SUCCESS,
    GET_CATEGORY_FAILURE,
  } from "../types";
  
  export const categoryType = () => ({
    type: GET_CATEGORY,
  });
  
  export const categorySuccess = (payload) => ({
    type: GET_CATEGORY_SUCCESS,
    payload,
  });
  
  export const categoryFailure = () => ({
    type: GET_CATEGORY_FAILURE,
  });