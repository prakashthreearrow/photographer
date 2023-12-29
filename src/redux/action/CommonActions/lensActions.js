import {
    GET_LENS,
    GET_LENS_SUCCESS,
    GET_LENS_FAILURE,
  } from "../types";
  
  export const lensType = () => ({
    type: GET_LENS,
  });
  
  export const lensSuccess = (payload) => ({
    type: GET_LENS_SUCCESS,
    payload,
  });
  
  export const lensFailure = () => ({
    type: GET_LENS_FAILURE,
  });