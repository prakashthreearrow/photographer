
import React from "react";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { INSTAGRAM_ACCESS_TOKEN_USER } from "../../action/types";
import { instagramAccessTokenUserFailure, instagramAccessTokenUserSuccess } from "../../action";
import API from "../../../utils/api";
import {
    ErrorToast
} from "../../../utils/helper";

function* instagramAccessTokenUserRequest(action) {
    try {
        const res = yield API.get(
            `/insta/access-token/${action?.payload?.code}`
        );
        let str = res.data.data.response;
        let response = JSON.parse(str);
        const access_token = response.access_token;
        if (access_token) {
            yield put(instagramAccessTokenUserSuccess());
            yield call(action.payload.callback, access_token);
        } else {
            yield put(instagramAccessTokenUserFailure());
            yield toast.error(<ErrorToast msg="Something went wrong." />);
        }
    } catch (e) {
        yield put(instagramAccessTokenUserFailure());
        yield toast.error(<ErrorToast msg="Something went wrong." />);
    }
}

export function* watchInstagramAccessTokenUserAPI() {
    yield takeEvery(INSTAGRAM_ACCESS_TOKEN_USER, instagramAccessTokenUserRequest);
}

export default function* rootSaga() {
    yield all([watchInstagramAccessTokenUserAPI()]);
}