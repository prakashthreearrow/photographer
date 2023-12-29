import {
  GET_IMAGES,
  GET_IMAGES_SUCCESS,
  GET_IMAGES_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  imagesArray: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_IMAGES:
      return { ...state, loading: true };
    case GET_IMAGES_SUCCESS:
      return { ...state, imagesArray: action.payload, loading: false };
    case GET_IMAGES_FAILURE:
      return { ...state, loading: false, imagesArray: action.payload };
    default:
      return state;
  }
};