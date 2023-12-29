
import React from "react";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { REJECT_PHOTOGRAPHER_JOB } from "../../action/types";
import { rejectPhotographerJobSuccess, rejectPhotographerJobFailure } from "../../action";
import API from "../../../utils/api";
import {
    ErrorToast
} from "../../../utils/helper";

function* rejectPhotographerJobRequest(action) {  
    try {
        const res = yield API.post("update-job-status",action?.payload?.reject_photographer_job);
        if (res?.data?.code === 200) {
            yield put(rejectPhotographerJobSuccess());
            yield call(action?.payload?.callback, res?.data);
        } else if (res?.data?.code === 400) {
            yield put(rejectPhotographerJobFailure());
            yield toast.error(<ErrorToast msg={res.data.errors[0]} />);
        }
    } catch (e) {
        yield put(rejectPhotographerJobFailure());
        yield toast.error(<ErrorToast msg="Something went wrong." />);
    }
}

export function* watchRejectPhotographerJobAPI() {
    yield takeEvery(REJECT_PHOTOGRAPHER_JOB, rejectPhotographerJobRequest);
}

export default function* rootSaga() {
    yield all([watchRejectPhotographerJobAPI()]);
}