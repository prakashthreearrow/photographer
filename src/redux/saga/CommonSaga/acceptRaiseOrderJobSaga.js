
import { all, call, put, takeEvery } from "redux-saga/effects";
import { ACCEPT_RAISE_ORDER_JOB } from "../../action/types";
import { acceptRaiseOrderJobFailure, acceptRaiseOrderJobSuccess } from "../../action";
import API from "../../../utils/api";

function* acceptRaiseOrderRequest(action) {
    try {
        const res = yield API.post("accept-raise-order-job", action?.payload?.raiseInvoicePayload);
        if (res?.status === 200) {
            yield put(acceptRaiseOrderJobSuccess(res?.data?.data[0]));
            yield call(action?.payload?.callback, res?.data?.data[0]);
        }
    } catch (e) {
        yield put(acceptRaiseOrderJobFailure());
    }
}

export function* watchAcceptRaiseOrderJobAPI() {
    yield takeEvery(ACCEPT_RAISE_ORDER_JOB, acceptRaiseOrderRequest);
}

export default function* rootSaga() {
    yield all([watchAcceptRaiseOrderJobAPI()]);
}