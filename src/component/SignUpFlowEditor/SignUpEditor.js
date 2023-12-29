import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Input, Footer, SelectDropDown, InputNumberCountryCodeCountryFlagDropDown, OptionsOutsideSelect } from "../CommonComponent";
import validateSignUpEditor from "../../validation/SignUpFlowEditor/signUpFlowEditor";
import { getLocalStorageItem, removeLocalStorageItem } from "../../utils/helper";
import { IMAGE_EDITOR, VIDEO_EDITOR, EDITING_SUITE_TYPE } from './../../utils/constants';
import { editorUpdate } from "../../redux/action";
import logo from "../../assets/images/logo.svg";

const SignUpClient = () => {
    const { i18n, t } = useTranslation();

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        location: "",
        country_id: [],
        showreel_link: "",
        editing_suite: [],
        time_zone: [],
        mobile: "",
        default_country: "CL",

        image_editor: [],
        video_editor: [],
    });

    const ct = require('countries-and-timezones');
    const countries = ct.getAllCountries();
    let userData = JSON.parse(getLocalStorageItem("userData"));

    const [error, setError] = useState({});
    const [countryArray, setCountryArray] = useState([]);
    const [timeZoneArray, setTimeZoneArray] = useState([]);
    const [imageArray, setImageArray] = useState([]);
    const [videoArray, setVideoArray] = useState([]);
    const [onClickButtonToggle, setOnClickButtonToggle] = useState(false);

    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        changeLanguage({ label: 'onReload', value: userData?.lang });

        let imageData = IMAGE_EDITOR.map((itm) => ({
            label: itm.label,
            value: itm.value,
        }));

        imageData.unshift({
            label: t("NONE"),
            value: 0,
        });
        setImageArray(imageData);

        let videoData = VIDEO_EDITOR.map((itm) => ({
            label: itm.label,
            value: itm.value,
        }));

        videoData.unshift({
            label: t("NONE"),
            value: 0,
        });

        setVideoArray(videoData);
    }, []);

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
        if (getLocalStorageItem("token") && getLocalStorageItem("userData")) {
            if (userData?.roles[0]?.id === 5) {
                if (userData?.is_profile_completed === 1) {
                    history.push("/dashboard");
                } else {
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

    const redirectDashboard = (e) => {
        e.preventDefault();
        removeLocalStorageItem("count");
        if (getLocalStorageItem("token") && getLocalStorageItem("userData")) {
            if (userData?.roles[0]?.id === 5) {
                if (userData?.is_profile_completed === 1) {
                    history.push("/dashboard");
                } else {
                    history.push("/sign-up");
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
        }
    }

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

    const handleSubmit = (e) => {
        e.preventDefault();

        window.scrollTo(0, 0);
        const { errors, isValid } = validateSignUpEditor(form, t);
        if (isValid) {
            setOnClickButtonToggle(true);
            //image editor
            let image_editor_ids = [];
            form.image_editor?.map((image) => {
                image_editor_ids?.push(image?.value);
            });

            //video editor
            let video_editor_ids = [];
            form.video_editor?.map((video) => {
                video_editor_ids?.push(video?.value);
            });

            var profileForm = {
                id: userData?.id,
                first_name: form?.first_name,
                last_name: form?.last_name,
                location: form?.location,
                country_id: form?.country_id?.value,
                time_zone: form?.time_zone?.value,
                mobile: form?.mobile,
                showreel_link: form?.showreel_link,
                // editing_suite: form?.editing_suite?.join(","),
                editing_suite: form?.editing_suite?.value,
                image_editor: form?.editing_suite?.value === 1 ? image_editor_ids.join(",") : form?.editing_suite?.value === 3 ? image_editor_ids.join(",") : "0",
                video_editor: form?.editing_suite?.value === 2 ? video_editor_ids?.join(",") : form?.editing_suite?.value === 3 ? video_editor_ids?.join(",") : "0",
                is_profile_completed: 1
            };

            dispatch(
                editorUpdate({
                    profileForm,
                    callback: (data) => {
                        if (data) {
                            setOnClickButtonToggle(false);
                            removeLocalStorageItem("downloadLink");
                            removeLocalStorageItem("userData");
                            removeLocalStorageItem("token");
                            removeLocalStorageItem("userId");
                            removeLocalStorageItem("image");
                            if (data?.roles[0]?.id === 6) {
                                history.push("/");
                            }
                        }
                    }
                })
            );

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
                        <img onClick={(e) => { redirectDashboard(e) }} src={logo} className="mx-auto signup_header_logo cursor-pointer" alt="logo" />
                    </div>
                    <div className="signUp-inner">
                        <div className="signUp-detail signUp-client-detail py-4 animated fadeIn">
                            <div className="d-flex align-items-baseline">
                                <p className="text-body">{t("FEW_MORE_DETAILS")}</p>
                            </div>
                            <h6 className="d-flex justify-content-center text-truncate">{t("FILL_YOUR_PROFILE")}</h6>
                            <h5>{t("CONTACT_DETAILS")}</h5>
                            <form className="signuppage-form signupnext-padding signupnext-padding-one" onSubmit={(e) => handleSubmit(e)}>
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
                                    <Input
                                        type="text"
                                        className=""
                                        name="location"
                                        value={form.location || ""}
                                        onChange={(e) => { changeHandler(e) }}
                                        error={error?.location}
                                        maxLength="100"
                                        label={t("CITY")}
                                    />
                                </div>
                                <div className="form-group fg-mb">
                                    <SelectDropDown
                                        options={countryArray}
                                        value={form.country_id || ""}
                                        name="country"
                                        isSearchable={true}
                                        className=" "
                                        onChange={(value) => {
                                            setOnClickButtonToggle(false);
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
                                        options={EDITING_SUITE_TYPE}
                                        value={form.editing_suite || ""}
                                        name="editing_suite"
                                        className="multiple-search "
                                        onChange={(value) => {
                                            setForm((prevState) => ({
                                                ...prevState,
                                                ['editing_suite']: value,
                                            }))
                                            setError((prevState) => ({
                                                ...prevState,
                                                ['editing_suite']: "",
                                            }))

                                        }}
                                        label={t("EDITING_SUITE_TYPE")}
                                        error={error?.editing_suite}
                                    />
                                </div>
                                <div className="form-group fg-mb">
                                    <Input
                                        name="showreel_link"
                                        value={form?.showreel_link || ""}
                                        onChange={(e) => { changeHandler(e) }}
                                        type="text"
                                        error={error?.showreel_link}
                                        label={t("SHOWREEL_LINK")}
                                    />
                                </div>
                                <div className="form-group fg-mb">
                                    <SelectDropDown
                                        options={timeZoneArray}
                                        value={form.time_zone || ""}
                                        name="time zone"
                                        className="multiple-search "
                                        onChange={(value) => {
                                            setOnClickButtonToggle(false);
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
                                        className=""
                                        onChange={(value) => {
                                            setOnClickButtonToggle(false);
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
                                <h5>{t("EDITING_SUITE_AND_SOFTWARE")}</h5>
                                {form?.editing_suite?.value === 1 ? <div className="form-group fg-mb">
                                    <OptionsOutsideSelect
                                        onChange={(value) => {
                                            setForm((prevState) => ({
                                                ...prevState,
                                                ["image_editor"]: value,
                                            }));
                                            setError((prevState) => ({
                                                ...prevState,
                                                ["image_editor"]: "",
                                            }));

                                        }}
                                        className="font-size-14-px"
                                        isMulti
                                        options={imageArray}
                                        value={form?.image_editor}
                                        error={error?.image_editor}
                                        placeholder={t("IMAGE_EDITOR_LABEL")}
                                    // isLoading={camera_loader}
                                    />
                                </div> : form?.editing_suite?.value === 2 ? <div className="form-group fg-mb">
                                    <OptionsOutsideSelect
                                        onChange={(value) => {
                                            setForm((prevState) => ({
                                                ...prevState,
                                                ["video_editor"]: value,
                                            }));
                                            setError((prevState) => ({
                                                ...prevState,
                                                ["video_editor"]: "",
                                            }));

                                        }}
                                        className="font-size-14-px"
                                        isMulti
                                        options={videoArray}
                                        value={form?.video_editor}
                                        error={error?.video_editor}
                                        placeholder={t("VIDEO_EDITOR_LABEL")}
                                    // isLoading={camera_loader}
                                    />
                                </div> : <>
                                    <div className="form-group fg-mb">
                                        <OptionsOutsideSelect
                                            onChange={(value) => {
                                                setForm((prevState) => ({
                                                    ...prevState,
                                                    ["image_editor"]: value,
                                                }));
                                                setError((prevState) => ({
                                                    ...prevState,
                                                    ["image_editor"]: "",
                                                }));

                                            }}
                                            className="font-size-14-px"
                                            isMulti
                                            options={imageArray}
                                            value={form?.image_editor}
                                            error={error?.image_editor}
                                            placeholder={t("IMAGE_EDITOR_LABEL")}
                                        // isLoading={camera_loader}
                                        />
                                    </div>
                                    <div className="form-group fg-mb">
                                        <OptionsOutsideSelect
                                            onChange={(value) => {
                                                setForm((prevState) => ({
                                                    ...prevState,
                                                    ["video_editor"]: value,
                                                }));
                                                setError((prevState) => ({
                                                    ...prevState,
                                                    ["video_editor"]: "",
                                                }));

                                            }}
                                            className="font-size-14-px"
                                            isMulti
                                            options={videoArray}
                                            value={form?.video_editor}
                                            error={error?.video_editor}
                                            placeholder={t("VIDEO_EDITOR_LABEL")}
                                        // isLoading={camera_loader}
                                        />
                                    </div>
                                </>}


                                <div className="form-group text-white position-relative error-position mt-5">

                                    <div className="text-center ">
                                        <Button disabled={onClickButtonToggle} text={t("DONE")} type="submit" className={`${onClickButtonToggle ? "disable-btn-one" : ""} text-uppercase w-100 signUp-btn`} />
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