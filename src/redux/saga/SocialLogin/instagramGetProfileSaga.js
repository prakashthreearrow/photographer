
import React from "react";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { INSTAGRAM_GET_PROFILE_USER } from "../../action/types";
import { instagramGetProfileUserFailure, instagramGetProfileUserSuccess } from "../../action";
import API from "../../../utils/api";
import {
    ErrorToast,
    SuccessToast
} from "../../../utils/helper";

function* instagramGetProfileUserRequest(action) {
    try {
        const res = yield API.get(
            `/insta/get-profile/${action?.payload?.access_token}`
        );
        if (res) {
            yield put(instagramGetProfileUserSuccess());
            yield call(action.payload.callback, res);
            if (res.data?.user?.is_profile_completed !== 0) {
                toast.success(<SuccessToast msg={"Login Successfully."} />);
            }
        } else {
            yield put(instagramGetProfileUserFailure());
            yield toast.error(<ErrorToast msg="Something went wrong." />);
        }
    } catch (e) {
        yield put(instagramGetProfileUserFailure());
        yield toast.error(<ErrorToast msg="Something went wrong." />);
    }
}

export function* watchInstagramGetProfileUserAPI() {
    yield takeEvery(INSTAGRAM_GET_PROFILE_USER, instagramGetProfileUserRequest);
}

export default function* rootSaga() {
    yield all([watchInstagramGetProfileUserAPI()]);
}