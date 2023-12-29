
import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_VISUAL_EDITING } from "../../action/types";
import { getVisualEditingFailure, getVisualEditingSuccess } from "../../action";
import API from "../../../utils/api";

function* getVisualEditingRequest(action) {
    try {
        const res = yield API.get(`get-visual-editing`);
        if (res?.status === 200) {
            yield put(getVisualEditingSuccess(res?.data?.data?.editing));

            yield call(action?.payload?.callback, res?.data?.data?.editing);
        } else{
            yield put(getVisualEditingFailure());
            yield call(action?.payload?.callback, res?.data?.errors[0]);
        }
    } catch (e) {
        yield put(getVisualEditingFailure());
    }
}

export function* watchGetVisualEditingAPI() {
    yield takeEvery(GET_VISUAL_EDITING, getVisualEditingRequest);
}

export default function* rootSaga() {
    yield all([watchGetVisualEditingAPI()]);
}