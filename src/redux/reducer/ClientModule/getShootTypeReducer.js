import {
    GET_SHOOT_TYPE,
    GET_SHOOT_TYPE_SUCCESS,
    GET_SHOOT_TYPE_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    shootType: null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_SHOOT_TYPE:
            return { ...state, loading: true };
        case GET_SHOOT_TYPE_SUCCESS:
            return { ...state, shootType: action.payload, loading: false };
        case GET_SHOOT_TYPE_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};