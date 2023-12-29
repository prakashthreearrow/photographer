import {
    CLIENT_LOGIN,
    CLIENT_LOGIN_SUCCESS,
    CLIENT_LOGIN_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    userData: null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case CLIENT_LOGIN:
            return { ...state, loading: true };
        case CLIENT_LOGIN_SUCCESS:
            return { ...state, userData: action.payload, loading: false };
        case CLIENT_LOGIN_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};