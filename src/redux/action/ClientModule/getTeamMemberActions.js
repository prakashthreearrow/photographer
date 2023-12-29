import { GET_TEAM_MEMBER, GET_TEAM_MEMBER_SUCCESS, GET_TEAM_MEMBER_FAILURE } from "../types";

export const getTeamMember = (payload) => ({
    type: GET_TEAM_MEMBER,
    payload,
});

export const getTeamMemberSuccess = (payload) => ({
    type: GET_TEAM_MEMBER_SUCCESS,
    payload
});

export const getTeamMemberFailure = () => ({
    type: GET_TEAM_MEMBER_FAILURE,
});