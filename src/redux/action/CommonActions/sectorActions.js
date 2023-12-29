import {
    GET_SECTOR,
    GET_SECTOR_SUCCESS,
    GET_SECTOR_FAILURE,
  } from "../types";
  
  export const sectorType = () => ({
    type: GET_SECTOR,
  });
  
  export const sectorSuccess = (payload) => ({
    type: GET_SECTOR_SUCCESS,
    payload,
  });
  
  export const sectorFailure = () => ({
    type: GET_SECTOR_FAILURE,
  });