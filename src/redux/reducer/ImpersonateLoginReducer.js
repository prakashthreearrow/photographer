import {
    IMPERSONATE_LOGIN_USER,
    IMPERSONATE_LOGIN_USER_SUCCESS,
    IMPERSONATE_LOGIN_USER_FAILURE,
} from "../action/types";

const INIT_STATE = {
    loading: false,
    userData:null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case IMPERSONATE_LOGIN_USER:
            return { ...state, loading: true };
        case IMPERSONATE_LOGIN_USER_SUCCESS:
            return { ...state, userData: action.payload, loading: false };
        case IMPERSONATE_LOGIN_USER_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};