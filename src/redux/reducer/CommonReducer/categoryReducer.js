import {
  GET_CATEGORY,
  GET_CATEGORY_SUCCESS,
  GET_CATEGORY_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  categoryArray: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_CATEGORY:
      return { ...state, loading: true };
    case GET_CATEGORY_SUCCESS:
      return { ...state, categoryArray: action.payload, loading: false };
    case GET_CATEGORY_FAILURE:
      return { ...state, loading: false, categoryArray: action.payload };
    default:
      return state;
  }
};