import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button, Footer, Input, SelectDropDown, CheckBox, InputNumberCountryCodeCountryFlagDropDown } from "../CommonComponent";
import validateSignUpClient1 from "../../validation/SignUpFlowClient/signUpFlowClient1";
import logo from "../../assets/images/logo.svg";
import leftArrowIcon from "../../assets/images/leftArrowIcon.svg";
import { getLocalStorageItem, removeLocalStorageItem } from "../../utils/helper";
import {
    sectorType, clientUpdate
} from "../../redux/action";

export default function SignUpClient1() {
    const { i18n, t } = useTranslation();

    const [form, setForm] = useState({
        position: "",
        company_name: "",
        vat_number: "",
        company_country: [],
        company_address: "",
        company_mobile: "",
        default_country: "CL",
        sector: [],
        team_member: [],
        is_confirmed: "1",
    });
    const [sectorArray, setSectorArray] = useState([]);

    const sector_type = useSelector(
        (state) => state?.SectorType?.sectorArray
    );

    const TEAM_TYPE = [
        { label: "Yes", value: "1" },
        { label: "No", value: "0" },
    ];

    const ct = require('countries-and-timezones');
    const countries = ct.getAllCountries();

    const [error, setError] = useState({});
    const [isForm, setIsform] = useState(false);
    const [countryArray, setCountryArray] = useState([]);
    const [onClickButtonToggle, setOnClickButtonToggle] = useState(false);

    const location = useLocation();
    const dispatch = useDispatch();
    const history = useHistory();

    let userData = JSON.parse(getLocalStorageItem("userData"));
    let SignUpClient1 = JSON.parse(getLocalStorageItem("SignUpClient1"));

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
        });

        if (sortedCountry?.length > 0) {
            let data = sortedCountry?.map((itm) => ({
                label: `${itm.name}`,
                value: itm.id,
            }));

            setCountryArray(data);
        }
    }, [form?.company_country]);

    //sector type
    useEffect(() => {
        changeLanguage({ label: 'onReload', value: userData?.lang });

        if (location?.state !== undefined) {
            localStorage.setItem("SignUpClient", JSON.stringify(location?.state?.SignUpClient));
        }

        if (sector_type?.data?.sector?.length > 0) {
            let data = sector_type?.data?.sector?.map((itm) => ({
                label: itm.name,
                value: itm.id,
            }));
            setSectorArray(data);
        } else {
            dispatch(sectorType());
        }
    }, [sector_type]);

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
                    history.push("/sign-up-client1");
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
            position: SignUpClient1?.position || userData?.position || "",
            company_name: SignUpClient1?.company_name || userData?.company_name || "",
            vat_number: SignUpClient1?.vat_number || userData?.vat_number || "",
            company_country: SignUpClient1?.company_country || userData?.company_country || "",
            company_address: SignUpClient1?.company_address || userData?.company_address || "",
            company_mobile: SignUpClient1?.company_mobile || userData?.company_mobile || "",
            default_country: SignUpClient1?.default_country || "",
            sector: SignUpClient1?.sector || "",
            team_member: SignUpClient1?.team_member || "",
            is_confirmed: SignUpClient1?.is_confirmed || "",
        }));

    }, []);

    const signUpClientPrev = (e) => {
        e.preventDefault();
        let SignUpClient = JSON.parse(getLocalStorageItem("SignUpClient"));
        history.push({
            pathname: '/sign-up-client',
            state: {
                SignUpClient: SignUpClient, SignUpClient1: form
            }
        });
    };

    const allowNumberOnly = (event) => {
        let charCode = event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
            event.target.value = event.target.value.replace(/[^0-9\-]/g, '');
            event.target.value = event.target.value
        } else {
            event.target.value = event.target.value.replace(/[^0-9\-]/g, '');
            event.target.value = event.target.value
        }
        setForm((prevState) => ({
            ...prevState,
            ['vat_number']: event.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let SignUpClient = JSON.parse(getLocalStorageItem("SignUpClient"));
       
        const { errors, isValid } = validateSignUpClient1(form, t);
        if (isValid) {

            if (form?.team_member?.value === "0") {
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
                    lang: userData?.lang,

                    position: form?.position,
                    company_name: form?.company_name,
                    vat_number: form?.vat_number,
                    company_country: form?.company_country?.value,
                    company_mobile: form?.company_mobile,
                    sector: form?.sector?.value,
                    team_member: form?.team_member?.value,
                    company_address: form?.company_address,
                    is_confirmed: form?.is_confirmed
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
            } else {
                history.push({
                    pathname: '/sign-up-client2',
                    state: {
                        SignUpClient: SignUpClient, SignUpClient1: form
                    }
                });
            }
        } else {
            setError(errors);
        }
    };

    const changeHandler = (e, name) => {
        if (e.target) {
            setOnClickButtonToggle(false);
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

    const changeLanguage = (event) => {
        if (event.label === 'onReload') {
            i18n.changeLanguage(event.value);
        }
    };

    return (
        <>
            <section className="signUpNext-main ">
                <div className='container'>
                    <div className='logo-center'>
                        <img src={logo} className="header-logo" alt="logo" />
                    </div>
                    <div className="row justify-content-center">
                        <div className="col-10 col-sm-12 col-md-8 signUpNext-detail py-5 animated fadeIn signUp-client-detail">
                            <div className="d-flex align-items-baseline">
                                <img onClick={(e) => { signUpClientPrev(e) }} src={leftArrowIcon} className="sm:ps-5 arrow arrow-left" alt="logo" />
                                <p className="text_body">{t("KNOW_COMPANY_DETAILS")}</p>
                            </div>
                            <form className="mx-xl-10 signupnext-padding " onSubmit={(e) => handleSubmit(e)}>
                                <div className="row justify-content-evenly ">
                                    <div className="col-12 col-lg-5">
                                        <div className="form-group row my-2">
                                            <Input
                                                type="text"
                                                className=""
                                                name="position"
                                                value={form.position || ""}
                                                onChange={(e) => { changeHandler(e) }}
                                                error={error?.position}
                                                maxLength="100"
                                                label={t("YOUR_POSITION_TITLE")}
                                            />
                                        </div>
                                        <div className="form-group row my-2">
                                            <Input
                                                type="text"
                                                className=""
                                                name="company_name"
                                                value={form.company_name || ""}
                                                onChange={(e) => { changeHandler(e) }}
                                                error={error?.company_name}
                                                maxLength="100"
                                                label={t("COMPANY_NAME")}
                                            />
                                        </div>
                                        <div className="form-group row my-2">
                                            <Input
                                                onKeyUp={(e) => allowNumberOnly(e)}
                                                className=""
                                                name="vat_number"
                                                value={form.vat_number || ""}
                                                onChange={(e) => { changeHandler(e) }}
                                                error={error?.vat_number}
                                                maxLength="100"
                                                label={t("VAT_NUMBER")}
                                            />
                                        </div>
                                        <div className="form-group row my-2">
                                            <SelectDropDown
                                                options={countryArray}
                                                isSearchable={true}
                                                value={form?.company_country || ""}
                                                name="company_country"
                                                className="multiple-search custom-top"
                                                onChange={(value) => {
                                                    setForm((prevState) => ({
                                                        ...prevState,
                                                        ['company_country']: value,
                                                    }))
                                                    setError((prevState) => ({
                                                        ...prevState,
                                                        ['company_country']: "",
                                                    }))

                                                }}
                                                label={t("COUNTRY")}
                                                error={error?.company_country}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-5">
                                        <div className="form-group row my-2">
                                            <Input
                                                type="text"
                                                className=""
                                                name="company_address"
                                                value={form.company_address || ""}
                                                onChange={(e) => { changeHandler(e) }}
                                                error={error?.company_address}
                                                maxLength="100"
                                                label={t("COMPANY_ADDRESS")}
                                            />
                                        </div>
                                        <div className="form-group row my-2">
                                            <InputNumberCountryCodeCountryFlagDropDown
                                                name="company_mobile"
                                                onChange={(value) => {
                                                    setForm((prevState) => ({
                                                        ...prevState,
                                                        ['company_mobile']: value,
                                                    }))

                                                    setError((prevState) => ({
                                                        ...prevState,
                                                        ['company_mobile']: "",
                                                    }))
                                                    setIsform(true)
                                                }}
                                                value={form?.company_mobile || ""}
                                                error={error?.company_mobile}
                                                label={t("BUSINESS_TELEPHONE_NUMBER")}
                                            />
                                        </div>
                                        <div className="form-group row my-2">
                                            <SelectDropDown
                                                options={sectorArray}
                                                value={form?.sector || ""}
                                                isSearchable={true}
                                                name="sector"
                                                className="multiple-search custom-top"
                                                onChange={(value) => {
                                                    setForm((prevState) => ({
                                                        ...prevState,
                                                        ['sector']: value,
                                                    }))
                                                    setError((prevState) => ({
                                                        ...prevState,
                                                        ['sector']: "",
                                                    }))

                                                }}
                                                label={t("SECTOR")}
                                                error={error?.sector}
                                            />
                                        </div>
                                        <div className="form-group row my-2">
                                            <SelectDropDown
                                                options={TEAM_TYPE}
                                                isSearchable={false}
                                                value={form?.team_member || ""}
                                                name="team_member"
                                                className="multiple-search custom-top"
                                                onChange={(value) => {
                                                    setForm((prevState) => ({
                                                        ...prevState,
                                                        ['team_member']: value,
                                                    }))
                                                    setError((prevState) => ({
                                                        ...prevState,
                                                        ['team_member']: "",
                                                    }))

                                                }}
                                                label={t("ADD_A_TEAM_MEMBER")}
                                                error={error?.team_member}
                                            />
                                        </div>

                                    </div>
                                </div>
                                <div className="form-group d-flex text-white position-relative error-position error-left">
                                    <CheckBox
                                        name="is_confirmed"
                                        type="checkbox"
                                        id="comebackPlan"
                                        value="1"
                                        onChange={(e) => {
                                            setForm((prevState) => ({
                                                ...prevState,
                                                ['is_confirmed']: e.target.checked === true ? "1" : ""
                                            }))
                                            setError((prevState) => ({
                                                ...prevState,
                                                ['is_confirmed']: "",
                                            }))

                                        }}

                                        checked={form?.is_confirmed === "1"}
                                        error={error?.is_confirmed}
                                        className={"c-checkbox"}
                                        label={t("SIGN_UP_CLIENT1_CONFIRM")}
                                    />
                                </div>
                                <div className="text-center ">
                                    <Button disabled={onClickButtonToggle} text={t("NEXT")} type="submit" className={`${onClickButtonToggle ? "disable-btn-one" : ""} text-uppercase w-100 signUpNext-button`} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <Footer headerDesign={true} />
            </section></>
    );
};