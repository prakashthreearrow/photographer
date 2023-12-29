import {
    GET_CLIENT_DETAIL,
    GET_CLIENT_DETAIL_SUCCESS,
    GET_CLIENT_DETAIL_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    clientDetail: null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_CLIENT_DETAIL:
            return { ...state, loading: true };
        case GET_CLIENT_DETAIL_SUCCESS:
            return { ...state, clientDetail: action.payload, loading: false };
        case GET_CLIENT_DETAIL_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};