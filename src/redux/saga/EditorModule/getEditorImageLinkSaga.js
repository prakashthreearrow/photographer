
import { all, call, put, takeEvery } from "redux-saga/effects";
import { GET_EDITOR_IMAGE_LINK } from "../../action/types";
import { getEditorImageLinkFailure, getEditorImageLinkSuccess } from "../../action";
import API from "../../../utils/api";

function* getEditorImageLinkRequest(action) {
    try {
        let request, request1
        if(action?.payload?.getImageListPayload?.editor_id){
            request =  `download-aditional-media-editor?editor_id=${action?.payload?.getImageListPayload?.editor_id}&job_id=${action?.payload?.getImageListPayload?.job_id}`
            request1 = true
        } else {
            request = `check-editor-download-media?editor_id=${action?.payload?.getImageListPayload?.user_profile_id}&job_id=${action?.payload?.getImageListPayload?.job_id}`
        }        
    
        const res = yield API.get(request);
        if (res?.status === 200) {
            yield put(getEditorImageLinkSuccess(res?.data));
            yield call(action?.payload?.callback, res?.data, request1);
        } else if (res?.data?.code === 400) {
            yield put(getEditorImageLinkFailure());
        }
    } catch (e) {
        yield put(getEditorImageLinkFailure());
    }
}

export function* watchEditorImageLinkAPI() {
    yield takeEvery(GET_EDITOR_IMAGE_LINK, getEditorImageLinkRequest);
}

export default function* rootSaga() {
    yield all([watchEditorImageLinkAPI()]);
}