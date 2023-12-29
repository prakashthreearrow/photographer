import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from "react-router-dom";
import countryList from 'react-select-country-list';
import { useDispatch } from "react-redux";
import { Button, Input, Footer, SelectDropDown, InputNumberCountryCodeCountryFlagDropDown } from "../CommonComponent";
import validateSignUpClient3 from "../../validation/SignUpFlowClient/signUpFlowClient3";
import { getLocalStorageItem } from "../../utils/helper";
import logo from "../../assets/images/logo.svg";
import {
    inviteTeamMember
} from "../../redux/action";

const SignUpClient3 = () => {
    const { i18n, t } = useTranslation();

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        country_id: [],
        time_zone: [],
        mobile: "",
        default_country: "CL",
        position: "",

    });

    let userData = JSON.parse(getLocalStorageItem("userData"));
    const ct = require('countries-and-timezones');
    const countries = ct.getAllCountries();

    const [error, setError] = useState({});
    const [countryArray, setCountryArray] = useState([]);
    const [timeZoneArray, setTimeZoneArray] = useState([]);
    const [onClickButtonToggle, setOnClickButtonToggle] = useState(false);

    const location = useLocation();
    const dispatch = useDispatch();
    const history = useHistory();

    //country list
    useEffect(() => {
        const countryNames = Object.values(countries);

        let sortedCountry = countryNames.sort(function (a, b) {
            var nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
            if (nameA < nameB) //sort string ascending
                return -1;
            if (nameA > nameB)
                return 1;
            return 0; //default return value (no sorting)
        })

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
        if (location?.state !== undefined) {
            localStorage.setItem("SignUpClient", JSON.stringify(location?.state?.SignUpClient));
        }
        changeLanguage({ label: 'onReload', value: userData?.lang });
    }, []);

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
                    history.push("/sign-up-client3");
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
        window.scrollTo(0, 0);
        const { errors, isValid } = validateSignUpClient3(form, t);
        if (isValid) {
            setOnClickButtonToggle(true);
            let client_profile_form = {
                id: userData?.id,
                first_name: form?.first_name,
                last_name: form?.last_name,
                country_id: form?.country_id?.value,
                time_zone: form?.time_zone?.label,
                mobile: form?.mobile,
                position: form?.position,
                lang: userData?.lang
            }

            dispatch(
                inviteTeamMember({
                    client_profile_form,
                    callback: (data) => {
                        if (data) {
                            setOnClickButtonToggle(false);
                            localStorage.setItem("userData", JSON.stringify(data));
                            history.push("/client-dashboard")
                        }
                    }
                })
            );

        } else {
            setError(errors);
        }
    };

    const changeHandler = (e, name) => {
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
                        <div className="signUp-detail invite-team animated fadeIn signUp-client-detail">
                            <div className="d-flex align-items-baseline">
                                <p className="text-body">{t("JOIN_YOUR_TEAM")}</p>
                            </div>
                            <h6 className="d-flex justify-content-center text-truncate">{t("FILL_YOUR_PROFILE")}</h6>
                            <form className="signuppage-form" onSubmit={(e) => handleSubmit(e)}>
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
                                <div className="form-group row fg-mb toggle-right-input-top-margin no-mtop">
                                    <SelectDropDown
                                        options={countryArray}
                                        isSearchable={true}
                                        value={form?.country_id || ""}
                                        name="country_id"
                                        className="multiple-search custom-top"
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
                                <div className="form-group row fg-mb toggle-right-input-top-margin no-mtop m-zdex cus-pb">
                                    <SelectDropDown
                                        options={timeZoneArray}
                                        value={form?.time_zone || ""}
                                        isSearchable={true}
                                        name="time_zone"
                                        className="multiple-search custom-top"
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
                                <div className="form-group fg-mb">
                                    <Input
                                        type="text"
                                        className=""
                                        name="position"
                                        value={form.position || ""}
                                        onChange={(e) => { changeHandler(e) }}
                                        error={error?.position}
                                        maxLength="100"
                                        label={t("POSITION_OR_TITLE")}
                                    />
                                </div>
                                <div className="text-center signup-btn-container">
                                    <Button disabled={onClickButtonToggle} text={t("DONE")} type="submit" className={`${onClickButtonToggle ? "disable-btn-one" : ""} text-uppercase w-100 signUp-btn`} />
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

export default SignUpClient3;