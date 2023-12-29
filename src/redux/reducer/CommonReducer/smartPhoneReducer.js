import {
    GET_SMART_PHONE,
    GET_SMART_PHONE_SUCCESS,
    GET_SMART_PHONE_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    smartPhoneArray: null,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_SMART_PHONE:
            return { ...state, loading: true };
        case GET_SMART_PHONE_SUCCESS:
            return { ...state, smartPhoneArray: action.payload, loading: false };
        case GET_SMART_PHONE_FAILURE:
            return { ...state, loading: false, smartPhoneArray: action.payload };
        default:
            return state;
    }
};