
import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_JOB_DETAIL_EDITOR } from "../../action/types";
import { getJobDetailEditorFailure, getJobDetailEditorSuccess } from "../../action";
import API from "../../../utils/api";

function* getJobDetailEditorRequest(action) {
    try {
        const res = yield API.get(`get-editor-jobs-details?editor_id=${action?.payload?.getImageListPayload?.user_profile_id}&job_id=${action?.payload?.getImageListPayload?.job_id}`);
        if (res?.data?.code === 200) {
            yield put(getJobDetailEditorSuccess(res?.data?.data[0]));
            yield call(action?.payload?.callback, res?.data);
        } else if (res?.data?.code === 400) {
            yield put(getJobDetailEditorFailure());
            yield call(action?.payload?.callback, res?.data);
            // yield toast.error(<ErrorToast msg={res.data.errors[0]} />);
        }
    } catch (e) {
        yield put(getJobDetailEditorFailure());
        // yield toast.error(<ErrorToast msg="Something went wrong." />);
    }
}

export function* watchGetJobDetailEditorAPI() {
    yield takeEvery(GET_JOB_DETAIL_EDITOR, getJobDetailEditorRequest);
}

export default function* rootSaga() {
    yield all([watchGetJobDetailEditorAPI()]);
}