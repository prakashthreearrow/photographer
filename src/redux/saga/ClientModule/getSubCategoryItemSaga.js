
import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_SUB_CATEGORY_ITEM } from "../../action/types";
import { getSubCategoryItemFailure, getSubCategoryItemSuccess } from "../../action";
import API from "../../../utils/api";

function* getSubCategoryItemRequest(action) {
    try {
        const res = yield API.get(`get-subcategory-items?sub_category_id=${action?.payload?.subcategory_item_id}`);
        if (res?.data?.code === 200) {
            yield put(getSubCategoryItemSuccess(res?.data));

            yield call(action?.payload?.callback, res?.data);
        } else if(res?.data?.code === 400) {
            yield put(getSubCategoryItemFailure());
            yield call(action?.payload?.callback, res?.data?.errors[0]);
        }
    } catch (e) {
        yield put(getSubCategoryItemFailure());
    }
}

export function* watchGetSubCategoryItemAPI() {
    yield takeEvery(GET_SUB_CATEGORY_ITEM, getSubCategoryItemRequest);
}

export default function* rootSaga() {
    yield all([watchGetSubCategoryItemAPI()]);
}