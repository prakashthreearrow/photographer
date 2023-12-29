import { all, takeEvery, put, call } from "redux-saga/effects";
import { toast } from "react-toastify";
import { FORGOT_PASSWORD } from "../action/types";
import { forgotPasswordSuccess, forgotPasswordFailure } from "../action";
import API from "../../utils/api";
import { ErrorToast, SuccessToast } from "../../utils/helper";
import React from "react";

function* forgotPasswordRequest(action) {
  try {
    const res = yield API.post("password/email", action?.payload?.profileForm);
    if (res.status === 200 && res.data.code !== 400) {
      yield put(forgotPasswordSuccess());
      yield call(action.payload.callback);
      toast.success(<SuccessToast msg={res.data.message} />);
    } else if (res.data.code === 400) {
      yield put(forgotPasswordFailure());
      yield toast.error(<ErrorToast msg={res.data.errors[0]} />);
    }
  } catch (e) {
    yield put(forgotPasswordFailure());
    yield toast.error(<ErrorToast msg="Something went wrong." />);
  }
}

export function* watchForgotPasswordAPI() {
  yield takeEvery(FORGOT_PASSWORD, forgotPasswordRequest);
}

export default function* rootSaga() {
  yield all([watchForgotPasswordAPI()]);
}
