
import React from "react";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";

import { CLIENT_LOGIN } from "../../action/types";
import { clientLoginFailure, clientLoginSuccess } from "../../action";
import API from "../../../utils/api";
import {
    setLocalStorageItem,
    SuccessToast,
} from "../../../utils/helper";

function* clientLoginRequest(action) {
    try {
        const res = yield API.post("client-login", action?.payload?.profileForm);
        if (res?.data?.code === 200) {
            yield put(clientLoginSuccess(res?.data?.user));
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
            yield call(
                setLocalStorageItem,
                "image",
                JSON.stringify(res?.data?.user?.image)
            );
            yield call(setLocalStorageItem, "token", res?.data?.token);
            if (res?.data?.user?.is_profile_completed === 1) {
                toast.success(<SuccessToast msg="You have succesfully logged in." />);
            }
            yield call(action?.payload?.callback, res?.data?.user);
        } else if (res?.data?.code === 400) {
            yield put(clientLoginFailure());
            yield call(action?.payload?.callback, res?.data?.errors[0]);
        }
    } catch (e) {
        yield put(clientLoginFailure());
    }
}

export function* watchClientLoginAPI() {
    yield takeEvery(CLIENT_LOGIN, clientLoginRequest);
}

export default function* rootSaga() {
    yield all([watchClientLoginAPI()]);
}