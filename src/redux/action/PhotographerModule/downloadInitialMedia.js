import { DOWNLOAD_INITIAL_MEDIA, DOWNLOAD_INITIAL_MEDIA_SUCCESS, DOWNLOAD_INITIAL_MEDIA_FAILURE } from "../types";

export const downloadInitialMedia = (payload) => ({
    type: DOWNLOAD_INITIAL_MEDIA,
    payload,
});

export const downloadInitialMediaSuccess = (payload) => ({
    type: DOWNLOAD_INITIAL_MEDIA_SUCCESS,
    payload,
});

export const downloadInitialMediaFailure = () => ({
    type: DOWNLOAD_INITIAL_MEDIA_FAILURE,
});