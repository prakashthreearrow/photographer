import {
    INVITE_TEAM_MEMBER,
    INVITE_TEAM_MEMBER_SUCCESS,
    INVITE_TEAM_MEMBER_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    userData:null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case INVITE_TEAM_MEMBER:
            return { ...state, loading: true };
        case INVITE_TEAM_MEMBER_SUCCESS:
            return { ...state, userData: action.payload, loading: false };
        case INVITE_TEAM_MEMBER_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};