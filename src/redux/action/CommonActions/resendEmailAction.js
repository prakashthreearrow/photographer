import { RESEND_EMAIL, RESEND_EMAIL_SUCCESS, RESEND_EMAIL_FAILURE } from "../types";

export const resendEmail = (payload) => ({
    type: RESEND_EMAIL,
    payload,
});

export const resendEmailSuccess = (payload) => ({
    type: RESEND_EMAIL_SUCCESS,
    payload,
});

export const resendEmailFailure = () => ({
    type: RESEND_EMAIL_FAILURE,
});