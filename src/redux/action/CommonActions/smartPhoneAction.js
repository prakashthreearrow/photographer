import {
    GET_SMART_PHONE,
    GET_SMART_PHONE_SUCCESS,
    GET_SMART_PHONE_FAILURE,
  } from "../types";
  
  export const smartPhoneType = () => ({
    type: GET_SMART_PHONE,
  });
  
  export const smartPhoneSuccess = (payload) => ({
    type: GET_SMART_PHONE_SUCCESS,
    payload,
  });
  
  export const smartPhoneFailure = () => ({
    type: GET_SMART_PHONE_FAILURE,
  });