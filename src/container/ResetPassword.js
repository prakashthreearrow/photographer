import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useHistory, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Footer, Loader } from "../component/CommonComponent";
import { ErrorToast } from "../utils/helper";
import logo from "../assets/images/logo1.png";
import validateResetPassword from "../validation/resetPassword";
import { getLocalStorageItem } from "../utils/helper";
import { resetPassword } from "../redux/action";
import client_right_image from "../assets/images/creative-img.jpeg";

const ResetPassword = () => {
    const { t } = useTranslation();
    const [form, setForm] = useState({
        password: "",
        confirm_password: "",
    });

    const params = new URLSearchParams(window.location.search);
    const reset_email = params.get('email');
    const reset_token = params.get('token');

    let userData = JSON.parse(getLocalStorageItem("userData"));

    const [error, setError] = useState({});
    const [onClickButtonToggle, setOnClickButtonToggle] = useState(false);

    const history = useHistory();
    const dispatch = useDispatch();

    const loading = useSelector((state) => state?.ResetPassword?.loading);

    useEffect(() => {
        if (getLocalStorageItem("token") && getLocalStorageItem("userData")) {
            if (userData?.is_profile_completed === 1) {
                history.push("/dashboard");
            } else if (userData?.is_profile_completed === 0) {
                if (userData?.is_updated_steps === "1") {
                    history.push("/sign-up-next");
                  } else if (userData?.is_updated_steps === "2") {
                    history.push("/sign-up-next2");
                  } else if (userData?.is_updated_steps === "3") {
                    history.push("/sign-up-next3");
                  } else if (userData?.is_updated_steps === "4") {
                    history.push("/sign-up-next5");
                  } else if (
                    userData?.is_updated_steps === "0"
                  ) {
                    history.push("/sign-up");
                  }
            }
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const { errors, isValid } = validateResetPassword(form, t);
        if (isValid) {
            setOnClickButtonToggle(true);
            if (form?.password !== form?.confirm_password) {
                toast.error(<ErrorToast msg="Passwords do not match." />);
                return null;
            } else if (form?.password?.length < 6) {
                toast.error(<ErrorToast msg="The password must be at least 6 characters." />);
                return null;
            } else {
                let payload = {
                    email: reset_email,
                    password: form?.password,
                    token: reset_token
                };
                dispatch(
                    resetPassword({
                        form: payload,
                        callback: () => {
                            history.push("/");
                        },
                    })
                );
            }
        } else {
            setError(errors);
        }
    };

    const changeHandler = (e, name) => {
        setOnClickButtonToggle(false);
        if (e.target) {
            const { name, value } = e.target;
            setError((prevState) => ({
                ...prevState,
                [name]: "",
            }));
            setForm((prevState) => ({ ...prevState, [name]: value }));
        } else {
            const { value } = e;
            setError((prevState) => ({
                ...prevState,
                [name]: "",
            }));
            setForm((prevState) => ({ ...prevState, [name]: value }));
        }
    };

    return (
        <>
            {loading && <Loader />}
            <section className={`login-main-right-bg login_animation`}>
                <div className='container'>
                    <div className="header-logo">
                        <img src={logo} className="mx-auto login_header_logo" alt="logo" />
                    </div>
                    <div className="row login-box ">
                        <div className="col-12 col-lg-6 main-login-section reset-password-wrap">
                            <div className="login-detail s-top">
                                <div className="d-block client-creative-toggler text-center">
                                    <p className="text-body form-pages-title my-2">{t("RESET_PASSWORD")}</p>
                                    <form className="social-login-form" onSubmit={(e) => handleSubmit(e)}>
                                        <div className="form-group mt-5 mb-2 toggle-left-input-top-margin">
                                            <Input
                                                name="password"
                                                value={form?.password}
                                                onChange={(e) => changeHandler(e)}
                                                type='password'
                                                error={error?.password}
                                                label={t("PASSWORD")}
                                            />
                                        </div>
                                        <div className="form-group mb-4 toggle-left-input-top-margin">
                                            <Input
                                                name="confirm_password"
                                                value={form?.confirm_password}
                                                onChange={(e) => changeHandler(e)}
                                                type='password'
                                                error={error?.confirm_password}
                                                label={t("CONFIRM_PASSWORD")}
                                            />
                                        </div>
                                        <div className="form-group d-flex justify-content-center">
                                            <Link className="register-link text-decoration-none text-uppercase" to="/forgot-password">
                                                {t("FORGOT_PASSWORD_LINK")}
                                            </Link>
                                        </div>
                                        <div className="text-center w-100">
                                            <Button disabled={onClickButtonToggle} text="RESET PASSWORD" type="submit" className={`${onClickButtonToggle ? "disable-btn-one" : ""} mt-3 w-100 login-btn`} />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-10 col-md-8 col-lg-6 client-right-img creative-right-img">
                            <img className="client-right-image-section" src={client_right_image} />
                        </div>
                    </div>
                </div>
                <Footer headerDesign={true} />
            </section>
        </>
    );
};

export default ResetPassword;