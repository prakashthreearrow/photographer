import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from "react-router-dom";
import { Button, Input, Footer, SelectDropDown, InputNumberCountryCodeCountryFlagDropDown } from "../CommonComponent";
import validateSignUpClient from "../../validation/SignUpFlowClient/signUpFlowClient";
import { getLocalStorageItem, removeLocalStorageItem } from "../../utils/helper";
import logo from "../../assets/images/logo.svg";
import tickIcon from "../../assets/images/tick.svg";

const SignUpClient = () => {
    const { i18n, t } = useTranslation();

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        country_id: [],
        time_zone: [],
        mobile: "",
        default_country: "CL",
        company_details: "",

    });

    const ct = require('countries-and-timezones');
    const countries = ct.getAllCountries();
    let userData = JSON.parse(getLocalStorageItem("userData"));

    const [error, setError] = useState({});
    const [countryArray, setCountryArray] = useState([]);
    const [timeZoneArray, setTimeZoneArray] = useState([]);

    const location = useLocation();
    const history = useHistory();

    //country list for dropdown with timezone
    useEffect(() => {
        const countryNames = Object.values(countries);

        let sortedCountry = countryNames.sort(function (a, b) {
            var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
            if (nameA < nameB) //sort string ascending
                return -1;
            if (nameA > nameB)
                return 1;
            return 0; //default return value (no sorting)
        });

        if (sortedCountry?.length > 0) {
            let countries = sortedCountry?.map((itm) => ({
                label: `${itm.name}`,
                value: itm.id,
            }));
            setCountryArray(countries);

            let timeZoneSelected = sortedCountry?.find(ele => ele?.id === form?.country_id?.value);
            let time_zones = timeZoneSelected?.timezones?.map((itm) => ({
                label: itm,
                value: itm,
            }));
            setTimeZoneArray(time_zones);
        }
    }, [form?.country_id]);

    useEffect(() => {
        changeLanguage({ label: 'onReload', value: userData?.lang });
        let SignUpClient = JSON.parse(getLocalStorageItem("SignUpClient"));

        if (location?.state !== undefined) {
            localStorage.setItem("SignUpClientReverse", JSON.stringify(location?.state?.SignUpClient));
            localStorage.setItem("SignUpClient1", JSON.stringify(location?.state?.SignUpClient1));
        }

        if (SignUpClient === "0") {
            removeLocalStorageItem("SignUpClient1");
        }

    }, []);

    useEffect(() => {
        let SignUpClientReverse = JSON.parse(getLocalStorageItem("SignUpClientReverse"));

        setForm((prevState) => ({
            ...prevState,
            first_name: SignUpClientReverse?.first_name || userData?.first_name || "",
            last_name: SignUpClientReverse?.last_name || userData?.last_name || "",
            country_id: SignUpClientReverse?.country_id || userData?.country_id || "",
            time_zone: SignUpClientReverse?.time_zone || userData?.time_zone || "",
            mobile: SignUpClientReverse?.mobile || userData?.mobile || "",
            defaultCountry: SignUpClientReverse?.defaultCountry || "",
            company_details: SignUpClientReverse?.company_details || "",
        }));
    }, []);

    useEffect(() => {
        if (getLocalStorageItem("token") && getLocalStorageItem("userData")) {
            if (userData?.roles[0]?.id === 5) {
                if (userData?.is_profile_completed === 1) {
                    history.push("/dashboard");
                }else{
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
    }, []);

    const changeHandler = (e, name) => {
        if (e.target) {
            const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

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

    const changeHandlerCompany = (e, name) => {
        if (e.target) {

            removeLocalStorageItem("SignUpClient");
            removeLocalStorageItem("SignUpClientReverse");
            removeLocalStorageItem("SignUpClient1");
            const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;

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

    const handleSubmit = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        const { errors, isValid } = validateSignUpClient(form, t);

        if (isValid) {
            if (form?.company_details === "1") {
                let SignUpClient1 = JSON.parse(getLocalStorageItem("SignUpClient1"));

                history.push({
                    pathname: '/sign-up-client1',
                    state: {
                        SignUpClient: form, SignUpClient1: SignUpClient1
                    }
                });
            } else {
                removeLocalStorageItem("SignUpNext1");
                removeLocalStorageItem("SignUpClient1");
                history.push({
                    pathname: '/sign-up-client2',
                    state: {
                        SignUpClient: form
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

    return (
        <>
            <section className="signUp-main">
                <div className='container'>
                    <div className="logo-center">
                        <img src={logo} className="mx-auto signup_header_logo" alt="logo" />
                    </div>
                    <div className="signUp-inner">
                        <div className="signUp-detail signUp-client-detail py-4 animated fadeIn">
                            <div className="d-flex align-items-baseline">
                                <p className="text-body">{t("FEW_MORE_DETAILS")}</p>
                            </div>
                            <h6 className="d-flex justify-content-center text-truncate">{t("FILL_YOUR_PROFILE")}</h6>
                            <h5>{t("CONTACT_DETAILS")}</h5>
                            <form className="signuppage-form signupnext-padding" onSubmit={(e) => handleSubmit(e)}>
                                <div className="form-group fg-mb">
                                    <Input
                                        type="text"
                                        className=""
                                        name="first_name"
                                        value={form.first_name || ""}
                                        onChange={(e) => { changeHandler(e) }}
                                        error={error?.first_name}
                                        maxLength="100"
                                        label={t("FIRST_NAME")}
                                    />
                                </div>
                                <div className="form-group fg-mb">
                                    <Input
                                        type="text"
                                        className=""
                                        name="last_name"
                                        value={form.last_name || ""}
                                        onChange={(e) => { changeHandler(e) }}
                                        error={error?.last_name}
                                        maxLength="100"
                                        label={t("LAST_NAME")}
                                    />
                                </div>
                                <div className="form-group fg-mb">
                                    <SelectDropDown
                                        options={countryArray}
                                        value={form.country_id || ""}
                                        name="country"
                                        isSearchable={true}
                                        className="multiple-search z-highh custom-top custom-placeholder"
                                        onChange={(value) => {
                                            setForm((prevState) => ({
                                                ...prevState,
                                                ['country_id']: value,
                                            }))
                                            setError((prevState) => ({
                                                ...prevState,
                                                ['country_id']: "",
                                            }))

                                        }}
                                        label={t("COUNTRY")}
                                        error={error?.country_id}
                                    />
                                </div>
                                <div className="form-group fg-mb">
                                    <SelectDropDown
                                        options={timeZoneArray}
                                        value={form.time_zone || ""}
                                        name="time zone"
                                        className="multiple-search custom-top custom-placeholder"
                                        onChange={(value) => {
                                            setForm((prevState) => ({
                                                ...prevState,
                                                ['time_zone']: value,
                                            }))
                                            setError((prevState) => ({
                                                ...prevState,
                                                ['time_zone']: "",
                                            }))

                                        }}
                                        label={t("TIME_ZONE")}
                                        error={error?.time_zone}
                                    />
                                </div>
                                <div className="form-group fg-mb">
                                    <InputNumberCountryCodeCountryFlagDropDown
                                        name="mobile"
                                        className="custom-placeholder"
                                        onChange={(value) => {
                                            setForm((prevState) => ({
                                                ...prevState,
                                                ['mobile']: value,
                                            }))

                                            setError((prevState) => ({
                                                ...prevState,
                                                ['mobile']: "",
                                            }))
                                        }}
                                        value={form?.mobile || ""}
                                        error={error?.mobile}
                                        label={t("PHONE_NUMBER")}
                                    />
                                </div>
                                <div className="form-group text-white position-relative error-position mt-5">
                                    <div className="form-group p-2 d-flex flex-column flex-sm-row  justify-content-center flex-wrap">
                                        <h5>{t("COMPANY_DETAILS")}</h5>

                                        <div className="options py-2 position-relative">

                                            <div className="options py-2" >

                                                <label title="item1" className='px-5'>
                                                    <input type="radio" name="company_details" value="1" onChange={(e) => { changeHandlerCompany(e) }} checked={form?.company_details === "1"} />
                                                    <span><img src={tickIcon} className="tick_icon" /></span>
                                                    {t("PART_OF_COMPANY")}
                                                </label>
                                            </div>
                                            <div className='options py-2'>
                                                <label title="item2" className="px-5">
                                                    <input type="radio" name="company_details" value="0" onChange={(e) => { changeHandlerCompany(e) }} checked={form?.company_details == "0"} />
                                                    <span><img src={tickIcon} className="tick_icon" /></span>
                                                    {t("NOT_PART_OF_COMPANY")}
                                                </label>
                                            </div>
                                            {error?.company_details && <div className="invalid pt-3">{error?.company_details}</div>}
                                        </div>
                                    </div>
                                    <div className="text-center ">
                                        <Button text={t("NEXT")} type="submit" className="text-uppercase w-100 signUp-btn" />
                                    </div>
                                </div>
                            </form>

                        </div>

                        <Footer headerDesign={true} />
                    </div>
                </div>

            </section>
        </>
    );
};

export default SignUpClient;