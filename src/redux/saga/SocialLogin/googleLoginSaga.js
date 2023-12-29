
import React from "react";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { GOOGLE_USER } from "../../action/types";
import { googleLoginUserFailure, googleLoginUserSuccess } from "../../action";
import API from "../../../utils/api";
import {
    ErrorToast,
    setLocalStorageItem,
    SuccessToast,
} from "../../../utils/helper";

function* googleLoginUserRequest(action) {
    try {
        const res = yield API.post("google/get-profile", action?.payload?.googleForm);
        if (res?.status === 200) {
            yield put(googleLoginUserSuccess(res?.data?.user));
            yield call(
                setLocalStorageItem,
                "userData",
                JSON.stringify(res?.data?.user)
            );
            yield call(setLocalStorageItem, "token", res?.data?.token);
            yield call(action?.payload?.callback, res?.data?.user);
            if (res.data?.user?.is_profile_completed !== 0) {
                toast.success(<SuccessToast msg={"Login Successfully."} />);
            }
        } else if (res?.data?.code === 400) {
            yield put(googleLoginUserFailure());
            yield toast.error(<ErrorToast msg={""} />);
        }
    } catch (e) {
        yield put(googleLoginUserFailure());
        yield toast.error(<ErrorToast msg="Something went wrong." />);
    }
}

export function* watchGoogleLoginUserAPI() {
    yield takeEvery(GOOGLE_USER, googleLoginUserRequest);
}

export default function* rootSaga() {
    yield all([watchGoogleLoginUserAPI()]);
}