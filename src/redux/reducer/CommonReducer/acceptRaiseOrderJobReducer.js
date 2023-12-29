import {
    ACCEPT_RAISE_ORDER_JOB,
    ACCEPT_RAISE_ORDER_JOB_SUCCESS,
    ACCEPT_RAISE_ORDER_JOB_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    raiseOrderJob:null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case ACCEPT_RAISE_ORDER_JOB:
            return { ...state, loading: true };
        case ACCEPT_RAISE_ORDER_JOB_SUCCESS:
            return { ...state, language: action.payload, loading: false };
        case ACCEPT_RAISE_ORDER_JOB_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};