
import React from "react";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { LOGIN_USER } from "../action/types";
import { loginUserFailure, loginUserSuccess } from "../action";
import API from "../../utils/api";
import {
    setLocalStorageItem,
    SuccessToast
} from "../../utils/helper";

function* loginUserRequest(action) {
    try {
        const res = yield API.post("login", action?.payload?.profileForm);
        if (res?.data?.code === 200) {
            yield put(loginUserSuccess(res?.data?.user));
            yield call(
                setLocalStorageItem,
                "userData",
                JSON.stringify(res?.data?.user)
            );
            yield call(
                setLocalStorageItem,
                "userId",
                JSON.stringify(res?.data?.user?.id)
            );
            yield call(setLocalStorageItem, "token", res?.data?.token);
            yield call(action?.payload?.callback, res?.data);
            if (res?.data?.use?.is_profile_completed !== 0) {
                toast.success(<SuccessToast msg={res?.data?.message} />);
            }
        } else if (res?.data?.code === 400) {
            yield put(loginUserFailure());
            yield call(action?.payload?.callback, res?.data);
        }
    } catch (e) {
        yield put(loginUserFailure());
    }
}

export function* watchLoginUserAPI() {
    yield takeEvery(LOGIN_USER, loginUserRequest);
}

export default function* rootSaga() {
    yield all([watchLoginUserAPI()]);
}