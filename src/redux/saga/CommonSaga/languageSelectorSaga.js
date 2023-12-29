
import { all, call, put, takeEvery } from "redux-saga/effects";
import { LANGUAGE_SELECTOR } from "../../action/types";
import { languageSelectorFailure, languageSelectorSuccess } from "../../action";
import API from "../../../utils/api";

function* languageSelectorRequest(action) {
    try {
        const res = yield API.post("languageselector", action?.payload?.lang_payload);
        if (res?.status === 200) {
            yield put(languageSelectorSuccess(res?.data?.user?.lang));
            yield call(action?.payload?.callback, res?.data?.user);
        }
    } catch (e) {
        yield put(languageSelectorFailure());
    }
}

export function* watchLanguageSelectorAPI() {
    yield takeEvery(LANGUAGE_SELECTOR, languageSelectorRequest);
}

export default function* rootSaga() {
    yield all([watchLanguageSelectorAPI()]);
}