import {
  DOWNLOAD_INITIAL_MEDIA,
  DOWNLOAD_INITIAL_MEDIA_SUCCESS,
  DOWNLOAD_INITIAL_MEDIA_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  downloadLink: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case DOWNLOAD_INITIAL_MEDIA:
      return { ...state, loading: true };
    case DOWNLOAD_INITIAL_MEDIA_SUCCESS:
      return { ...state, downloadLink: action.payload, loading: false };
    case DOWNLOAD_INITIAL_MEDIA_FAILURE:
      return { ...state, loading: false, downloadLink: action.payload };
    default:
      return state;
  }
};