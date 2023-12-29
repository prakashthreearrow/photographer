import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from "react-router-dom";
import { Button, Footer } from "../CommonComponent";
import logo from "../../assets/images/logo.svg";
import leftArrowIcon from "../../assets/images/leftArrowIcon.svg";
import validateSignUpNext4 from "../../validation/SignUpFlowPhotographer/SignUpNext4";
import { getLocalStorageItem } from "../../utils/helper";

export default function SignUpNext() {
    const { i18n, t } = useTranslation();

    const [form, setForm] = useState({
        month_1: "",
        month_2: "",
        month_3: ""
    });

    let userData = JSON.parse(getLocalStorageItem("userData"));
    let SignUpNext = JSON.parse(getLocalStorageItem("SignUpNext"));

    const [error, setError] = useState({});
    const [isForm, setIsform] = useState(false);

    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
        changeLanguage({ label: 'onReload', value: userData?.lang });
        if (getLocalStorageItem("token") && getLocalStorageItem("userData")) {
            if (userData?.roles[0]?.id === 5) {
                if (userData?.is_profile_completed === 1) {
                    history.push("/dashboard");
                }else {
                    if (userData?.is_profile_completed === 0) {
                        if(SignUpNext?.camera_id){
                            history.push("/sign-up-next2");
                          }else if(userData?.is_updated_steps === "2"){
                            history.push("/sign-up-next2");
                          }else{
                            history.push("/sign-up-next3");
                          }

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

    useEffect(() => {
        setForm((prevState) => ({
            ...prevState,
            month_1: form?.month_1 || location?.state?.SignUpNext4?.month_1 || location?.SignUpNext4?.month_1 || "",
            month_2: form?.month_2 || location?.state?.SignUpNext4?.month_2 || location?.SignUpNext4?.month_2 || "",
            month_3: form?.month_3 || location?.state?.SignUpNext4?.month_3 || location?.SignUpNext4?.month_3 || "",
        }));
    }, [location?.state?.SignUpNext4, location?.SignUpNext4]);

    const signUpNext3Prev = (e) => {
        e.preventDefault();
        history.push({
            pathname: '/sign-up-next3',
            state: {
                SignUp: location?.state?.SignUp, SignUpNext: location?.state?.SignUpNext, SignUpNext2: location?.state?.SignUpNext2,
                SignUpNext3: location?.state?.SignUpNext3, SignUpNext4: location?.state?.SignUpNext4, SignUpNext5: location?.state?.SignUpNext5
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { errors, isValid } = validateSignUpNext4(form, t);

        if (isValid) {
            if (!isForm) {
                history.push({
                    pathname: '/sign-up-next5',
                    state: {
                        SignUp: location?.state?.SignUp || location?.SignUp, SignUpNext: location?.state?.SignUpNext || location?.SignUpNext, SignUpNext2: location?.state?.SignUpNext2 || location?.SignUpNext2,
                        SignUpNext3: location?.state?.SignUpNext3 || location?.SignUpNext3, SignUpNext4: location?.state?.SignUpNext4 || location?.SignUpNext4, SignUpNext5: location?.state?.SignUpNext5 || location?.SignUpNext5
                    }
                });
            } else {
                history.push({
                    pathname: '/sign-up-next5',
                    state: {
                        SignUp: location?.state?.SignUp || location?.SignUp, SignUpNext: location?.state?.SignUpNext || location?.SignUpNext, SignUpNext2: location?.state?.SignUpNext2 || location?.SignUpNext2,
                        SignUpNext3: location?.state?.SignUpNext3 || location?.SignUpNext3, SignUpNext4: form
                    }
                });
            }
        } else {
            setError(errors);
        }
    };

    const changeLanguage = (event) => {
        if (event.label === 'onReload') {
            i18n.changeLanguage(event.value);
        }
    };

    const changeHandler = (e, name) => {
        setIsform(true);
        if (e.target) {
            const value = e.target.value;
            const { name } = e.target;
            setError((prevState) => ({
                ...prevState,
                [name]: "",
            }));
            setForm((prevState) => ({
                ...prevState, [name]: value,
            }));
        } else {
            const { value } = e;
            setError((prevState) => ({
                ...prevState,
                [name]: "",
            }));
            setForm((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    return (
        <>
            <section className="signUpNext4-main ">
                <div className='container'>
                    <div className='text-center'>
                        <img src={logo} className="header-logo" alt="logo" />
                    </div>
                    <div className="row justify-content-center" >
                        <div className="col-12 col-md-7 col-sm-12 py-5 signUpNext4-detail animated fadeIn">
                            <div className='progress_line'></div>
                            <div className='progress_line_white'></div>
                            <div className="d-flex justify-content-between position-relative photo-signup-header">
                                <img onClick={(e) => { signUpNext3Prev(e) }} src={leftArrowIcon} className="mx-auto" alt="logo" />

                                <p className="text-body my-2">{t("WOULD_YOU_BE_AVAILABLE")}</p>
                                <span></span>
                            </div>
                            <form className="mx-auto" onSubmit={(e) => handleSubmit(e)}>
                                <div className="row justify-content-start justify-content-sm-center ">

                                    <div className="form-group my-3 row w-auto es-width">
                                        <div className="options d-flex flex-column flex-md-row justify-content-start justify-content-md-center align-items-md-center gap-2 ">
                                            <div className="ms-2 margin-right-35">
                                                {t("MONTH1")}
                                            </div>
                                            <div className='d-flex flex-row-reverse min-width-120px justify-content-end'>
                                                <input id="test3" onChange={(e) => { changeHandler(e) }} type="radio" name="month_1" value="1" checked={form?.month_1 === "1"} />
                                                {t("MORNINGS")}
                                                <label htmlFor="test3" title="item1" className="me-2 d-flex align-items-center">
                                                </label>
                                            </div>

                                            <div className='d-flex flex-row-reverse min-width-120px justify-content-end'>
                                                <input id="test4" onChange={(e) => { changeHandler(e) }} type="radio" name="month_1" value="2" checked={form?.month_1 === "2"} />
                                                {t("AFTERNOONS")}
                                                <label htmlFor="test4" title="item2" className="me-2 d-flex align-items-center "></label>
                                            </div>
                                            <div className='d-flex flex-row-reverse min-width-120px justify-content-end'>
                                                <input id="test5" onChange={(e) => { changeHandler(e) }} type="radio" name="month_1" value="3" checked={form?.month_1 === "3"} />
                                                {t("ALL_DAY")}
                                                <label htmlFor="test5" title="item3" className="me-2 d-flex align-items-center "></label>
                                            </div>
                                        </div>
                                        {error?.month_1 && <div className="invalid text-center pt-2">{error?.month_1}</div>}
                                    </div>
                                    <div className="form-group row my-3 w-auto es-width">
                                        <div className="options d-flex flex-column flex-md-row justify-content-start justify-content-md-center align-items-md-center gap-2 ">
                                            <div className="ms-2 margin-right-35">
                                                {t("MONTH2")}
                                            </div>
                                            <div className='d-flex flex-row-reverse justify-content-end min-width-120px'>
                                                <input id="test6" onChange={(e) => { changeHandler(e) }} type="radio" name="month_2" value="1" checked={form?.month_2 === "1"} />
                                                {t("MORNINGS")}
                                                <label htmlFor="test6" title="item1" className="me-2 d-flex align-items-center">
                                                </label>
                                            </div>
                                            <div className='d-flex flex-row-reverse justify-content-end min-width-120px'>
                                                <input id="test7" onChange={(e) => { changeHandler(e) }} type="radio" name="month_2" value="2" checked={form?.month_2 === "2"} />
                                                {t("AFTERNOONS")}
                                                <label htmlFor="test7" title="item2" className="me-2 d-flex align-items-center "></label>
                                            </div>
                                            <div className='d-flex flex-row-reverse justify-content-end min-width-120px'>
                                                <input id="test8" onChange={(e) => { changeHandler(e) }} type="radio" name="month_2" value="3" checked={form?.month_2 === "3"} />
                                                {t("ALL_DAY")}
                                                <label htmlFor="test8" title="item3" className="me-2 d-flex align-items-center "></label>
                                            </div>
                                        </div>
                                        {error?.month_2 && <div className="invalid text-center pt-2">{error?.month_2}</div>}
                                    </div>
                                    <div className="form-group row my-3 w-auto es-width">
                                        <div className="options d-flex flex-column flex-md-row justify-content-start justify-content-md-center align-items-md-center gap-2 ">
                                            <div className="ms-2 margin-right-35">
                                                {t("MONTH3")}
                                            </div>
                                            <div className='d-flex flex-row-reverse justify-content-end min-width-120px' >
                                                <input id="test9" onChange={(e) => { changeHandler(e) }} type="radio" name="month_3" value="1" checked={form?.month_3 === "1"} />
                                                {t("MORNINGS")}
                                                <label htmlFor="test9" title="item1" className="me-2 d-flex align-items-center">
                                                </label>
                                            </div>
                                            <div className='d-flex flex-row-reverse justify-content-end min-width-120px'>
                                                <input id="test10" onChange={(e) => { changeHandler(e) }} type="radio" name="month_3" value="2" checked={form?.month_3 === "2"} />
                                                {t("AFTERNOONS")}
                                                <label htmlFor="test10" title="item2" className="me-2 d-flex align-items-center "></label>
                                            </div>
                                            <div className='d-flex flex-row-reverse justify-content-end min-width-120px'>
                                                <input id="test11" onChange={(e) => { changeHandler(e) }} type="radio" name="month_3" value="3" checked={form?.month_3 === "3"} />
                                                {t("ALL_DAY")}
                                                <label htmlFor="test11" title="item3" className="me-2 d-flex align-items-center "></label>
                                            </div>
                                        </div>
                                        {error?.month_3 && <div className="invalid text-center pt-2">{error?.month_3}</div>}
                                    </div>

                                </div>
                                <div className="form-group row my-3 w-auto es-width">
                                <div className="set_width mx-auto">
                                    <p className="text-353535">
                                        * {t("THIS_ONLY_GIVES_US_A_ROUGH")}</p>
                                    <p className='text-353535'>{t("WE_UNDERSTAND_THAT_IT_IS_SUBJECT")}
                                    </p>
                                </div>
                                <div className='d-flex justify-content-center'>
                                    <Button text={t("NEXT")} type="submit" className="text-uppercase mt-1 signUpNext4-button" />
                                </div>
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