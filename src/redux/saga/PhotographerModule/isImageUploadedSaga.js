
import React from "react";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { IS_IMAGE_UPLOADED } from "../../action/types";
import { isImageUploadedFailure, isImageUploadedSuccess } from "../../action";
import API from "../../../utils/api";
import {
    ErrorToast,
    removeLocalStorageItem
} from "../../../utils/helper";

function* isImageUploadedRequest(action) {
    try {
        const res = yield API.post("isuploadedimage", action?.payload?.imageUploaded);
        if (res?.status === 200) {
            removeLocalStorageItem("userData");
            yield put(isImageUploadedSuccess());
            yield call(action?.payload?.callback, res?.data?.user);
        }
    } catch (e) {
        yield put(isImageUploadedFailure());
        yield toast.error(<ErrorToast msg="Something went wrong." />);
    }
}

export function* watchIsImageUploadedAPI() {
    yield takeEvery(IS_IMAGE_UPLOADED, isImageUploadedRequest);
}

export default function* rootSaga() {
    yield all([watchIsImageUploadedAPI()]);
}