
import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_EDITOR_ADDITIONAL_MEDIA } from "../../action/types";
import { getEditorAdditionMediaFailure, getEditorAdditionMediaSuccess } from "../../action";
import API from "../../../utils/api";

function* getEditorAdditionalMediaRequest(action) {
    try {
        const res = yield API.get(`get-jobs-editor-additional-media?job_id=${action?.payload?.getEditorAdditionalMediaPayload?.job_id}&page=${action?.payload?.getEditorAdditionalMediaPayload?.page}`);
        console.log("editor-additional-media",res)
        if (res?.data?.code === 200) {
            yield put(getEditorAdditionMediaSuccess(res?.data?.images));
            yield call(action?.payload?.callback, res?.data?.images);
        } else if (res?.data?.code === 400) {
            yield put(getEditorAdditionMediaFailure());
            yield call(action?.payload?.callback, res?.data);
            // yield toast.error(<ErrorToast msg={res.data.errors[0]} />);
        }
    } catch (e) {
        yield put(getEditorAdditionMediaFailure());
        // yield toast.error(<ErrorToast msg="Something went wrong." />);
    }
}

export function* watchGetEditorAdditionalMediaAPI() {
    yield takeEvery(GET_EDITOR_ADDITIONAL_MEDIA, getEditorAdditionalMediaRequest);
}

export default function* rootSaga() {
    yield all([watchGetEditorAdditionalMediaAPI()]);
}