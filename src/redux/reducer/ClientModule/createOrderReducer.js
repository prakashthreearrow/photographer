import {
    CREATE_ORDER,
    CREATE_ORDER_SUCCESS,
    CREATE_ORDER_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case CREATE_ORDER:
            return { ...state, loading: true };
        case CREATE_ORDER_SUCCESS:
            return { ...state, loading: false };
        case CREATE_ORDER_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};