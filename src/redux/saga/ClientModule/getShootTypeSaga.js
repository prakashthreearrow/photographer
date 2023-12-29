
import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_SHOOT_TYPE } from "../../action/types";
import { getShootTypeFailure, getShootTypeSuccess } from "../../action";
import API from "../../../utils/api";

function* getShootTypeRequest(action) {
    try {
        const res = yield API.get(`get-shoot-type`);
        if (res?.status === 200) {
            yield put(getShootTypeSuccess(res?.data?.data));

            yield call(action?.payload?.callback, res?.data?.data);
        } else{
            yield put(getShootTypeFailure());
            yield call(action?.payload?.callback, res?.data?.errors[0]);
        }
    } catch (e) {
        yield put(getShootTypeFailure());
    }
}

export function* watchGetShootTypeAPI() {
    yield takeEvery(GET_SHOOT_TYPE, getShootTypeRequest);
}

export default function* rootSaga() {
    yield all([watchGetShootTypeAPI()]);
}