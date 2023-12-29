import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Footer, MultipleInputTags } from "../CommonComponent";
import { getLocalStorageItem, removeLocalStorageItem } from "../../utils/helper";
import logo from "../../assets/images/logo.svg";
import leftArrowIcon from "../../assets/images/leftArrowIcon.svg";
import {
    clientUpdate
} from "../../redux/action";

const SignUpClient2 = () => {
    const { i18n, t } = useTranslation();

    let userData = JSON.parse(getLocalStorageItem("userData"));

    const [tags, setTags] = useState([]);
    const [email, setEmail] = useState([]);
    const [emailSubmit, setMailSubmit] = useState("");
    const [error, setError] = useState("");
    const [valid, setValid] = useState(true);
    const [validEmail, setValidEmail] = useState("");
    const [onClickButtonToggle, setOnClickButtonToggle] = useState(false);

    const location = useLocation();
    const dispatch = useDispatch();
    const history = useHistory();
 
    useEffect(() => {
        if (getLocalStorageItem("token") && getLocalStorageItem("userData")) {
            if (userData?.roles[0]?.id === 5) {
                if (userData?.is_profile_completed === 1) {
                    history.push("/dashboard");
                }else {
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
                    history.push("/sign-up-client2");
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
        if (location?.state !== undefined) {
          
            if (location?.state?.SignUpClient1) {
                localStorage.setItem("SignUpClient1", JSON.stringify(location?.state?.SignUpClient1));
            }
            localStorage.setItem("SignUpClient", JSON.stringify(location?.state?.SignUpClient));
        }
        changeLanguage({ label: 'onReload', value: userData?.lang });
    }, []);

    useEffect(() => {
        setEmail(tags?.join(","));
    }, [tags]);

    const signUpClient1Prev = (e) => {
        e.preventDefault();
        let SignUpClient = JSON.parse(getLocalStorageItem("SignUpClient"));
        if(SignUpClient?.company_details === "0"){
            history.push({
                pathname: '/sign-up-client',
                state: {
                    SignUpClient: SignUpClient
                }
            });
        }else{
            history.push({
                pathname: '/sign-up-client1',
            });
        }
       
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let SignUpClient = JSON.parse(getLocalStorageItem("SignUpClient"));
        let SignUpClient1 = JSON.parse(getLocalStorageItem("SignUpClient1"));
        window.scrollTo(0, 0);
        setError("");

        let arrayEmailCheck = emailSubmit?.split(",");
        var validation = true;
        if(emailSubmit?.length > 0){
            arrayEmailCheck?.map((email) =>{
                var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (email == "" || !regex.test(email)) {
                    validation = false;
                    setValid(validation);
                }
            })
        }
          
      if(validation){
        if (tags.length === 0) {
            if(emailSubmit?.length > 0){
                let arrayEmail = emailSubmit?.split(",");
                setTags(arrayEmail);
            }
        }
           
            setOnClickButtonToggle(true);
            let client_profile_form = {
                id: userData?.id,
                first_name: SignUpClient?.first_name,
                last_name: SignUpClient?.last_name,
                country_id: SignUpClient?.country_id?.value,
                time_zone: SignUpClient?.time_zone?.label,
                mobile: SignUpClient?.mobile,
                company_details: SignUpClient?.company_details,
                // showreel_link: SignUpClient?.showreel_link,
                // editing_suite: SignUpClient?.editing_suite?.join(","),
                team_email: email?.length > 0 ? email : emailSubmit,
                lang: userData?.lang
            }

            if (SignUpClient1?.position) {
                client_profile_form = {
                    ...client_profile_form,
                    position: SignUpClient1?.position
                }
            }
            if (SignUpClient1?.company_name) {
                client_profile_form = {
                    ...client_profile_form,
                    company_name: SignUpClient1?.company_name
                }
            }
            if (SignUpClient1?.vat_number) {
                client_profile_form = {
                    ...client_profile_form,
                    vat_number: SignUpClient1?.vat_number
                }
            }
            if (SignUpClient1?.company_country) {
                client_profile_form = {
                    ...client_profile_form,
                    company_country: SignUpClient1?.company_country?.value
                }
            }
            if (SignUpClient1?.company_mobile) {
                client_profile_form = {
                    ...client_profile_form,
                    company_mobile: SignUpClient1?.company_mobile
                }
            }
            if (SignUpClient1?.sector) {
                client_profile_form = {
                    ...client_profile_form,
                    sector: SignUpClient1?.sector?.value
                }
            }
            if (SignUpClient1?.team_member) {
                client_profile_form = {
                    ...client_profile_form,
                    team_member: SignUpClient1?.team_member?.value
                }
            }
            if (SignUpClient1?.company_address) {
                client_profile_form = {
                    ...client_profile_form,
                    company_address: SignUpClient1?.company_address
                }
            }
            if (SignUpClient1?.is_confirmed) {
                client_profile_form = {
                    ...client_profile_form,
                    is_confirmed: SignUpClient1?.is_confirmed
                }
            }
       
            dispatch(
                clientUpdate({
                    client_profile_form,
                    callback: (data) => {
                        removeLocalStorageItem("SignUpClient");
                        removeLocalStorageItem("SignUpClient1");
                        removeLocalStorageItem("SignUpClientReverse");
                        if (data) {
                            localStorage.setItem("userData", JSON.stringify(data));
                            history.push("/client-dashboard")
                        }
                    }
                })
            );
      }else{
        setError(t("INPUT_TAG_REQ_VALID"));
      }
       
    };

    const handleKeyDown = (e) => {

        setError("")
        if (e.target.value === "") setValid(true);
        if (e.key !== "Enter") return
        const value = e.target.value
        if (!value.trim()) return

        var valid = true;
        var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (value == "" || !regex.test(value)) {
            valid = false;
            setValid(valid);
        }

        if (valid === false) setError(t("INPUT_TAG_REQ_VALID"));
        if (valid === true) {
            setTags([...tags, value]);
            setError("");
        }
        e.target.value = "";
    }

    const changeLanguage = (event) => {
        if (event.label === 'onReload') {
            i18n.changeLanguage(event.value);
        }
    };

    return (
        <>
            <section className="signUp-main">
                <div className='container'>
                    <div className="logo-center">
                        <img src={logo} className="mx-auto signup_header_logo" alt="logo" />
                    </div>
                    <div className="signUp-inner">
                        <div className="signUp-detail join-section py-4 animated fadeIn">
                            <div className="d-flex align-items-baseline">
                            <img onClick={(e) => { signUpClient1Prev(e) }} src={leftArrowIcon} className="sm:ps-5 arrow arrow-left" alt="logo" />
                                <p className="text-body my-2 text-center">{t("INVITE_A_TEAM_MEMBER")}</p>
                            </div>
                            <div className="signuppage-form join-team">
                                <div className="form-group row my-4">
                                    <MultipleInputTags
                                        handleKeyDown={(e) => handleKeyDown(e)}
                                        onChange={(e) => {
                                            setOnClickButtonToggle(false);
                                            setMailSubmit(e.target.value)
                                        }}
                                        removeTagFlag ={false}
                                        setTags={setTags}
                                        tags={tags}
                                        label={t("ENTER_EMAIL_ADDRESS")}
                                        error={error}
                                    />
                                </div>
                                <div className="text-center signup-btn-container">
                                    <Button disabled={onClickButtonToggle} onClick={(e) => handleSubmit(e)} text={t("DONE")} type="submit" className={`${onClickButtonToggle ? "disable-btn-one" : ""} text-uppercase w-100 signUp-btn`} />
                                </div>
                            </div>
                        </div>

                        <Footer headerDesign={true} />
                    </div>
                </div>

            </section>
        </>
    );
};

export default SignUpClient2;