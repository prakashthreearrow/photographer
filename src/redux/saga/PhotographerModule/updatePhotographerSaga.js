
import React from "react";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { UPDATE_PHOTOGRAPHER } from "../../action/types";
import { updatePhotographerFailure, updatePhotographerSuccess } from "../../action";
import API from "../../../utils/api";
import {
    ErrorToast
} from "../../../utils/helper";

function* updatePhotographerRequest(action) {
    try {
        const res = yield API.post("update-photographer", action.payload.profileUpdateForm);
        if (res.status === 200) {
            yield put(updatePhotographerSuccess());
            yield call(action.payload.callback, res?.data?.data?.user);
        } else {
            yield put(updatePhotographerFailure());
            yield toast.error(<ErrorToast msg="Something went wrong." />);
        }
    } catch (e) {
        yield put(updatePhotographerFailure());
        yield toast.error(<ErrorToast msg="Something went wrong." />);
    }
}

export function* watchUpdatePhotographerAPI() {
    yield takeEvery(UPDATE_PHOTOGRAPHER, updatePhotographerRequest);
}

export default function* rootSaga() {
    yield all([watchUpdatePhotographerAPI()]);
}