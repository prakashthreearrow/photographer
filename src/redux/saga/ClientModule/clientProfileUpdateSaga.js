
import React from "react";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";

import { UPDATE_CLIENT_PROFILE } from "../../action/types";
import { updateClientProfileFailure, updateClientProfileSuccess } from "../../action";
import API from "../../../utils/api";
import {
    ErrorToast,
    SuccessToast
} from "../../../utils/helper";

function* updateClientProfileRequest(action) {
    try {
        const res = yield API.post("update-client-details", action?.payload?.profileUpdateForm);
        if (res?.data?.data?.code === 200) {
            yield put(updateClientProfileSuccess());
            yield call(action?.payload?.callback, res?.data?.data?.user);
            toast.success(<SuccessToast msg={res?.data?.message} />);
        } else if(res?.data?.data?.code === 400) {
            yield put(updateClientProfileFailure());
            yield call(action?.payload?.callback, res?.data?.errors[0]);
        }
    } catch (e) {
        yield put(updateClientProfileFailure());
        yield toast.error(<ErrorToast msg="Something went wrong." />);
    }
}

export function* watchClientLoginAPI() {
    yield takeEvery(UPDATE_CLIENT_PROFILE, updateClientProfileRequest);
}

export default function* rootSaga() {
    yield all([watchClientLoginAPI()]);
}