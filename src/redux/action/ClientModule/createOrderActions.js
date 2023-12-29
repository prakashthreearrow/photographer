import { CREATE_ORDER, CREATE_ORDER_SUCCESS, CREATE_ORDER_FAILURE } from "../types";

export const createOrder = (payload) => ({
    type: CREATE_ORDER,
    payload,
});

export const createOrderSuccess = (payload) => ({
    type: CREATE_ORDER_SUCCESS,
    payload
});

export const createOrderFailure = () => ({
    type: CREATE_ORDER_FAILURE,
});