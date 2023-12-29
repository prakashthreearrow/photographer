
import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_CLIENT_DETAIL } from "../../action/types";
import { getClientDetailFailure, getClientDetailSuccess } from "../../action";
import API from "../../../utils/api";

function* getClientDetailRequest(action) {
    try {
        const res = yield API.get(`get-client-user/${action?.payload?.client_profile_id}`);
        if (res?.data?.code === 200) {
            yield put(getClientDetailSuccess(res?.data?.user));

            yield call(action?.payload?.callback, res?.data?.user);
        } else if(res?.data?.code === 400) {
            yield put(getClientDetailFailure());
            yield call(action?.payload?.callback, res?.data?.errors[0]);
        }
    } catch (e) {
        yield put(getClientDetailFailure());
    }
}

export function* watchGetClientDetailAPI() {
    yield takeEvery(GET_CLIENT_DETAIL, getClientDetailRequest);
}

export default function* rootSaga() {
    yield all([watchGetClientDetailAPI()]);
}