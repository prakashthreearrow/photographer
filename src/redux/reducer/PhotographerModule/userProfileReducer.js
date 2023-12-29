import {
  USER_PROFILE,
  USER_PROFILE_SUCCESS,
  USER_PROFILE_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  userProfile: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case USER_PROFILE:
      return { ...state, loading: true };
    case USER_PROFILE_SUCCESS:
      return { ...state, userProfile: action.payload, loading: false };
    case USER_PROFILE_FAILURE:
      return { ...state, loading: false, userProfile: action.payload };
    default:
      return state;
  }
};