import { all, call, takeEvery, put } from "redux-saga/effects";
import { GET_IMAGES } from "../../action/types";
import { imagesSuccess, imagesFailure } from "../../action";
import API from "../../../utils/api";

function* getImagesRequest(action) {
  try {
    const res = yield API.get(`/get-photographer-s3images?user_id=${action?.payload?.getImageListPayload?.user_profile_id}&job_id=${action?.payload?.getImageListPayload?.job_id}&page=${action?.payload?.getImageListPayload?.page}`);
    if (res?.status === 200) {
      yield put(imagesSuccess(res?.data?.image));
      yield call(action?.payload?.callback, res?.data?.image);
    } else if (res?.data?.meta?.code === 400) {
      yield put(imagesFailure(res));
    }
  } catch (e) {
    yield put(imagesFailure());
  }
}

export function* watchGetImagesAPI() {
  yield takeEvery(GET_IMAGES, getImagesRequest);
}

export default function* rootSaga() {
  yield all([watchGetImagesAPI()]);
}