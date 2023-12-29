import {
  RESET_PASSWORD,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_SUCCESS,
} from "../action/types";

const INIT_STATE = {
  loading: false,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case RESET_PASSWORD:
      return { ...state, loading: true };
    case RESET_PASSWORD_SUCCESS:
      return { ...state, loading: false };
    case RESET_PASSWORD_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
};
