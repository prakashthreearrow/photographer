
import React from "react";
import { all, call, put, takeEvery } from "redux-saga/effects";
import { toast } from "react-toastify";
import { PHOTOGRAPHER_PRODUCTION_ADDITIONAL_MEDIA } from "../../action/types";
import { getPhotographerProductionAdditionalMediaFailure, getPhotographerProductionAdditionalMediaSuccess } from "../../action";
import API from "../../../utils/api";
import {
    ErrorToast
} from "../../../utils/helper";

function* getPhotographerProductionAdditionalMediaRequest(action) {
   
    try {
        const res = yield API.get(`get-jobs-additional-media?job_id=${action?.payload?.getImageListProductionPayload?.job_id}&page=${action?.payload?.getImageListProductionPayload?.page}`);
        console.log("dditionalMediaReques",res)
        if (res?.data?.code === 200) {
            yield put(getPhotographerProductionAdditionalMediaSuccess(res?.data?.images));
            yield call(action?.payload?.callback, res?.data?.images);
        } else if (res?.data?.code === 400) {
            yield put(getPhotographerProductionAdditionalMediaFailure());
            yield call(action?.payload?.callback, res?.data?.errors[0]);
        }
    } catch (e) {
        yield put(getPhotographerProductionAdditionalMediaFailure());
        yield toast.error(<ErrorToast msg="Something went wrong." />);
    }
}

export function* watchGetPhotographerProductionAdditionalMediaAPI() {
    yield takeEvery(PHOTOGRAPHER_PRODUCTION_ADDITIONAL_MEDIA, getPhotographerProductionAdditionalMediaRequest);
}

export default function* rootSaga() {
    yield all([watchGetPhotographerProductionAdditionalMediaAPI()]);
}