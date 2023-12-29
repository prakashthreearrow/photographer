
import React from "react";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";

import { GET_CLIENT_JOB } from "../../action/types";
import { getClientJobSuccess, getClientJobFailure } from "../../action";
import API from "../../../utils/api";
import {
    ErrorToast
} from "../../../utils/helper";

function* getClientJobRequest(action) {
    try {
        const res = yield API.get(`get-client-jobs?client_id=${action?.payload?.client_job.client_id}`);
        if (res?.data?.code === 200) {
            yield put(getClientJobSuccess(res?.data));
            yield call(action?.payload?.callback, res?.data);
        } else if(res?.data?.code === 400) {
            yield put(getClientJobFailure());
            yield call(action?.payload?.callback, res?.data?.errors[0]);
        }
    } catch (e) {
        yield put(getClientJobFailure());
        yield toast.error(<ErrorToast msg="Something went wrong." />);
    }
}

export function* watchGetClientJobAPI() {
    yield takeEvery(GET_CLIENT_JOB, getClientJobRequest);
}

export default function* rootSaga() {
    yield all([watchGetClientJobAPI()]);
}