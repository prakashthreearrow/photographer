import {
    PHOTOGRAPHER_PRODUCTION_ADDITIONAL_MEDIA,
    PHOTOGRAPHER_PRODUCTION_ADDITIONAL_MEDIA_SUCCESS,
    PHOTOGRAPHER_PRODUCTION_ADDITIONAL_MEDIA_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    photoGrapherProductionAdditionalMedia :null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case PHOTOGRAPHER_PRODUCTION_ADDITIONAL_MEDIA:
            return { ...state, loading: true };
        case PHOTOGRAPHER_PRODUCTION_ADDITIONAL_MEDIA_SUCCESS:
            return { ...state, photoGrapherJob: action.payload, loading: false };
        case PHOTOGRAPHER_PRODUCTION_ADDITIONAL_MEDIA_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};