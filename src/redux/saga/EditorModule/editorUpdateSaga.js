
import React from "react";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { EDITOR_UPDATE } from "../../action/types";
import { editorUpdateFailure, editorUpdateSuccess } from "../../action";
import API from "../../../utils/api";
import {
    ErrorToast,
    SuccessToast
} from "../../../utils/helper";

function* editorUpdateRequest(action) {
    try {
        const res = yield API.post("update-editor", action?.payload?.profileForm);
        if (res?.data?.data?.code === 200) {
            yield put(editorUpdateSuccess());
            yield call(action?.payload?.callback, res?.data?.data?.user);
            if(action?.payload?.profileForm?.id){
                toast.success(<SuccessToast msg="Profile has been successfully updated."/>);
            }
        } else if (res?.data?.code === 400) {
            yield put(editorUpdateFailure());
            yield toast.error(<ErrorToast msg={res?.data?.errors[0]} />);
        }
    } catch (e) {
        yield put(editorUpdateFailure());
        yield toast.error(<ErrorToast msg="Something went wrong." />);
    }
}

export function* watchEditorUpdateAPI() {
    yield takeEvery(EDITOR_UPDATE, editorUpdateRequest);
}

export default function* rootSaga() {
    yield all([watchEditorUpdateAPI()]);
}