
import React from "react";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";

import { DELETE_TEAM_MEMBER } from "../../action/types";
import { deleteTeamMemberFailure, deleteTeamMemberSuccess } from "../../action";
import API from "../../../utils/api";
import {
    ErrorToast
} from "../../../utils/helper";

function* deleteTeamMemberRequest(action) {
    try {
        const res = yield API.get(`delete-team-member?id=${action?.payload?.team_member_id}`);
        if (res?.status === 200) {
            yield put(deleteTeamMemberSuccess());
            yield call(action?.payload?.callback, res);
        }
    } catch (e) {
        yield put(deleteTeamMemberFailure());
        yield toast.error(<ErrorToast msg="Something went wrong." />);
    }
}

export function* watchDeleteTeamMemberAPI() {
    yield takeEvery(DELETE_TEAM_MEMBER, deleteTeamMemberRequest);
}

export default function* rootSaga() {
    yield all([watchDeleteTeamMemberAPI()]);
}