
import React from "react";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { LINKEDIN_GET_PROFILE_USER } from "../../action/types";
import { linkedinGetProfileUserFailure, linkedinGetProfileUserSuccess } from "../../action";
import API from "../../../utils/api";
import {
    ErrorToast,
    SuccessToast,
} from "../../../utils/helper";

function* linkedinGetProfileUserRequest(action) {
    try {
        const res = yield API.get(
            `/linkedin/get-profile/${action?.payload?.access_token}`
        );
        if (res) {
            yield put(linkedinGetProfileUserSuccess());
            yield call(action.payload.callback, res);
            if (res.data?.user?.is_profile_completed !== 0) {
                toast.success(<SuccessToast msg={"Login Successfully."} />);
            }
        } else {
            yield put(linkedinGetProfileUserFailure());
            yield toast.error(<ErrorToast msg="Something went wrong." />);
        }
    } catch (e) {
        yield put(linkedinGetProfileUserFailure());
        yield toast.error(<ErrorToast msg="Something went wrong." />);
    }
}

export function* watchLinkinGetProfileTokenUserAPI() {
    yield takeEvery(LINKEDIN_GET_PROFILE_USER, linkedinGetProfileUserRequest);
}

export default function* rootSaga() {
    yield all([watchLinkinGetProfileTokenUserAPI()]);
}