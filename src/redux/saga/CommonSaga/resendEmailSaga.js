
import { all, call, put, takeEvery } from "redux-saga/effects";
import { RESEND_EMAIL } from "../../action/types";
import { resendEmailFailure, resendEmailSuccess } from "../../action";
import API from "../../../utils/api";

function* resendEmailRequest(action) {
    try {
        const res = yield API.post("resend-send-email", action?.payload?.resendEmailPayload);
        if (res?.status === 200) {
            yield put(resendEmailSuccess(res?.data));
            yield call(action?.payload?.callback, res?.data);
        }
    } catch (e) {
        yield put(resendEmailFailure());
    }
}

export function* watchResendEmailAPI() {
    yield takeEvery(RESEND_EMAIL, resendEmailRequest);
}

export default function* rootSaga() {
    yield all([watchResendEmailAPI()]);
}