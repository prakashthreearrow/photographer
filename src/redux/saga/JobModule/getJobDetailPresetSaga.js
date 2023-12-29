
import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_JOB_DETAIL_PRESET } from "../../action/types";
import { getJobDetailPresetFailure, getJobDetailPresetSuccess } from "../../action";
import API from "../../../utils/api";

function* getJobDetailPresetRequest(action) {
    try {
        const res = yield API.get(`get-jobs-details?job_id=${action?.payload?.job_id}`);
        if (res?.data?.code === 200) {
            yield put(getJobDetailPresetSuccess(res?.data?.data[0]));
            yield call(action?.payload?.callback, res?.data?.data[0]);
        } else if (res?.data?.code === 400) {
            yield put(getJobDetailPresetFailure());
        }
    } catch (e) {
        yield put(getJobDetailPresetFailure());
    }
}

export function* watchGetJobDetailPresetAPI() {
    yield takeEvery(GET_JOB_DETAIL_PRESET, getJobDetailPresetRequest);
}

export default function* rootSaga() {
    yield all([watchGetJobDetailPresetAPI()]);
}