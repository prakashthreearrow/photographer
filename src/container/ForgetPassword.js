import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, Footer, Loader } from "../component/CommonComponent";
import logo from "../assets/images/logo1.png";
import validateForgotPassword from "../validation/forgotPassword";
import { getLocalStorageItem } from "../utils/helper";
import { forgotPassword } from "../redux/action";
import client_right_image from "../assets/images/creative-img.jpeg";

const ForgotPassword = () => {
    const { t } = useTranslation();
    const [form, setForm] = useState({
        email: "",
    });

    let userData = JSON.parse(getLocalStorageItem("userData"));

    const [error, setError] = useState({});
    const [onClickButtonToggle, setOnClickButtonToggle] = useState(false);

    const history = useHistory();
    const dispatch = useDispatch();

    const loading = useSelector((state) => state?.ForgotPassword?.loading);

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
        window.scrollTo(0, 0);
        const { errors, isValid } = validateForgotPassword(form);

        if (isValid) {
            setOnClickButtonToggle(true);
            let profileForm = {
                email: form?.email
            };
            dispatch(
                forgotPassword({
                    profileForm,
                    callback: () => {
                        history.push("/");
                    }
                })
            );
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
                    <div className="row login-box reset-pwd-box">
                        <div className="col-12 col-lg-6 main-login-section reset-password-wrap">
                            <div className="login-detail s-top">
                                <div className="d-block client-creative-toggler text-center">
                                    <p className="text-body form-pages-title my-2">{t("FORGOT_PASSWORD")}</p>
                                    <form className="social-login-form" onSubmit={(e) => handleSubmit(e)}>
                                        <div className="form-group mt-3 mb-4 toggle-left-input-top-margin">
                                            <Input
                                                type="text"
                                                className=""
                                                name="email"
                                                value={form?.email}
                                                onChange={(e) => changeHandler(e)}
                                                error={error?.email}
                                                maxLength="100"
                                                label={t("EMAIL")}
                                            />
                                        </div>
                                        <div className="form-group mb-4 d-flex justify-content-center">
                                            <Link className="register-link text-decoration-none text-uppercase" to="/">
                                            {t("BACK_TO_LOGIN")}
                                            </Link>
                                        </div>
                                        <div className="text-center w-100">
                                            <Button disabled={onClickButtonToggle} text={t("FORGOT_PASSWORD_BUTTON")} type="submit" className={`${onClickButtonToggle ? "disable-btn-one" : ""} w-100 login-btn`} />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-10 col-md-8 col-lg-6 client-right-img creative-right-img ">
                            <img className="client-right-image-section" src={client_right_image} alt="client" />
                            
                        </div>
                    </div>
                </div>
                <Footer headerDesign={true} />
            </section>
        </>
    );
};

export default ForgotPassword;