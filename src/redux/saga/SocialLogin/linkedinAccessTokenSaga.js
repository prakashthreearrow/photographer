
import React from "react";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { LINKEDIN_ACCESS_TOKEN_USER } from "../../action/types";
import { linkedinAccessTokenLoginUserFailure, linkedinAccessTokenLoginUserSuccess } from "../../action";
import API from "../../../utils/api";
import {
    ErrorToast
} from "../../../utils/helper";

function* linkedinAccessTokenUserRequest(action) {
    try {
        const res = yield API.get(
            `/linkedin/access-token/${action?.payload?.code}`
        );
        let str = res.data.data.response;
        let response = JSON.parse(str);
        const access_token = response.access_token;
        if (access_token) {
            yield put(linkedinAccessTokenLoginUserSuccess());
            yield call(action.payload.callback, access_token);
        } else {
            yield put(linkedinAccessTokenLoginUserFailure());
            yield toast.error(<ErrorToast msg="Something went wrong." />);
        }
    } catch (e) {
        yield put(linkedinAccessTokenLoginUserFailure());
        yield toast.error(<ErrorToast msg="Something went wrong." />);
    }
}

export function* watchLinkinInAccessTokenUserAPI() {
    yield takeEvery(LINKEDIN_ACCESS_TOKEN_USER, linkedinAccessTokenUserRequest);
}

export default function* rootSaga() {
    yield all([watchLinkinInAccessTokenUserAPI()]);
}