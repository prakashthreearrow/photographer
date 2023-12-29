
import React from "react";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";

import { CLIENT_UPDATE } from "../../action/types";
import { clientUpdateFailure, clientUpdateSuccess } from "../../action";
import API from "../../../utils/api";
import {
    ErrorToast,
    SuccessToast
} from "../../../utils/helper";

function* clientUpdateRequest(action) {
    try {
        const res = yield API.post("update-client", action?.payload?.client_profile_form);
        if (res?.data?.data?.code === 200) {
            yield put(clientUpdateSuccess());
            yield call(action?.payload?.callback, res?.data?.data?.user);
            toast.success(<SuccessToast msg="You have succesfully logged in."/>);
        } else if (res?.data?.code === 400) {
            yield put(clientUpdateFailure());
            yield toast.error(<ErrorToast msg={res?.data?.errors[0]} />);
        }
    } catch (e) {
        yield put(clientUpdateFailure());
        yield toast.error(<ErrorToast msg="Something went wrong." />);
    }
}

export function* watchClientUpdateAPI() {
    yield takeEvery(CLIENT_UPDATE, clientUpdateRequest);
}

export default function* rootSaga() {
    yield all([watchClientUpdateAPI()]);
}