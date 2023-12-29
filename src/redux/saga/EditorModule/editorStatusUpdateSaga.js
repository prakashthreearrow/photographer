
import React from "react";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { EDITOR_STATUS_UPDATE } from "../../action/types";
import { editorStatusUpdateFailure, editorStatusUpdateSuccess } from "../../action";
import API from "../../../utils/api";
import {
    ErrorToast
} from "../../../utils/helper";

function* editorStatusUpdateRequest(action) {
    try {
        const res = yield API.post("update-editor-job-satus", action?.payload?.editorUpdateStatus);
        if (res?.status === 200) {
            yield put(editorStatusUpdateSuccess());
            yield call(action?.payload?.callback, res?.data);
        } else if (res?.data?.code === 400) {
            yield put(editorStatusUpdateFailure());
            yield toast.error(<ErrorToast msg={res?.data?.errors[0]} />);
        }
    } catch (e) {
        yield put(editorStatusUpdateFailure());
        yield toast.error(<ErrorToast msg="Something went wrong." />);
    }
}

export function* watchEditorStatusUpdateAPI() {
    yield takeEvery(EDITOR_STATUS_UPDATE, editorStatusUpdateRequest);
}

export default function* rootSaga() {
    yield all([watchEditorStatusUpdateAPI()]);
}