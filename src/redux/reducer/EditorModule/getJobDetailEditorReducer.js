import {
    GET_JOB_DETAIL_EDITOR,
    GET_JOB_DETAIL_EDITOR_SUCCESS,
    GET_JOB_DETAIL_EDITOR_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    jobDetailEditor :null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_JOB_DETAIL_EDITOR:
            return { ...state, loading: true };
        case GET_JOB_DETAIL_EDITOR_SUCCESS:
            return { ...state, jobDetailEditor: action.payload, loading: false };
        case GET_JOB_DETAIL_EDITOR_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};