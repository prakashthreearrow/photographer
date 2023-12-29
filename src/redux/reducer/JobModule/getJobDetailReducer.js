import {
    GET_JOB_DETAIL,
    GET_JOB_DETAIL_SUCCESS,
    GET_JOB_DETAIL_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    jobDetail :null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_JOB_DETAIL:
            return { ...state, loading: true };
        case GET_JOB_DETAIL_SUCCESS:
            return { ...state, jobDetail: action.payload, loading: false };
        case GET_JOB_DETAIL_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};