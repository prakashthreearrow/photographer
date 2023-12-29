
import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_JOB_LIST_EDITOR } from "../../action/types";
import { getJobListEditorFailure, getJobListEditorSuccess } from "../../action";
import API from "../../../utils/api";

function* getJobListEditorRequest(action) {
    try {
        const res = yield API.get(`get-editor-jobs?editor_id=${action?.payload?.photographer_job.photographer_id}`)
        if (res?.data?.code === 200) {
            yield put(getJobListEditorSuccess(res?.data?.jobs));
            yield call(action?.payload?.callback, res?.data);
        } else if (res?.data?.code === 400) {
            yield put(getJobListEditorFailure());
            yield call(action?.payload?.callback, res?.data?.jobs);
        }
    } catch (e) {
        yield put(getJobListEditorFailure());
    }
}

export function* watchGetJobListEditorAPI() {
    yield takeEvery(GET_JOB_LIST_EDITOR, getJobListEditorRequest);
}

export default function* rootSaga() {
    yield all([watchGetJobListEditorAPI()]);
}