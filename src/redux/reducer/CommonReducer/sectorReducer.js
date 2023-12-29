import {
  GET_SECTOR,
  GET_SECTOR_SUCCESS,
  GET_SECTOR_FAILURE,
} from "../../action/types";

const INIT_STATE = {
  loading: false,
  sectorArray: null,
};

export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SECTOR:
      return { ...state, loading: true };
    case GET_SECTOR_SUCCESS:
      return { ...state, sectorArray: action.payload, loading: false };
    case GET_SECTOR_FAILURE:
      return { ...state, loading: false, sectorArray: action.payload };
    default:
      return state;
  }
};