import {
    GET_CAMERA,
    GET_CAMERA_SUCCESS,
    GET_CAMERA_FAILURE,
  } from "../types";
  
  export const cameraType = () => ({
    type: GET_CAMERA,
  });
  
  export const cameraSuccess = (payload) => ({
    type: GET_CAMERA_SUCCESS,
    payload,
  });
  
  export const cameraFailure = () => ({
    type: GET_CAMERA_FAILURE,
  });