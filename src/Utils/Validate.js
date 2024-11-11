export const validateRegForm = (payload) => {
    const errors = {};
    let message = "";
    let isFormValid = true;

    if (!payload || typeof payload.email !== "string" || payload.email.trim().length === 0 ) {
        isFormValid = false;
        errors.email = "err_email_req";
    }

    if (!payload || typeof payload.password !== "string" || payload.password.trim().length < 8) {
        isFormValid = false;
        if(payload.password.trim().length === 0){
            errors.password = "err_password_req";
        }else{
            errors.password = "err_password_min8";
        };
    }

    if (!payload || typeof payload.password_rep !== "string" || payload.password_rep.trim().length < 8) {
        isFormValid = false;
        if(payload.password_rep.trim().length === 0){
            errors.password_rep = "err_password_rep_req";
        }else{
            errors.password_rep = "err_password_rep_min8";
        };
    }

    if(isFormValid && (payload.password !== payload.password_rep) ) {
        isFormValid = false;
        errors.password = "err_password_not_match";
        errors.password_rep = "err_password_not_match";
    }

    if (!isFormValid) {
        message = "err_form_failed";
    }

    return {
        success: isFormValid,
        message,
        errors
    };
}

export const validateLoginForm = (payload) => {
    const errors = {};
    let message = "";
    let isFormValid = true;

    if (!payload || typeof payload.email !== "string" || payload.email.trim().length === 0 ) {
        isFormValid = false;
        errors.email = "err_email_req";
    }

    if (!payload || typeof payload.password !== "string" || payload.password.trim().length < 8) {
        isFormValid = false;
        if(payload.password.trim().length === 0){
            errors.password = "err_password_req";
        }else{
            errors.password = "err_password_min8";
        };
    }

    if (!isFormValid) {
        message = "err_form_failed";
    }

    return {
        success: isFormValid,
        message,
        errors
    };
}