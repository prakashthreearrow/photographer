import {
    GET_JOB_LIST_EDITOR,
    GET_JOB_LIST_EDITOR_SUCCESS,
    GET_JOB_LIST_EDITOR_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    jobListEditor :null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_JOB_LIST_EDITOR:
            return { ...state, loading: true };
        case GET_JOB_LIST_EDITOR_SUCCESS:
            return { ...state, jobListEditor: action.payload, loading: false };
        case GET_JOB_LIST_EDITOR_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};