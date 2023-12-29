import { all, takeEvery, put, call } from "redux-saga/effects";
import { USER_PROFILE } from "../../action/types";
import { userProfileSuccess, userProfileFailure } from "../../action";
import API from "../../../utils/api";
import {
  setLocalStorageItem
} from "../../../utils/helper";

function* getUserProfileRequest(action) {
  try {
    const res = yield API.get(`/user/${action?.payload?.user_profile_id}`);
    if (res?.status === 200) {
      yield put(userProfileSuccess(res?.data?.user));
      yield call(
        setLocalStorageItem,
        "userData",
        JSON.stringify(res?.data?.user)
    );
      yield call(action?.payload?.callback, res?.data?.user);
    } else if (res?.data?.meta?.code === 0) {
      yield put(userProfileFailure(res));
    }
  } catch (e) {
    yield put(userProfileFailure());
  }
}

export function* watchGetUserProfileAPI() {
  yield takeEvery(USER_PROFILE, getUserProfileRequest);
}

export default function* rootSaga() {
  yield all([watchGetUserProfileAPI()]);
}