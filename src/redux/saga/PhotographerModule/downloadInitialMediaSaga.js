
import { all, call, put, takeEvery } from "redux-saga/effects";
import { DOWNLOAD_INITIAL_MEDIA } from "../../action/types";
import { downloadInitialMediaFailure, downloadInitialMediaSuccess } from "../../action";
import API from "../../../utils/api";

function* downloadInitialMediaRequest(action) {
    try {
        const res = yield API.get(`download-initial-media-photographer?photographer_id=${action?.payload?.imageUploaded}`);
        if (res?.data?.code === 200) {
            yield put(downloadInitialMediaSuccess(res?.data));
            yield call(action?.payload?.callback, res?.data);
        } else if (res?.data?.code === 400) {
            yield put(downloadInitialMediaFailure());
            yield call(action?.payload?.callback, res?.data);
        }
    } catch (e) {
        yield put(downloadInitialMediaFailure());
    }
}

export function* watchDownloadInitialMediaAPI() {
    yield takeEvery(DOWNLOAD_INITIAL_MEDIA, downloadInitialMediaRequest);
}

export default function* rootSaga() {
    yield all([watchDownloadInitialMediaAPI()]);
}