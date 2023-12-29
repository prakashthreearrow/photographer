
import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_TEAM_MEMBER } from "../../action/types";
import { getTeamMemberFailure, getTeamMemberSuccess } from "../../action";
import API from "../../../utils/api";

function* getTeamMemberRequest(action) {
    try {
        const res = yield API.get(`get-team-member?id=${action?.payload?.user_profile_id}`);
        if (res?.data?.code === 200) {
            yield put(getTeamMemberSuccess(res?.data?.user));
            yield call(action?.payload?.callback, res?.data);
        } else if(res?.data?.code === 400) {
            yield put(getTeamMemberFailure());
            yield call(action?.payload?.callback, res?.data?.errors[0]);
        }
    } catch (e) {
        yield put(getTeamMemberFailure());
    }
}

export function* watchGetTeamMemberAPI() {
    yield takeEvery(GET_TEAM_MEMBER, getTeamMemberRequest);
}

export default function* rootSaga() {
    yield all([watchGetTeamMemberAPI()]);
}