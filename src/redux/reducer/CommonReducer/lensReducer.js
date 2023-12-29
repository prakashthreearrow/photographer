import {
    GET_LENS,
    GET_LENS_SUCCESS,
    GET_LENS_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    lensArray: null,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_LENS:
            return { ...state, loading: true };
        case GET_LENS_SUCCESS:
            return { ...state, lensArray: action.payload, loading: false };
        case GET_LENS_FAILURE:
            return { ...state, loading: false, lensArray: action.payload };
        default:
            return state;
    }
};