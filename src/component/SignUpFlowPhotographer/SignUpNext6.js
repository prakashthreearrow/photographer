import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Footer, Loader } from "../CommonComponent";
import logo from "../../assets/images/logo.svg";
import { removeLocalStorageItem, getLocalStorageItem } from "../../utils/helper";

export default function SignUpNext6() {
    const { i18n, t } = useTranslation();

    const loading = useSelector((state) => state?.Register?.loading);

    const history = useHistory();

    let userData = JSON.parse(getLocalStorageItem("userData"));
    let SignUpNext2 = JSON.parse(getLocalStorageItem("SignUpNext2"));

    useEffect(() => {
        changeLanguage({ label: 'onReload', value: userData?.lang });
        if (getLocalStorageItem("token") && getLocalStorageItem("userData")) {
            if (userData?.roles[0]?.id === 5) {
                if (userData?.is_profile_completed === 1) {
                    history.push("/dashboard");
                }else {
                    if(SignUpNext2?.maximum_commuting_id){
                        history.push("/sign-up-next6");
                      }else if(userData?.is_updated_steps === "4"){
                        history.push("/sign-up-next6");
                      }else{
                        history.push("/sign-up-next2");
                      }

                    
                }
            } else if (userData?.roles[0]?.id === 7) {
                if (userData?.is_profile_completed === 1) {
                    history.push("/client-dashboard");
                } else {
                    history.push("/sign-up-client");
                }
            }else if (userData?.roles[0]?.id === 6) {
                if (userData?.is_profile_completed === 1) {
                    history.push("/editor-dashboard");
                } else {
                    history.push("/sign-up-editor");
                }
            }
        } else {
            history.push("/");
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        removeLocalStorageItem("downloadLink");
        removeLocalStorageItem("userData");
        removeLocalStorageItem("userId");
        removeLocalStorageItem("SignUpNext2");
        removeLocalStorageItem("token");
        history.push("/");
    };

    const changeLanguage = (event) => {
        if (event.label === 'onReload') {
            i18n.changeLanguage(event.value);
        }
    };

    return (
        <>
            {loading && <Loader />}
            <section className="signUpNext6-main">
                <div className='container'>
                    <div className='text-center'>
                        <img src={logo} className="header-logo" alt="logo" />
                    </div>
                    <div className="row justify-content-center" >
                        <div className="col-10 col-md-7 col-sm-12 px-5 py-5 signUpNext6-detail animated fadeIn">
                            <div className="d-flex justify-content-center">
                                <h2 className="thank-you">{t("THANK_YOU")}</h2>
                            </div>
                            <form className="mx-xl-10" onSubmit={(e) => handleSubmit(e)}>
                                <div className="row justify-content-center">
                                    <p className='thank-you-text'>
                                        {t("YOU_WILL_RECEIVE_AN_ACTIVATION")}
                                    </p>
                                </div>

                                <div className="text-center mt-5">
                                    <Button text={t("LOGIN")} type="submit" className="mt-1 signUpNext6-button" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <Footer headerDesign={true} />
            </section>
        </>
    );
};