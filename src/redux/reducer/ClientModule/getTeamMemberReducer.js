import {
    GET_TEAM_MEMBER,
    GET_TEAM_MEMBER_SUCCESS,
    GET_TEAM_MEMBER_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    teamMember:null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_TEAM_MEMBER:
            return { ...state, loading: true };
        case GET_TEAM_MEMBER_SUCCESS:
            return { ...state, teamMember: action.payload, loading: false };
        case GET_TEAM_MEMBER_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};