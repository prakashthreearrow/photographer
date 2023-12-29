import { INVITE_TEAM_MEMBER, INVITE_TEAM_MEMBER_SUCCESS, INVITE_TEAM_MEMBER_FAILURE } from "../types";

export const inviteTeamMember = (payload) => ({
    type: INVITE_TEAM_MEMBER,
    payload,
});

export const inviteTeamMemberSuccess = (payload) => ({
    type: INVITE_TEAM_MEMBER_SUCCESS,
    payload
});

export const inviteTeamMemberFailure = () => ({
    type: INVITE_TEAM_MEMBER_FAILURE,
});