
import React from "react";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { ACCEPT_PHOTOGRAPHER_JOB } from "../../action/types";
import { acceptPhotographerJobFailure, acceptPhotographerJobSuccess } from "../../action";
import API from "../../../utils/api";
import {
    ErrorToast
} from "../../../utils/helper";

function* acceptPhotographerJobRequest(action) {
    try {
        const res = yield API.post("update-job-status",action?.payload?.accept_photographer_job);
        if (res?.data?.code === 200) {
            yield put(acceptPhotographerJobSuccess());
            yield call(action?.payload?.callback, res?.data);
        } else if (res?.data?.code === 400) {
            yield put(acceptPhotographerJobFailure());
            yield toast.error(<ErrorToast msg={res.data.errors[0]} />);
        }
    } catch (e) {
        yield put(acceptPhotographerJobFailure());
        yield toast.error(<ErrorToast msg="Something went wrong." />);
    }
}

export function* watchAcceptPhotographerJobAPI() {
    yield takeEvery(ACCEPT_PHOTOGRAPHER_JOB, acceptPhotographerJobRequest);
}

export default function* rootSaga() {
    yield all([watchAcceptPhotographerJobAPI()]);
}