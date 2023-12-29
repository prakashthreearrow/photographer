
import React from "react";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { PHOTOGRAPHER_JOB } from "../../action/types";
import { getPhotographerJobFailure, getPhotographerJobSuccess } from "../../action";
import API from "../../../utils/api";
import {
    ErrorToast
} from "../../../utils/helper";

function* getPhotographerJobRequest(action) {
    try {
        const res = yield API.get(`get-photographer-jobs?${Object.keys(action?.payload?.photographer_job)[0]}=${action?.payload?.photographer_job.photographer_id}`);
        if (res?.data?.code === 200) {
            yield put(getPhotographerJobSuccess(res?.data?.jobs));
            yield call(action?.payload?.callback, res?.data);
        } else if (res?.data?.code === 400) {
            yield put(getPhotographerJobFailure());
            yield call(action?.payload?.callback, res?.data?.errors[0]);
        }
    } catch (e) {
        yield put(getPhotographerJobFailure());
        yield toast.error(<ErrorToast msg="Something went wrong." />);
    }
}

export function* watchGetPhotographerJobAPI() {
    yield takeEvery(PHOTOGRAPHER_JOB, getPhotographerJobRequest);
}

export default function* rootSaga() {
    yield all([watchGetPhotographerJobAPI()]);
}