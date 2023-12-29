
import React from "react";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { IMPERSONATE_CLIENT_LOGIN_USER } from "../action/types";
import { impersonateClientLoginUserFailure, impersonateClientLoginUserSuccess } from "../action";
import API from "../../utils/api";
import {
    setLocalStorageItem,
    SuccessToast,
    ErrorToast
} from "../../utils/helper";

function* ImpersonateClientLoginUserRequest(action) {
    try {
        const res = yield API.post("impersonate-client-login", action?.payload?.profileForm);
        if (res?.data?.code === 200) {
            yield put(impersonateClientLoginUserSuccess(res?.data?.user));
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
            yield toast.error(<ErrorToast msg={res?.data?.errors[0]} />);
            yield put(impersonateClientLoginUserFailure());
            yield call(action?.payload?.callback, res?.data);
        }
    } catch (e) {
        yield put(impersonateClientLoginUserFailure());
    }
}

export function* watchImpersonateClientLoginUserAPI() {
    yield takeEvery(IMPERSONATE_CLIENT_LOGIN_USER, ImpersonateClientLoginUserRequest);
}

export default function* rootSaga() {
    yield all([watchImpersonateClientLoginUserAPI()]);
}