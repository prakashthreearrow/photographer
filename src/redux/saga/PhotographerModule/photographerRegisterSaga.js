
import { all, call, put, takeEvery } from "redux-saga/effects";
import { PHOTOGRAPHER_REGISTER } from "../../action/types";
import { photographerRegisterFailure, photographerRegisterSuccess } from "../../action";
import API from "../../../utils/api";
import {
    setLocalStorageItem
} from "../../../utils/helper";

function* photographerRegisterRequest(action) {
    try {
        const res = yield API.post("register", action?.payload?.profileForm);
        if (res?.data?.code === 200) {
            yield put(photographerRegisterSuccess());
            yield call(
                setLocalStorageItem,
                "userData",
                JSON.stringify(res?.data?.user)
            );
            yield call(setLocalStorageItem, "token", res?.data?.token);
            yield call(action?.payload?.callback, res?.data?.user);
        } else if(res?.data?.code === 400) {
            yield put(photographerRegisterFailure());
            yield call(action?.payload?.callback, res?.data?.errors[0]);
        }
    } catch (e) {
        yield put(photographerRegisterFailure());
    }
}

export function* watchPhotographerRegisterAPI() {
    yield takeEvery(PHOTOGRAPHER_REGISTER, photographerRegisterRequest);
}

export default function* rootSaga() {
    yield all([watchPhotographerRegisterAPI()]);
}