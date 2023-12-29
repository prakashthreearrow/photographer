
import React from "react";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { LOGOUT_USER } from "../action/types";
import { logoutUserFailure, logoutUserSuccess } from "../action";
import API from "../../utils/api";
import {
    ErrorToast,
    SuccessToast
} from "../../utils/helper";

function* logoutUserRequest(action) {
    try {
        const res = yield API.post("logout");
        if (res?.status === 200) {
            yield put(logoutUserSuccess());
            yield call(action?.payload?.callback);
            toast.success(<SuccessToast msg={res?.data?.message} />);
        } else {
            yield put(logoutUserFailure());
            yield toast.error(<ErrorToast msg="Something went wrong." />);
        }
    } catch (e) {
        yield put(logoutUserFailure());
        yield toast.error(<ErrorToast msg="Something went wrong." />);
    }
}

export function* watchLogoutUserAPI() {
    yield takeEvery(LOGOUT_USER, logoutUserRequest);
}

export default function* rootSaga() {
    yield all([watchLogoutUserAPI()]);
}