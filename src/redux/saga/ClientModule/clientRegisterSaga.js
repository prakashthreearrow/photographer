
import { all, call, put, takeEvery } from "redux-saga/effects";
import { CLIENT_REGISTER } from "../../action/types";
import { clientRegisterFailure, clientRegisterSuccess } from "../../action";
import API from "../../../utils/api";
import {
    setLocalStorageItem
} from "../../../utils/helper";

function* clientRegisterRequest(action) {
    try {
        const res = yield API.post("client-register", action?.payload?.profileForm);
        if (res?.data?.code === 200) {
            yield put(clientRegisterSuccess());
            yield call(
                setLocalStorageItem,
                "userData",
                JSON.stringify(res?.data?.user)
            );
            yield call(setLocalStorageItem, "token", res?.data?.token);
            yield call(action?.payload?.callback, res?.data?.user);
        } else if(res?.data?.code === 400) {
            yield put(clientRegisterFailure());
            yield call(action?.payload?.callback, res?.data?.errors[0]);
        }
    } catch (e) {
        yield put(clientRegisterFailure());
    }
}

export function* watchClientRegisterAPI() {
    yield takeEvery(CLIENT_REGISTER, clientRegisterRequest);
}

export default function* rootSaga() {
    yield all([watchClientRegisterAPI()]);
}