import {
  IMAGES_UPLOAD,
  IMAGES_UPLOAD_SUCCESS,
  IMAGES_UPLOAD_FAILURE,
} from "../types";

export const imagesUploadType = (payload) => ({
  type: IMAGES_UPLOAD,
  payload
});

export const imagesUploadSuccess = (payload) => ({
  type: IMAGES_UPLOAD_SUCCESS,
  payload,
});

export const imagesUploadFailure = () => ({
  type: IMAGES_UPLOAD_FAILURE,
});