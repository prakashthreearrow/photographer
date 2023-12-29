import {
  GET_IMAGES,
  GET_IMAGES_SUCCESS,
  GET_IMAGES_FAILURE,
} from "../types";

export const imagesType = (payload) => ({
  type: GET_IMAGES,
  payload
});

export const imagesSuccess = (payload) => ({
  type: GET_IMAGES_SUCCESS,
  payload,
});

export const imagesFailure = () => ({
  type: GET_IMAGES_FAILURE,
});