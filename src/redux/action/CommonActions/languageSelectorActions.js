import { LANGUAGE_SELECTOR, LANGUAGE_SELECTOR_SUCCESS, LANGUAGE_SELECTOR_FAILURE } from "../types";

export const languageSelector = (payload) => ({
    type: LANGUAGE_SELECTOR,
    payload,
});

export const languageSelectorSuccess = (payload) => ({
    type: LANGUAGE_SELECTOR_SUCCESS,
    payload,
});

export const languageSelectorFailure = () => ({
    type: LANGUAGE_SELECTOR_FAILURE,
});