import { all, takeEvery, put } from "redux-saga/effects";
import { GET_SMART_PHONE } from "../../action/types";
import { smartPhoneSuccess, smartPhoneFailure } from "../../action";
import API from "../../../utils/api";

function* getSmartPhoneRequest() {
    try {
        const res = yield API.get("/get-smartphone");
        if (res) {
            yield put(smartPhoneSuccess(res?.data?.data));
        } else if (res.data.meta.code === 0) {
            yield put(smartPhoneFailure(res));
        }
    } catch (e) {
        yield put(smartPhoneFailure());
    }
}

export function* watchGetSmartPhoneAPI() {
    yield takeEvery(GET_SMART_PHONE, getSmartPhoneRequest);
}

export default function* rootSaga() {
    yield all([watchGetSmartPhoneAPI()]);
}