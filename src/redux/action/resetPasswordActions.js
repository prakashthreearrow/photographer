import {
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
} from "./types";

export const resetPassword = (payload) => ({
  type: RESET_PASSWORD,
  payload,
});

export const resetPasswordSuccess = () => ({
  type: RESET_PASSWORD_SUCCESS,
});

export const resetPasswordFailure = () => ({
  type: RESET_PASSWORD_FAILURE,
});
