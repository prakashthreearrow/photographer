import { GET_CLIENT_DETAIL, GET_CLIENT_DETAIL_SUCCESS, GET_CLIENT_DETAIL_FAILURE } from "../types";

export const getClientDetail = (payload) => ({
    type: GET_CLIENT_DETAIL,
    payload,
});

export const getClientDetailSuccess = (payload) => ({
    type: GET_CLIENT_DETAIL_SUCCESS,
    payload
});

export const getClientDetailFailure = () => ({
    type: GET_CLIENT_DETAIL_FAILURE,
});