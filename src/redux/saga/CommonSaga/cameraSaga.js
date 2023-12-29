import { all, takeEvery, put } from "redux-saga/effects";
import { GET_CAMERA } from "../../action/types";
import { cameraSuccess, cameraFailure } from "../../action";
import API from "../../../utils/api";

function* getCameraRequest() {
  try {
    const res = yield API.get("/get-camera");
    if (res.status === 200) {
      yield put(cameraSuccess(res?.data?.data));
    } else if (res.data.meta.code === 0) {
      yield put(cameraFailure(res));
    }
  } catch (e) {
    yield put(cameraFailure());
  }
}

export function* watchGetCameraAPI() {
  yield takeEvery(GET_CAMERA, getCameraRequest);
}

export default function* rootSaga() {
  yield all([watchGetCameraAPI()]);
}