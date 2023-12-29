import {
    GET_EQUIPEMENT,
    GET_EQUIPEMENT_SUCCESS,
    GET_EQUIPEMENT_FAILURE,
  } from "../types";
  
  export const equipementType = () => ({
    type: GET_EQUIPEMENT,
  });
  
  export const equipementSuccess = (payload) => ({
    type: GET_EQUIPEMENT_SUCCESS,
    payload,
  });
  
  export const equipementFailure = () => ({
    type: GET_EQUIPEMENT_FAILURE,
  });