import React from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLocalStorageItem } from "../utils/helper";
import logo from "../assets/images/logo1.png";

const NotFound = () => {
    const { i18n, t } = useTranslation();
    const history = useHistory();

    let userData = JSON.parse(getLocalStorageItem("userData"));

    const handleGoBack = () => {
        if (getLocalStorageItem("token") && getLocalStorageItem("userData")) {
            if (userData?.roles[0]?.id === 5) {
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
            } else if (userData?.roles[0]?.id === 7) {
                if (userData?.is_profile_completed === 1) {
                    history.push("/client-dashboard");
                } else {
                    history.push("/sign-up-client");
                }
            } else if (userData?.roles[0]?.id === 6) {
                if (userData?.is_profile_completed === 1) {
                    history.push("/editor-dashboard");
                } else {
                    history.push("/sign-up-editor");
                }
            }
        } else {
            history.push("/");
        }
    };

    return (
        <>
            <section className="not-found">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-10 col-md-5">
                            <div className="text-center">
                                <img src={logo} className="img-fluid mx-auto w-25" alt="logo" />
                                <h1 className="">404</h1>
                                <h2 className="">
                                    {t("NOT_FOUND_MESSAGE")}
                                </h2>
                                <div className="container text-center d-flex justify-content-center mt-4">
                                    <button
                                        className="btn btn-outline-info home-btn"
                                        onClick={handleGoBack}
                                    >
                                        {t("GO_BACK")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default NotFound;