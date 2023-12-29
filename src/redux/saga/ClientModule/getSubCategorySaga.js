
import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_SUB_CATEGORY } from "../../action/types";
import { getSubCategoryFailure, getSubCategorySuccess } from "../../action";
import API from "../../../utils/api";

function* getSubCategoryRequest(action) {
    try {
        const res = yield API.get(`get-subcategory?category_id=${action?.payload?.sub_category_id}`);
        if (res?.data?.code === 200) {
            yield put(getSubCategorySuccess(res?.data));

            yield call(action?.payload?.callback, res?.data);
        } else if(res?.data?.code === 400) {
            yield put(getSubCategoryFailure());
            yield call(action?.payload?.callback, res?.data?.errors[0]);
        }
    } catch (e) {
        yield put(getSubCategoryFailure());
    }
}

export function* watchGetSubCategoryAPI() {
    yield takeEvery(GET_SUB_CATEGORY, getSubCategoryRequest);
}

export default function* rootSaga() {
    yield all([watchGetSubCategoryAPI()]);
}