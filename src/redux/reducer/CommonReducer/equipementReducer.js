import {
    GET_EQUIPEMENT,
    GET_EQUIPEMENT_SUCCESS,
    GET_EQUIPEMENT_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    equipementArray: null,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_EQUIPEMENT:
            return { ...state, loading: true };
        case GET_EQUIPEMENT_SUCCESS:
            return { ...state, equipementArray: action.payload, loading: false };
        case GET_EQUIPEMENT_FAILURE:
            return { ...state, loading: false, equipementArray: action.payload };
        default:
            return state;
    }
};