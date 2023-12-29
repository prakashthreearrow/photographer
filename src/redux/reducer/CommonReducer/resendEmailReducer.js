import {
    RESEND_EMAIL,
    RESEND_EMAIL_SUCCESS,
    RESEND_EMAIL_FAILURE,
} from "../../action/types";

const INIT_STATE = {
    loading: false,
    resendEmail:null
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case RESEND_EMAIL:
            return { ...state, loading: true };
        case RESEND_EMAIL_SUCCESS:
            return { ...state, resendEmail: action.payload, loading: false };
        case RESEND_EMAIL_FAILURE:
            return { ...state, loading: false };
        default:
            return state;
    }
};