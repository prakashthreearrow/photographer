import {
  DELETE_RAW_IMAGE,
  DELETE_RAW_IMAGE_SUCCESS,
  DELETE_RAW_IMAGE_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case DELETE_RAW_IMAGE:
      return { ...state, loading: true };
    case DELETE_RAW_IMAGE_SUCCESS:
      return { ...state, loading: false };
    case DELETE_RAW_IMAGE_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};