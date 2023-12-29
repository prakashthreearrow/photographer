
import React from "react";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { EDIT_JOB_PROFILE } from "../../action/types";
import { editJobProfileFailure, editJobProfileSuccess } from "../../action";
import API from "./../../../utils/api";
import {
    ErrorToast,
    SuccessToast
} from "../../../utils/helper";

function* editJobProfileRequest(action) {
    try {
        const res = yield API.post("update-photographer-details", action?.payload?.profileUpdateForm);
        if (res?.status === 200) {
            yield put(editJobProfileSuccess());
            yield call(action?.payload?.callback, res?.data?.data?.user);
            toast.success(<SuccessToast msg="Profile has been successfully updated." />);
        } else if (res?.data?.code === 400) {
            yield put(editJobProfileFailure());
            yield call(action?.payload?.callback, res?.data?.errors[0]);
        }
    } catch (e) {
        yield put(editJobProfileFailure());
        yield toast.error(<ErrorToast msg="Something went wrong." />);
    }
}

export function* watchEditJobProfileAPI() {
    yield takeEvery(EDIT_JOB_PROFILE, editJobProfileRequest);
}

export default function* rootSaga() {
    yield all([watchEditJobProfileAPI()]);
}