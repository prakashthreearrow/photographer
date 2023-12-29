
import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_EDITOR_ASSIGNING_MEDIA } from "../../action/types";
import { getEditorAssigningMediaFailure, getEditorAssigningMediaSuccess } from "../../action";
import API from "../../../utils/api";

function* getEditorAssigningMediaRequest(action) {
    try {
        const res = yield API.get(`get-jobs-editor-assing-media?editor_id=${action?.payload?.getEditorAssigningMediaPayload?.editor_id}&job_id=${action?.payload?.getEditorAssigningMediaPayload?.job_id}&page=${action?.payload?.getEditorAssigningMediaPayload?.page}`);
        if (res?.data?.code === 200) {
            yield put(getEditorAssigningMediaSuccess(res?.data?.images));
            yield call(action?.payload?.callback, res?.data?.images);
        } else if (res?.data?.code === 400) {
            yield put(getEditorAssigningMediaFailure());
            yield call(action?.payload?.callback, res?.data);
            // yield toast.error(<ErrorToast msg={res.data.errors[0]} />);
        }
    } catch (e) {
        yield put(getEditorAssigningMediaFailure());
        // yield toast.error(<ErrorToast msg="Something went wrong." />);
    }
}

export function* watchGetEditorAssigningMediaAPI() {
    yield takeEvery(GET_EDITOR_ASSIGNING_MEDIA, getEditorAssigningMediaRequest);
}

export default function* rootSaga() {
    yield all([watchGetEditorAssigningMediaAPI()]);
}