import {
    DELETE_TEAM_MEMBER,
    DELETE_TEAM_MEMBER_SUCCESS,
    DELETE_TEAM_MEMBER_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case DELETE_TEAM_MEMBER:
            return { ...state, loading: true };
        case DELETE_TEAM_MEMBER_SUCCESS:
            return { ...state, loading: false };
        case DELETE_TEAM_MEMBER_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};