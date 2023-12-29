import { all, takeEvery, put, call } from "redux-saga/effects";
import { DELETE_RAW_IMAGE } from "../../action/types";
import { deleteRawImageFailure } from "../../action";
import API from "../../../utils/api";

function* deleteRawImageRequest(action) {
  try {
    const apiname = action?.payload?.imageUploaded?.editor_id ? "editor-delete-image" : "photographer-delete-raw-image"
    const res = yield API.post(apiname, action?.payload?.imageUploaded);
    if (res?.status === 200) {
      yield call(action?.payload?.callback, res?.data?.data);
    } else if (res?.data?.meta?.code === 0) {
      yield put(deleteRawImageFailure(res));
    }
  } catch (e) {
    yield put(deleteRawImageFailure());
  }
}

export function* watchdeleteRawImageAPI() {
  yield takeEvery(DELETE_RAW_IMAGE, deleteRawImageRequest);
}

export default function* rootSaga() {
  yield all([watchdeleteRawImageAPI()]);
}