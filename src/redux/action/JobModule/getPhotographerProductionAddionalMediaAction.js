import { PHOTOGRAPHER_PRODUCTION_ADDITIONAL_MEDIA, PHOTOGRAPHER_PRODUCTION_ADDITIONAL_MEDIA_SUCCESS, PHOTOGRAPHER_PRODUCTION_ADDITIONAL_MEDIA_FAILURE } from "./../types";

export const getPhotographerProductionAdditionalMedia = (payload) => ({
    type: PHOTOGRAPHER_PRODUCTION_ADDITIONAL_MEDIA,
    payload,
});

export const getPhotographerProductionAdditionalMediaSuccess = (payload) => ({
    type: PHOTOGRAPHER_PRODUCTION_ADDITIONAL_MEDIA_SUCCESS,
    payload,
});

export const getPhotographerProductionAdditionalMediaFailure = () => ({
    type: PHOTOGRAPHER_PRODUCTION_ADDITIONAL_MEDIA_FAILURE,
});