import { all, takeEvery, put } from "redux-saga/effects";
import { GET_CATEGORY } from "../../action/types";
import { categorySuccess, categoryFailure } from "../../action";
import API from "../../../utils/api";

function* getCategoryRequest() {
  try {
    const res = yield API.get("/get-category");
    if (res.status === 200) {
      let role = JSON.parse(localStorage.getItem("userData"))?.roles?.[0]?.id
      let newcategory = res.data.category.filter(data => 
        data.available_to_clients !== 0
      )
      let filterResult = {...res.data, category:newcategory}
      yield put(categorySuccess(role === 7 ? filterResult : res?.data));
    } else if (res.data.meta.code === 0) {
      yield put(categoryFailure(res));
    }
  } catch (e) {
    yield put(categoryFailure());
  }
}

export function* watchGetCategoryAPI() {
  yield takeEvery(GET_CATEGORY, getCategoryRequest);
}

export default function* rootSaga() {
  yield all([watchGetCategoryAPI()]);
}