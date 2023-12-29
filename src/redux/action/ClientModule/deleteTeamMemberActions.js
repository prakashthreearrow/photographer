import { DELETE_TEAM_MEMBER, DELETE_TEAM_MEMBER_SUCCESS, DELETE_TEAM_MEMBER_FAILURE } from "../types";

export const deleteTeamMember = (payload) => ({
    type: DELETE_TEAM_MEMBER,
    payload,
});

export const deleteTeamMemberSuccess = (payload) => ({
    type: DELETE_TEAM_MEMBER_SUCCESS,
    payload
});

export const deleteTeamMemberFailure = () => ({
    type: DELETE_TEAM_MEMBER_FAILURE,
});