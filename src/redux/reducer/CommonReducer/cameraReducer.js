import {
  GET_CAMERA,
  GET_CAMERA_SUCCESS,
  GET_CAMERA_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  cameraArray: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CAMERA:
      return { ...state, loading: true };
    case GET_CAMERA_SUCCESS:
      return { ...state, cameraArray: action.payload, loading: false };
    case GET_CAMERA_FAILURE:
      return { ...state, loading: false, cameraArray: action.payload };
    default:
      return state;
  }
};