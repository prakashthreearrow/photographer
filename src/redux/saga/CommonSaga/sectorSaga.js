import { all, takeEvery, put } from "redux-saga/effects";
import { GET_SECTOR } from "../../action/types";
import { sectorSuccess, sectorFailure } from "../../action";
import API from "../../../utils/api";

function* getSectorRequest() {
  try {
    const res = yield API.get("/get-sector");
    if (res.status === 200) {
      yield put(sectorSuccess(res?.data));
    } else if (res.data.meta.code === 0) {
      yield put(sectorFailure(res));
    }
  } catch (e) {
    yield put(sectorFailure());
  }
}

export function* watchGetSectorAPI() {
  yield takeEvery(GET_SECTOR, getSectorRequest);
}

export default function* rootSaga() {
  yield all([watchGetSectorAPI()]);
}