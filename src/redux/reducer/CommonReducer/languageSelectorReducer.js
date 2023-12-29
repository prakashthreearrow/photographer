import {
    LANGUAGE_SELECTOR,
    LANGUAGE_SELECTOR_SUCCESS,
    LANGUAGE_SELECTOR_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    language:null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case LANGUAGE_SELECTOR:
            return { ...state, loading: true };
        case LANGUAGE_SELECTOR_SUCCESS:
            return { ...state, language: action.payload, loading: false };
        case LANGUAGE_SELECTOR_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};