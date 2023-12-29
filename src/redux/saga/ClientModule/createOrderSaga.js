
import { all, call, put, takeEvery } from "redux-saga/effects";
import { CREATE_ORDER } from "../../action/types";
import { createOrderFailure, createOrderSuccess } from "../../action";
import API from "../../../utils/api";

function* createOrderRequest(action) {
    try {
        const res = yield API.post("add-order", action?.payload?.order_payload);
     
        if (res?.data?.data?.code === 200) {
            yield put(createOrderSuccess(res?.data?.user));
            yield call(action?.payload?.callback, res?.data?.data);
        } else if (res?.data?.data?.code === 400) {
            yield put(createOrderFailure());
            yield call(action?.payload?.callback, res?.data?.errors[0]);
        }
    } catch (e) {
        yield put(createOrderFailure());
    }
}

export function* watchCreateOrderAPI() {
    yield takeEvery(CREATE_ORDER, createOrderRequest);
}

export default function* rootSaga() {
    yield all([watchCreateOrderAPI()]);
}