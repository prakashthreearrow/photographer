import { all, call, takeEvery, put } from "redux-saga/effects";
import { IMAGES_UPLOAD } from "../../action/types";
import { imagesUploadSuccess, imagesUploadFailure } from "../../action";
import API from "../../../utils/api";

function* uploadImagesRequest(action) {
  try {
    const res = yield API.post("/upload-photographer-images",  action?.payload?.userImages);
    if (res.status === 200) {
      yield put(imagesUploadSuccess(res?.data?.image));
      yield call(action?.payload?.callback, res?.data?.image);
    } else if (res.data.meta.code === 0) {
      yield put(imagesUploadFailure(res));
    } 
  } catch (e) {
    yield put(imagesUploadFailure());
  }
}

export function* watchUploadImagesAPI() {
  yield takeEvery(IMAGES_UPLOAD, uploadImagesRequest);
}

export default function* rootSaga() {
  yield all([watchUploadImagesAPI()]);
}