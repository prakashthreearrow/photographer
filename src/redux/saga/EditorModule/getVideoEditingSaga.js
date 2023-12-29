
import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_VIDEO_EDITING } from "../../action/types";
import { getVideoEditingFailure, getVideoEditingSuccess } from "../../action";
import API from "../../../utils/api";

function* getVideoEditingRequest(action) {
    try {
        const res = yield API.get(`email-check-editor-download-media?user_id=${action?.payload?.getImageListPayload?.user_id}&id=${action?.payload?.getImageListPayload?.id}`);
        if (res?.data?.code === 200) {
            yield put(getVideoEditingSuccess(res?.data));
            yield call(action?.payload?.callback, res?.data);
        } else if (res?.data?.code === 400) {
            yield put(getVideoEditingFailure());
            yield call(action?.payload?.callback, res?.data);
        }
    } catch (e) {
        yield put(getVideoEditingFailure());
    }
}

export function* watchGetVideoEditingAPI() {
    yield takeEvery(GET_VIDEO_EDITING, getVideoEditingRequest);
}

export default function* rootSaga() {
    yield all([watchGetVideoEditingAPI()]);
}