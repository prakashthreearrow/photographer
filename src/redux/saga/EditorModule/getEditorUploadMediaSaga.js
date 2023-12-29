
import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_EDITOR_UPLOAD_MEDIA } from "../../action/types";
import { getEditorUploadMediaFailure, getEditorUploadMediaSuccess } from "../../action";
import API from "../../../utils/api";

function* getEditorUploadMediaRequest(action) {
    try {
        const res = yield API.get(`get-jobs-editor-uploaded-media?editor_id=${action?.payload?.getEditorMediaUploadPayload?.editor_id}&job_id=${action?.payload?.getEditorMediaUploadPayload?.job_id}&page=${action?.payload?.getEditorMediaUploadPayload?.page}`);
        console.log("editor-uploaded",res)
        if (res?.data?.code === 200) {
            yield put(getEditorUploadMediaSuccess(res?.data?.images));
            yield call(action?.payload?.callback, res?.data?.images);
        } else if (res?.data?.code === 400) {
            yield put(getEditorUploadMediaFailure());
            yield call(action?.payload?.callback, res?.data);
            // yield toast.error(<ErrorToast msg={res.data.errors[0]} />);
        }
    } catch (e) {
        yield put(getEditorUploadMediaFailure());
        // yield toast.error(<ErrorToast msg="Something went wrong." />);
    }
}

export function* watchGetEditorUploadMediaAPI() {
    yield takeEvery(GET_EDITOR_UPLOAD_MEDIA, getEditorUploadMediaRequest);
}

export default function* rootSaga() {
    yield all([watchGetEditorUploadMediaAPI()]);
}