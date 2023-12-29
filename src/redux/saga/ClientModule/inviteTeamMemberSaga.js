
import React from "react";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";

import { INVITE_TEAM_MEMBER } from "../../action/types";
import { inviteTeamMemberFailure, inviteTeamMemberSuccess } from "../../action";
import API from "../../../utils/api";
import {
    ErrorToast,
    SuccessToast,
    removeLocalStorageItem
} from "../../../utils/helper";

function* inviteTeamMemberRequest(action) {
    try {
        const res = yield API.post("update_client_invite_member", action?.payload?.client_profile_form);
        if (res?.data?.data?.code === 200) {
            removeLocalStorageItem("userData");
            yield put(inviteTeamMemberSuccess(res?.data?.data?.user));
            yield call(action?.payload?.callback, res?.data?.data?.user);
            toast.success(<SuccessToast msg="You have succesfully logged in." />);
        } else if(res?.data?.data?.code === 400) {
            yield put(inviteTeamMemberFailure());
            yield call(action?.payload?.callback, res?.data?.errors[0]);
        }
    } catch (e) {
        yield put(inviteTeamMemberFailure());
        yield toast.error(<ErrorToast msg="Something went wrong." />);
    }
}

export function* watchInviteTeamMemberAPI() {
    yield takeEvery(INVITE_TEAM_MEMBER, inviteTeamMemberRequest);
}

export default function* rootSaga() {
    yield all([watchInviteTeamMemberAPI()]);
}