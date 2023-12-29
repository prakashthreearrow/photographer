import { all, takeEvery, put } from "redux-saga/effects";
import { GET_EQUIPEMENT } from "../../action/types";
import { equipementSuccess, equipementFailure } from "../../action";
import API from "../../../utils/api";

function* getEquipementRequest() {
  try {
    const res = yield API.get("/get-equipement");
    if (res.status === 200) {
      yield put(equipementSuccess(res?.data?.data));
    } else if (res.data.meta.code === 0) {
      yield put(equipementFailure(res));
    }
  } catch (e) {
    yield put(equipementFailure());
  }
}

export function* watchGetEquipementAPI() {
  yield takeEvery(GET_EQUIPEMENT, getEquipementRequest);
}

export default function* rootSaga() {
  yield all([watchGetEquipementAPI()]);
}