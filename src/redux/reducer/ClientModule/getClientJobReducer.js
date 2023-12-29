import {
    GET_CLIENT_JOB,
    GET_CLIENT_JOB_SUCCESS,
    GET_CLIENT_JOB_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    clientJob:null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_CLIENT_JOB:
            return { ...state, loading: true };
        case GET_CLIENT_JOB_SUCCESS:
            return { ...state, clientJob: action.payload, loading: false };
        case GET_CLIENT_JOB_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};