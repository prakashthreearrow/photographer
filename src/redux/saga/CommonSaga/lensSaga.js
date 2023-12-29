import { all, takeEvery, put } from "redux-saga/effects";
import { GET_LENS } from "../../action/types";
import { lensSuccess, lensFailure } from "../../action";
import API from "../../../utils/api";

function* getLensRequest() {
  try {
    const res = yield API.get("/get-lens");
    if (res) {
      yield put(lensSuccess(res?.data?.data));
    } else if (res.data.meta.code === 0) {
      yield put(lensFailure(res));
    }
  } catch (e) {
    yield put(lensFailure());
  }
}

export function* watchGetLensAPI() {
  yield takeEvery(GET_LENS, getLensRequest);
}

export default function* rootSaga() {
  yield all([watchGetLensAPI()]);
}