
import { all, call, put, takeEvery } from "redux-saga/effects";
import { REQUEST_REUPLOAD } from "../../action/types";
import { requestReUploadFailure, requestReUploadSuccess } from "../../action";
import API from "../../../utils/api";

function* requestReUploadRequest(action) {
    try {
        let request, res
        let request1 
        if(action?.payload?.reUploadRequest?.photographer_id){
            request = `download-aditional-media-photographer?photographer_id=${action?.payload?.reUploadRequest?.photographer_id}&job_id=${action?.payload?.reUploadRequest?.job_id}`
            res = yield API.get(request, action?.payload?.reUploadRequest);   
            request1 = true     
        } else {
            res = yield API.post("request-reupload", action?.payload?.reUploadRequest);        
        }
              
        if (res?.data?.code === 200) {
            if(request1){
                yield put(requestReUploadSuccess(res?.data));
                yield call(action?.payload?.callback, res?.data, request1);
            }else {
                yield put(requestReUploadSuccess(res?.data?.data[0]));
                yield call(action?.payload?.callback, res?.data?.data[0]);
            }
        } else if (res?.data?.code === 400) {
            yield put(requestReUploadFailure());
            yield call(action?.payload?.callback, res?.data?.errors[0]);
        }
    } catch (e) {
        yield put(requestReUploadFailure());
    }
}

export function* watchRequestReUploadAPI() {
    yield takeEvery(REQUEST_REUPLOAD, requestReUploadRequest);
}

export default function* rootSaga() {
    yield all([watchRequestReUploadAPI()]);
}