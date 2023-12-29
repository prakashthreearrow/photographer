import { GET_SHOOT_TYPE, GET_SHOOT_TYPE_SUCCESS, GET_SHOOT_TYPE_FAILURE } from "../types";

export const getShootType = (payload) => ({
    type: GET_SHOOT_TYPE,
    payload,
});

export const getShootTypeSuccess = (payload) => ({
    type: GET_SHOOT_TYPE_SUCCESS,
    payload
});

export const getShootTypeFailure = () => ({
    type: GET_SHOOT_TYPE_FAILURE,
});