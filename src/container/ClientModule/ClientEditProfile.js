import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Footer, Input, SelectDropDown, MultipleInputTags, SearchableSelect, InputNumberCountryCodeCountryFlagDropDown } from "../../component/CommonComponent";
import Header from "../../component/layout/Header";
import { s3 } from "../../utils/aws";
import leftArrowIcon from "../../assets/images/leftArrowIcon.svg";
import flagchil from "../../assets/images/Chile.png";
import editIcon from "../../assets/images/edit-icon.png";
import validateEditProfile from "../../validation/ClientModule/clientEditProfile";
import { getLocalStorageItem, WarningToast, makeRandomNumber } from "../../utils/helper";
import {
    updateClientProfile,
    sectorType
} from "../../redux/action";

export default function SignUpNext() {
    const { i18n, t } = useTranslation();

    let userData = JSON.parse(getLocalStorageItem("userData"));
    var placeAnOrderArray = JSON.parse(getLocalStorageItem("placeAnOrder"));
    var placeAnOrderArrayCount = JSON.parse(getLocalStorageItem("editOrder"));
    var orderCount = 0;
    if (placeAnOrderArrayCount?.editing?.length > 0) {
        orderCount = 1;
    } else {
        orderCount = 0;
    }
    if (placeAnOrderArray?.length > 0) {
        orderCount = orderCount + placeAnOrderArray?.length;
    }
    let user_id = JSON.parse(getLocalStorageItem("userId"));
    let user_image = JSON.parse(getLocalStorageItem("image"));

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        mobile: "",
        default_country: "CL",
        email: "",
        country_id: [],
        imageFile: "",
        image: "",

        company_name: "",
        position: "",
        work_email: "",
        sector: [],
        company_address: "",
        company_mobile: "",
        time_zone: [],
        vat_number: "",
        notification: [],
    });

    const ct = require('countries-and-timezones');
    const countries = ct.getAllCountries();
    const countryNames = Object.values(countries);

    const [error, setError] = useState("");
    const [uploadImageLoader, setUploadImageLoader] = useState(false);
    const [valid, setValid] = useState(true);
    const [emailSubmit, setMailSubmit] = useState("");
    const [tags, setTags] = useState([]);
    const [sectorArray, setSectorArray] = useState([]);
    const [countryArray, setCountryArray] = useState([]);
    const [timeZoneArray, setTimeZoneArray] = useState([]);
    const [tagError, setTagError] = useState("");

    const profile = useRef();
    const history = useHistory();
    const dispatch = useDispatch();

    const TEAM_TYPE = [
        { label: "Yes", value: "1" },
        { label: "No", value: "0" },
    ];

    const sector_type = useSelector(
        (state) => state?.SectorType?.sectorArray
    );

    //country list
    useEffect(() => {
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
                label: `${itm?.name}`,
                value: itm?.id,
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

    //route redirect as per the user login details.
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

                    history.push("/client-edit-profile");
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
    }, [tags]);

    //sector type set from local storage user data.
    useEffect(() => {
        let data = sector_type?.data?.sector?.find((ele) => ele?.id === userData?.clients?.sector_id);
        let sectorValue = {
            label: data?.name,
            value: data?.id,
        };

        setForm((prevState) => ({
            ...prevState,
            ['sector']: sectorValue,
        }));
    }, [sector_type]);

    //sector type
    useEffect(() => {
        if (sector_type?.data?.sector?.length > 0) {
            let data = sector_type?.data?.sector?.map((itm) => ({
                label: itm?.name,
                value: itm?.id,
            }));
            setSectorArray(data);
        } else {
            dispatch(sectorType());
        }
    }, [sector_type]);

    //all fields data set from the local storage user data.
    useEffect(() => {
        let arrayEmail = userData?.team_email?.split(",");
        if (arrayEmail !== undefined) {
            if (arrayEmail[0] !== "") {
                setTags(arrayEmail);
            }
        }

        let country_list = countryNames?.find((ele) => ele?.id === userData?.country_id?.toUpperCase())
        const COUNTRIES = [
            { label: country_list?.name, value: country_list?.id },
        ];

        let time_zones = country_list?.timezones?.map((itm) => ({
            label: itm,
            value: itm,
        }));

        setForm((prevState) => ({
            ...prevState,
            first_name: userData?.first_name || "",
            last_name: userData?.last_name || "",
            image: userData?.image || "",
            mobile: userData?.mobile || "",
            country_id: COUNTRIES?.find((ele) => ele?.value === userData?.country_id?.toUpperCase()) || "",
            time_zone: time_zones?.find((ele) => ele?.value === userData?.time_zone) || "",
            email: userData?.email || "",

            company_name: userData?.clients?.company_name || "",
            company_address: userData?.clients?.address_1 || "",
            position: userData?.clients?.position || "",
            company_mobile: userData?.clients?.company_mobile || "",
            work_email: userData?.work_email || "",
            vat_number: userData?.clients?.vat_number || "",
            // sector:sectorArray?.find((ele) => ele.value === userData?.clients?.sector_id) || "",
            notification: TEAM_TYPE?.find((ele) => ele?.value === userData?.notification?.toString()) || "",
        }));
    }, [userData?.parent_id]);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);
        let userData = JSON.parse(getLocalStorageItem("userData"));
        const { errors, isValid } = validateEditProfile(form, t, userData?.company_details, userData?.parent_id);

        if (isValid) {
            var email_separated = null;

            if (tags?.length === 0) {
                if (emailSubmit?.length !== 0) {

                    let concanateCommaSingleEmailString = emailSubmit + ",";
                    let arraySingleEmail = concanateCommaSingleEmailString?.split(",");

                    let removeBlank = arraySingleEmail?.pop();
                    setTags(arraySingleEmail);
                    email_separated = emailSubmit;
                }

            } else {
                Array.prototype.removeDuplicates = function () {
                    return this.filter(function (item, index, self) {
                        return self.indexOf(item) == index;
                    });
                };

                email_separated = tags?.toString() + "," + emailSubmit;

                let arrayEmail = email_separated?.split(",");

                var item = arrayEmail.removeDuplicates();

                email_separated = item?.join(",")

                let lastValue = email_separated?.slice(-1);
                if (lastValue === ",") {
                    email_separated = email_separated?.substring(0, email_separated?.length - 1);
                }

                let newArray = arrayEmail?.filter((blank) => blank !== "");

                var finalItem = newArray.removeDuplicates();
                // let removeBlank = arrayEmail?.pop();
                setTags(finalItem);
            }

            // if (tags?.length === 0) {
            //     // if (tags?.length === 0) {
            //     //     setTagError(t("INPUT_TAG_REQ"));
            //     // }
            //     email_separated = tags?.join(",")
            // } 


            let profileUpdateForm = {
                id: userData?.id,
                first_name: form?.first_name,
                last_name: form?.last_name,
                mobile: form?.mobile,
                email: form?.email,
                country_id: form?.country_id?.value,
                image: form?.image,
                lang: userData?.lang,

                company_details: userData?.company_details || "",
                company_name: userData?.company_details === 1 ? form?.company_name : form?.first_name + " " + form?.last_name,
                position: form?.position,
                // work_email: form?.work_email,
                sector: form?.sector?.value,
                company_address: form?.company_address,
                company_mobile: form?.company_mobile,
                time_zone: form?.time_zone?.value,
                vat_number: form?.vat_number,
                team_email: email_separated,
                notification: form?.notification?.value
            };

            if (userData?.parent_id === null || userData?.parent_id === undefined) {
                // if (tags?.length > 0) {
                dispatch(
                    updateClientProfile({
                        profileUpdateForm,
                        callback: (data) => {
                            if (data) {
                                localStorage.setItem("userData", JSON.stringify(data));
                                localStorage.setItem("image", JSON.stringify(data?.image));
                                localStorage.setItem("userId", JSON.stringify(data?.id));
                            }
                        },
                    })
                );
                // }
            } else {
                dispatch(
                    updateClientProfile({
                        profileUpdateForm,
                        callback: (data) => {
                            if (data) {
                                localStorage.setItem("userData", JSON.stringify(data));
                                localStorage.setItem("image", JSON.stringify(data?.image));
                                localStorage.setItem("userId", JSON.stringify(data?.id));
                            }
                        },
                    })
                );
            }
        } else {

            // if (emailSubmit?.length === 0) {
            //     setTagError(t("INPUT_TAG_REQ"));
            // }
            setError(errors);
        }
    };

    const uploadMultipleImageInS3 = async (filename, file) => {
        let userData = JSON.parse(getLocalStorageItem("userData"));
        let originalName = `${makeRandomNumber(9)}${userData?.first_name}${userData?.id}`;
        const fileName = `${originalName}${"."}${filename?.split('.')?.pop()}`;

        const params = {
            Body: file,
            Bucket: process.env.REACT_APP_BUCKET_NAME,
            ACL: 'public-read',
            Key: `profile_${userData?.id}/${fileName}`,

        };

        let s3Bucket = await s3.putObject(params).promise();

        if (s3Bucket) {
            console.log("Successfully original image uploaded data to " + params?.Bucket + "/" + params?.Key);
            let imageName = params?.Key?.split("/")[1];

            setForm((prevState) => ({
                ...prevState,
                image: imageName,
            }));
        }
    };

    const uploadProfile = () => {
        profile.current.click();
    };

    const profileChangeHandler = async (e) => {
        const fileObj = e.target.files && e.target.files[0];
        if (!fileObj) {
            return;
        }

        const [type] = fileObj.type.split("/");
        if (!type || type !== "image") {
            toast.warn(<WarningToast msg="Filetype is invalid." />);
            return null;
        }

        setForm((prevState) => ({
            ...prevState,
            profileImage: fileObj?.type,
            imageFile: fileObj,
        }));

        await uploadMultipleImageInS3(fileObj.name, fileObj);
    };

    const handleKeyDown = (e) => {
        setTagError("");
        setError("")
        if (e.target.value === "") setValid(true);

        if (e.key !== "Enter") return

        const value = e.target.value
        if (!value?.trim()) return

        var valid = true;
        var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (value == "" || !regex.test(value)) {
            valid = false;
            setValid(valid);
        }

        // if (valid === false) setError(t("INPUT_TAG_REQ_VALID"));
        if (valid === true) {

            setTags([...tags, value]);
            setError("");
        }
        e.target.value = "";
    }

    return (
        <>
            <Header isJob={true} logoutFlag={uploadImageLoader} langSelector={false} orderCount={orderCount} client={true} />
            <section className="signUpNext-main dashboard-job">
                <div className='back-btnn'>
                    <a><img onClick={() => history.push("/client-dashboard")} src={leftArrowIcon} className="sm:ps-5 arrow cursor-pointer me-2" alt="logo" /> {t("EDIT_PROFILE")}   </a>
                </div>
                <form onSubmit={(e) => handleSubmit(e)} className="row justify-content-center">
                    <div className="col-10 col-sm-12 col-md-8  py-5 animated fadeIn job-edit-profile signUp-client-detail">
                        <div className="mx-xl-10 ">
                            <div className="row justify-content-evenly ">
                                <div className="col-12">
                                    <div className="form-group row">
                                        <label>{t("PROFILE_ICON")}</label>
                                        {form?.imageFile ? (
                                            <div className="profile-icon">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    name="profileImage"
                                                    className="d-none class1"
                                                    id="file"
                                                    ref={profile}
                                                    onChange={profileChangeHandler}
                                                />
                                                <div className="profile-image mx-auto cursor-pointer" onClick={uploadProfile}>
                                                    <img className='main-img' src={URL.createObjectURL(form?.imageFile)}
                                                        alt=""
                                                        onClick={uploadProfile} />
                                                    <img className='editicon' src={editIcon} alt="img" />
                                                </div>
                                            </div>
                                        ) : user_image ? (
                                            <div className="profile-icon ">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    name="profileImage"
                                                    className="d-none class2"
                                                    id="file"
                                                    ref={profile}
                                                    onChange={profileChangeHandler}
                                                />
                                                <div className="profile-image mx-auto cursor-pointer" onClick={uploadProfile}>
                                                    <img className='main-img' src={`${process.env.REACT_APP_AWS_DSP_AWS_URL}profile_${user_id}/${user_image}`} alt="img" />
                                                    <img className='editicon' src={editIcon} alt="img" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="profile-icon ">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    name="profileImage"
                                                    className="d-none class3"
                                                    id="file"
                                                    ref={profile}
                                                    onChange={profileChangeHandler}
                                                />
                                                <div className="profile-image mx-auto cursor-pointer" onClick={uploadProfile}>
                                                    <span className='profile-name'>{form?.first_name?.split("")[0]?.toUpperCase()}{form?.last_name?.split("")[0]?.toUpperCase()}</span>
                                                    <img className='editicon' src={editIcon} alt="img" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="form-group row">
                                        <label>{t("PERSONAL_DETAIL")}</label>
                                        <div className="d-flex justify-content-between flex-wrap">
                                            <div className='half'>
                                                <Input
                                                    type="text"
                                                    className=""
                                                    name="first_name"
                                                    value={form?.first_name}
                                                    onChange={(e) => { changeHandler(e) }}
                                                    error={error?.first_name}
                                                    maxLength="100"
                                                    label={t("FIRST_NAME")}
                                                />
                                                <Input
                                                    type="text"
                                                    className="grey"
                                                    name="email"
                                                    disabled={true}
                                                    value={form?.email}
                                                    onChange={(e) => { changeHandler(e) }}
                                                    error={error?.email}
                                                    maxLength="100"
                                                    label={t("EMAIL_ADDRESS")}
                                                />
                                                <SelectDropDown
                                                    options={countryArray}
                                                    value={form.country_id || ""}
                                                    name="country"
                                                    isSearchable={true}
                                                    className="multiple-search z-highh "
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
                                            <div className='half'>
                                                <Input
                                                    type="text"
                                                    className=""
                                                    name="last_name"
                                                    value={form?.last_name}
                                                    onChange={(e) => { changeHandler(e) }}
                                                    error={error?.last_name}
                                                    maxLength="100"
                                                    label={t("LAST_NAME")}
                                                />
                                                <InputNumberCountryCodeCountryFlagDropDown
                                                    name="mobile"
                                                    className="country-one"
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
                                                    value={form?.mobile}
                                                    error={error?.mobile}
                                                    label={t("PHONE_NUMBER")}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {userData?.company_details === 1 ? <div className="form-group row">
                                        <label>Company Details</label>
                                        <div className="d-flex justify-content-between flex-wrap">
                                            <div className='half'>
                                                <Input
                                                    type="text"
                                                    className={(userData?.parent_id === null || userData?.parent_id === undefined) ? "" : "grey"}
                                                    disabled={(userData?.parent_id === null || userData?.parent_id === undefined) ? false : true}
                                                    name="company_name"
                                                    value={form?.company_name}
                                                    onChange={(e) => { changeHandler(e) }}
                                                    error={error?.company_name}
                                                    maxLength="100"
                                                    label="Company Name"
                                                />
                                                <Input
                                                    type="text"
                                                    className={(userData?.parent_id === null || userData?.parent_id === undefined) ? "" : "grey"}
                                                    name="position"
                                                    disabled={(userData?.parent_id === null || userData?.parent_id === undefined) ? false : true}
                                                    value={form?.position}
                                                    onChange={(e) => { changeHandler(e) }}
                                                    error={error?.position}
                                                    maxLength="100"
                                                    label="Your Position/Title"
                                                />
                                                <SelectDropDown
                                                    options={sectorArray}
                                                    isSearchable={true}
                                                    value={form?.sector}
                                                    disabled={(userData?.parent_id === null || userData?.parent_id === undefined) ? false : true}
                                                    name="sector"
                                                    className={`new-select multiple-search ${userData?.parent_id !== null ? "minH-select" : ""}`}
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
                                                    label="Sector"
                                                    error={error?.sector}
                                                />
                                            </div>
                                            <div className='half'>
                                                <Input
                                                    type="text"
                                                    className={(userData?.parent_id === null || userData?.parent_id === undefined) ? "" : "grey"}
                                                    name="company_address"
                                                    disabled={(userData?.parent_id === null || userData?.parent_id === undefined) ? false : true}
                                                    value={form?.company_address}
                                                    onChange={(e) => { changeHandler(e) }}
                                                    error={error?.company_address}
                                                    maxLength="100"
                                                    label="Company Address"
                                                />
                                                <InputNumberCountryCodeCountryFlagDropDown
                                                    className={`tel-input2 country-one ${(userData?.parent_id === null || userData?.parent_id === undefined) ? "" : "grey-bg"}`}
                                                    name="company_mobile"
                                                    disabled={(userData?.parent_id === null || userData?.parent_id === undefined) ? false : true}
                                                    onChange={(value) => {
                                                        setForm((prevState) => ({
                                                            ...prevState,
                                                            ['company_mobile']: value,
                                                        }))

                                                        setError((prevState) => ({
                                                            ...prevState,
                                                            ['company_mobile']: "",
                                                        }))

                                                    }}
                                                    value={form?.company_mobile}
                                                    error={error?.company_mobile}
                                                    label="Business Telephone Number"
                                                />
                                                <Input
                                                    type="text"
                                                    className={(userData?.parent_id === null || userData?.parent_id === undefined) ? "" : "grey"}
                                                    name="vat_number"
                                                    disabled={(userData?.parent_id === null || userData?.parent_id === undefined) ? false : true}
                                                    value={form?.vat_number}
                                                    onChange={(e) => { changeHandler(e) }}
                                                    error={error?.vat_number}
                                                    maxLength="100"
                                                    label="VAT Number"
                                                />

                                            </div>
                                        </div>
                                    </div> : ""}

                                    {(userData?.parent_id === null || userData?.parent_id === undefined) ? <div className="form-group multi-select-one">
                                        <label>Your Team Members</label>
                                        <div className='half'>
                                            <MultipleInputTags
                                                className="join-team"
                                                handleKeyDown={(e) => handleKeyDown(e)}
                                                onChange={(e) => setMailSubmit(e.target.value)}
                                                setTags={setTags}
                                                removeTagFlag={true}
                                                tags={tags}
                                                label={t("ENTER_EMAIL_ADDRESS")}
                                                error={tagError}
                                            />
                                        </div>
                                    </div> : ""}

                                    <div className="form-group">
                                        <label>General Preferences</label>
                                        <div className="d-flex justify-content-between flex-wrap">
                                            <div className='half'>
                                                <SelectDropDown
                                                    options={timeZoneArray}
                                                    isSearchable={true}
                                                    value={form?.time_zone}
                                                    name="time_zone"
                                                    className="new-select multiple-search"
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
                                            <div className='half'>
                                                <SelectDropDown
                                                    options={TEAM_TYPE}
                                                    isSearchable={false}
                                                    value={form?.notification}
                                                    name="notification"
                                                    className="new-select multiple-search"
                                                    onChange={(value) => {
                                                        setForm((prevState) => ({
                                                            ...prevState,
                                                            ['notification']: value,
                                                        }))
                                                        setError((prevState) => ({
                                                            ...prevState,
                                                            ['notification']: "",
                                                        }))

                                                    }}
                                                    label="Notification"
                                                    error={error?.notification}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group team-name need-support">
                                        <h3 className="team-title">{t("NEED_SUPPORT")}?</h3>
                                        <div className="support-number">
                                            <ul>
                                                <li className="support-mail">
                                                    <a href="mailto:support@widu.co">support@widu.co</a>
                                                </li>
                                                <li>
                                                    <div className="flag">
                                                        <img src={flagchil} alt="chil" />
                                                        <p>{t("GLOBAL")}</p>
                                                    </div>
                                                    <a href="tel:+34683165370">+34 683 16 53 70</a>
                                                </li>
                                                <li>
                                                    <div className="flag">
                                                        <img src={flagchil} alt="chil" />
                                                        <p>{t("CHILI")}</p>
                                                    </div>
                                                    <a href="tel:+56921995961">+56 9 2199 5961</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="text-center ">
                                <Button text={t("SAVE")} type="submit" className={`text-uppercase w-100 signUpNext-button`} />
                            </div>
                        </div>
                    </div>
                </form>
                <Footer headerDesign={true} />
            </section></>
    );
};