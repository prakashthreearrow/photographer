
import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_JOB_DETAIL } from "../../action/types";
import { getJobDetailFailure, getJobDetailSuccess } from "../../action";
import API from "../../../utils/api";

function* getJobDetailRequest(action) {
    try {
        const res = yield API.get(`get-jobs?job_id=${action?.payload?.job_id}`);
        if (res?.data?.code === 200) {
            yield put(getJobDetailSuccess(res?.data?.data[0]));
            yield call(action?.payload?.callback, res?.data);
        } else if (res?.data?.code === 400) {
            yield put(getJobDetailFailure());
            yield call(action?.payload?.callback, res?.data);
        }
    } catch (e) {
        yield put(getJobDetailFailure());
    }
}

export function* watchGetJobDetailAPI() {
    yield takeEvery(GET_JOB_DETAIL, getJobDetailRequest);
}

export default function* rootSaga() {
    yield all([watchGetJobDetailAPI()]);
}