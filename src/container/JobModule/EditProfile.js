import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Footer, Input, OptionsOutsideSelect, InputNumberCountryCodeCountryFlagDropDown, SelectDropDown } from "../../component/CommonComponent";
import Header from "../../component/layout/Header";
import { s3 } from "../../utils/aws";
import leftArrowIcon from "../../assets/images/leftArrowIcon.svg";
import flagchil from "../../assets/images/Chile.png";
import editIcon from "../../assets/images/edit-icon.png";
import validateEditProfile from "../../validation/JobModule/editProfile";
import { getLocalStorageItem, WarningToast, makeRandomNumber } from "../../utils/helper";
import {
    editJobProfile,
    cameraType,
    equipementType,
    lensType,
    smartPhoneType
} from "../../redux/action";

export default function SignUpNext() {
    const { i18n, t } = useTranslation();

    let userData = JSON.parse(getLocalStorageItem("userData"));
    const ct = require("countries-and-timezones");
    const countries = ct.getAllCountries();

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        mobile: "",
        default_country: "CL",
        email: "",
        location: "",
        country_id: [],
        time_zone: [],
        imageFile: "",
        image: "",
        camera_id: [],
        lens_id: [],
        speed_light_id: [],
        tripod_id: [],
        strobe_id: [],
        specialize_item_id: [],
        smartphone_id: []
    });

    const [error, setError] = useState("");
    const [uploadImageLoader, setUploadImageLoader] = useState(false);

    const [countryArray, setCountryArray] = useState([]);
    const [timeZoneArray, setTimeZoneArray] = useState([]);

    const [cameraArray, setCameraArray] = useState([]);
    const [lensArray, setLensArray] = useState([]);
    const [speedLightsArray, setSpeedLightsArray] = useState([]);
    const [tripodsArray, setTripodsArray] = useState([]);
    const [strobesArray, setStrobesArray] = useState([]);
    const [specializedItemsArray, setSpecializedItemsArray] = useState([]);
    const [smartPhoneArray, setSmartPhoneArray] = useState([]);

    const [camera, setCamera] = useState([]);
    const [lens, setLens] = useState([]);
    const [smart_phones, setSmart_phones] = useState([]);
    const [strobes, setStrobes] = useState([]);
    const [specialize, setSpecialize] = useState([]);
    const [tripods, setTripods] = useState([]);
    const [speedlight, setSpeedlight] = useState([]);

    const profile = useRef();
    const history = useHistory();
    const dispatch = useDispatch();

    const smart_phone_loader = useSelector(
        (state) => state?.SmartPhoneType?.loading
    );

    const lens_loader = useSelector(
        (state) => state?.LensType?.loading
    );

    const equipement_loader = useSelector(
        (state) => state?.EquipementType?.loading
    );

    const camera_loader = useSelector(
        (state) => state?.CameraType?.loading
    );

    const smart_phone_type = useSelector(
        (state) => state?.SmartPhoneType?.smartPhoneArray
    );

    const lens_type = useSelector(
        (state) => state?.LensType?.lensArray
    );

    const equipement_type = useSelector(
        (state) => state?.EquipementType?.equipementArray
    );

    const camera_types = useSelector(
        (state) => state?.CameraType?.cameraArray
    );

    const changeLanguage = useSelector(
        (state) => state?.LanguageSelector?.language
    );

    //country list
    useEffect(() => {
        const countryNames = Object.values(countries);

        let sortedCountry = countryNames.sort(function (a, b) {
            var nameA = a.name.toLowerCase(),
                nameB = b.name.toLowerCase();
            if (nameA < nameB)
                //sort string ascending
                return -1;
            if (nameA > nameB) return 1;
            return 0; //default return value (no sorting)
        });

        if (sortedCountry?.length > 0) {
            let countries = sortedCountry?.map((itm) => ({
                label: `${itm.name}`,
                value: itm.id,
            }));
            setCountryArray(countries);

            let timeZoneSelected = sortedCountry?.find(
                (ele) => ele?.id === form?.country_id?.value
            );
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
                    history.push("/edit-profile");
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

                    history.push("/place-an-order");
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

        const countryNames = Object.values(countries);

        let countryData = countryNames?.find(
            (country) => country?.id === userData?.country_id
        );

        let time_zones = countryData?.timezones?.map((itm) => ({
            label: itm,
            value: itm,
        }));

        let timeZoneSelected = time_zones?.find(
            (ele) => ele?.value === userData?.time_zone
        );
    
        let country = {
            label: countryData?.name,
            value: countryData?.id,
        };
    
        setForm((prevState) => ({
            ...prevState,
            first_name: userData?.first_name || "",
            last_name: userData?.last_name || "",
            image: userData?.image || "",
            mobile: userData?.mobile || "",
            defaultCountry: "CL",
            email: userData?.email || "",
            location: userData?.location || "",
            country_id: country,
            time_zone: timeZoneSelected,
        }));
    }, []);

    useEffect(() => {
        //camera type
        let camera_ids = [];
        form.camera_id?.map((camera) => {
            camera_ids?.push(`${parseInt(camera?.value)}`);
        });
        setCamera(camera_ids?.join(","));

        //lens type
        let lens_ids = [];
        form.lens_id?.map((lens) => {
            lens_ids?.push(`${parseInt(lens?.value)}`);
        });
        setLens(lens_ids?.join(","));

        //smart_phones type
        let smartphone_ids = [];
        form.smartphone_id?.map((smartphone) => {
            smartphone_ids?.push(`${parseInt(smartphone?.value)}`);
        });
        setSmart_phones(smartphone_ids?.join(","));

        //strobes type
        let strobe_ids = [];
        form.strobe_id?.map((strobe) => {
            strobe_ids?.push(`${parseInt(strobe?.value)}`);
        });
        setStrobes(strobe_ids?.join(","));

        //specialize type
        let specialize_item_ids = [];
        form.specialize_item_id?.map((specialize) => {
            specialize_item_ids?.push(`${parseInt(specialize?.value)}`);
        });
        setSpecialize(specialize_item_ids?.join(","));

        //tripods type
        let tripod_ids = [];
        form.tripod_id?.map((tripod) => {
            tripod_ids?.push(`${parseInt(tripod?.value)}`);
        });
        setTripods(tripod_ids?.join(","));

        //speedlight type
        let speed_light_ids = [];
        form.speed_light_id?.map((speed_light) => {
            speed_light_ids?.push(`${parseInt(speed_light?.value)}`);
        });

        setCamera(camera_ids?.join(","));
        setLens(lens_ids.join(","));
        setSpeedlight(speed_light_ids?.join(","));
        setTripods(tripod_ids?.join(","));
        setStrobes(strobe_ids?.join(","));
        setSpecialize(specialize_item_ids?.join(","));
        setSmart_phones(smartphone_ids?.join(","));
    }, [form?.camera_id, form?.lens_id, form?.smartphone_id, form?.specialize_item_id, form?.speed_light_id, form?.strobe_id, form?.tripod_id, form?.first_name, form?.last_name, form?.mobile, form?.location]);

    //camera type
    useEffect(() => {
        if (camera_types?.camera?.length > 0) {
            let data = camera_types?.camera?.map((itm) => ({
                label: `${itm?.brand}${' '}${itm?.model}`,
                value: itm?.id,
            }));
            setCameraArray(data);
        } else {
            dispatch(cameraType());
        }
    }, [camera_types]);

    //lens type
    useEffect(() => {
        if (lens_type?.lens?.length > 0) {
            let data = lens_type?.lens?.map((itm) => ({
                label: itm?.name,
                value: itm?.id,
            }));
            setLensArray(data);
        } else {
            dispatch(lensType());
        }
    }, [lens_type]);

    //smart phone type
    useEffect(() => {
        if (smart_phone_type?.smartphone?.length > 0) {
            let data = smart_phone_type?.smartphone?.map((itm) => ({
                label: itm?.model_name,
                value: itm?.id,
            }));
            setSmartPhoneArray(data);
        } else {
            dispatch(smartPhoneType());
        }
    }, [smart_phone_type, changeLanguage]);

    //specialized type
    useEffect(() => {
        if (equipement_type?.specialize_items?.length > 0) {
            let data = equipement_type?.specialize_items?.map((itm) => ({
                label: itm?.name,
                value: itm?.id,
            }));

            data.unshift({
                label: t("NONE"),
                value: 0,
            });

            setSpecializedItemsArray(data);
        } else {
            dispatch(equipementType());
        }
    }, [equipement_type, changeLanguage]);

    //speed light type
    useEffect(() => {
        if (equipement_type?.speed_light?.length > 0) {
            let data = equipement_type?.speed_light?.map((itm) => ({
                label: itm?.name,
                value: itm?.id,
            }));

            data.unshift({
                label: t("NONE"),
                value: 0,
            });

            setSpeedLightsArray(data);
        } else {
            dispatch(equipementType());
        }
    }, [equipement_type, changeLanguage]);

    //tripod type
    useEffect(() => {
        if (equipement_type?.tripod?.length > 0) {
            let data = equipement_type?.tripod?.map((itm) => ({
                label: itm?.name,
                value: itm?.id,
            }));

            data.unshift({
                label: t("NONE"),
                value: 0,
            });

            setTripodsArray(data);
        } else {
            dispatch(equipementType());
        }
    }, [equipement_type, changeLanguage]);

    //strobe type
    useEffect(() => {

        if (equipement_type?.strobe?.length > 0) {
            let data = equipement_type?.strobe?.map((itm) => ({
                label: itm?.name,
                value: itm?.id,
            }));

            data.unshift({
                label: t("NONE"),
                value: 0,
            });

            setStrobesArray(data);
        } else {
            dispatch(equipementType());
        }
    }, [equipement_type, changeLanguage]);

    // user session data camera
    useEffect(() => {
        if (userData?.cameras) {
            let data = userData?.cameras?.map((itm) => ({
                label: `${itm?.camera_name[0]?.brand}${' '}${itm?.camera_name[0]?.model}`,
                value: itm?.camera_name[0]?.id,
            }));
            setForm((prevState) => ({
                ...prevState,
                ['camera_id']: data,
            }));
        }
    }, [])

    // user session data lens
    useEffect(() => {
        if (userData?.lenses) {
            let data = userData?.lenses?.map((itm) => ({
                label: `${itm?.lens_name[0]?.name}`,
                value: itm?.lens_name[0]?.id,
            }));
            setForm((prevState) => ({
                ...prevState,
                ['lens_id']: data,
            }));
        }
    }, [])

    // user session data smart phone
    useEffect(() => {
        if (userData?.smartphones) {
            let data = userData?.smartphones?.map((itm) => ({
                label: `${itm?.smartphone_name?.length > 0 ? itm?.smartphone_name[0]?.model_name : t("NONE")}`,
                value: itm?.smartphone_name?.length > 0 ? itm.id : 0,
            }));
            setForm((prevState) => ({
                ...prevState,
                ['smartphone_id']: data,
            }));
        }
    }, []);

    // user session data specialize item
    useEffect(() => {
        if (userData?.specialize[0]) {
            let data = userData?.specialize?.map((itm) => ({
                label: `${itm?.specialized_item_name?.length > 0 ? itm?.specialized_item_name[0]?.name : t("NONE")}`,
                value: itm?.specialized_item_name?.length > 0 ? itm?.specialized_item_name[0]?.id : 0,
            }));
            setForm((prevState) => ({
                ...prevState,
                ['specialize_item_id']: data,
            }));
        }
    }, []);

    // user session data speed light
    useEffect(() => {
        if (userData?.speedlights) {
            let data = userData?.speedlights.map((itm) => ({
                label: `${itm?.speed_light_name?.length > 0 ? itm?.speed_light_name[0]?.name : t("NONE")}`,
                value: itm?.speed_light_name?.length > 0 ? itm?.speed_light_name[0]?.id : 0,
            }));

            setForm((prevState) => ({
                ...prevState,
                ['speed_light_id']: data,
            }));
        }
    }, []);

    // user session data tripod
    useEffect(() => {
        if (userData?.tripods) {
            let data = userData?.tripods?.map((itm) => ({
                label: `${itm?.tripod_name?.length > 0 ? itm?.tripod_name[0]?.name : t("NONE")}`,
                value: itm?.tripod_name?.length > 0 ? itm?.tripod_name[0]?.id : 0,
            }));
            setForm((prevState) => ({
                ...prevState,
                ['tripod_id']: data,
            }));
        }
    }, []);

    // user session data strobe
    useEffect(() => {
        if (userData?.strobes) {
            let data = userData?.strobes?.map((itm) => ({
                label: `${itm?.strobe_name?.length > 0 ? itm?.strobe_name[0]?.name : t("NONE")}`,
                value: itm?.strobe_name?.length > 0 ? itm?.strobe_name[0]?.id : 0,
            }));
            setForm((prevState) => ({
                ...prevState,
                ['strobe_id']: data,
            }));
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

    const handleSubmit = (e) => {
        e.preventDefault();
        window.scrollTo(0, 0);

        const { errors, isValid } = validateEditProfile(form, t);

        if (isValid) {
            let profileUpdateForm = {
                id: userData?.id,
                first_name: form?.first_name,
                last_name: form?.last_name,
                mobile: form?.mobile,
                email: form?.email,
                location: form?.location,
                country_id: form?.country_id?.value,
                time_zone: form?.time_zone?.value,
                image: form?.image,
                lang: userData?.lang,

                camera: camera,
                lens: lens,
                smart_phones: smart_phones,
                strobes: strobes,
                specialize: specialize,
                tripods: tripods,
                speedlight: speedlight,
            };

            dispatch(
                editJobProfile({
                    profileUpdateForm,
                    callback: (data) => {
                        if (data) {
                            localStorage.setItem("userId", JSON.stringify(data?.id));
                            localStorage.setItem("userData", JSON.stringify(data));
                            localStorage.setItem("image", JSON.stringify(data?.image));
                        }

                    },
                })
            );
        } else {
            setError(errors);
        }
    };

    const uploadMultipleImageInS3 = async (filename, file) => {
        let originalName = `${makeRandomNumber(9)}${userData?.first_name}${userData?.id}`;
        const fileName = `${originalName}${"."}${filename.split('.').pop()}`;

        const params = {
            Body: file,
            Bucket: process.env.REACT_APP_BUCKET_NAME,
            ACL: 'public-read',
            Key: `profile_${userData?.id}/${fileName}`,

        };

        let s3Bucket = await s3.putObject(params).promise();

        if (s3Bucket) {
            console.log("Successfully original image uploaded data to " + params.Bucket + "/" + params.Key);
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

    return (
        <>
            <Header isJob={true} logoutFlag={uploadImageLoader} langSelector={true} calendar={true} />
            <section className="signUpNext-main dashboard-job edit_profile_container">
                <div className='back-btnn'>
                    <a onClick={() => history.push("/dashboard")} ><img src={leftArrowIcon} className="sm:ps-5 arrow cursor-pointer" alt="logo" /> {t("EDIT_PROFILE")}   </a>
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
                                        ) : userData?.image ? (
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
                                                    <img className='main-img' src={`${process.env.REACT_APP_AWS_DSP_AWS_URL}profile_${userData?.id}/${userData?.image}`} alt="img" />
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
                                                    autofocus
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
                                                <Input
                                                    name="location"
                                                    value={form?.location || ""}
                                                    onChange={(e) => { changeHandler(e) }}
                                                    type="text"
                                                    error={error?.location}
                                                    label={t("CITY")}
                                                />
                                                <SelectDropDown
                                                    options={timeZoneArray}
                                                    value={form.time_zone || ""}
                                                    name="time zone"
                                                    className="multiple-search "
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
                                                    value={form?.mobile || ""}
                                                    error={error?.mobile}
                                                    label={t("PHONE_NUMBER")}
                                                />
                                                <SelectDropDown
                                                    options={countryArray}
                                                    value={form.country_id || ""}
                                                    name="country"
                                                    isSearchable={true}
                                                    className=" "
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
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label>{t("LETS_GET_TO_KNOW_EQUIPMENT")}</label>
                                        <div className='d-flex justify-content-between flex-wrap'>
                                            <div className="half">
                                                <div className="form-group row">
                                                    <OptionsOutsideSelect
                                                        onChange={(value) => {
                                                            setForm((prevState) => ({
                                                                ...prevState,
                                                                ['camera_id']: value,
                                                            }))
                                                            setError((prevState) => ({
                                                                ...prevState,
                                                                ['camera_id']: "",
                                                            }))

                                                        }}
                                                        className="font-size-14-px"
                                                        isMulti
                                                        options={cameraArray}
                                                        value={form?.camera_id}
                                                        error={error?.camera_id}

                                                        placeholder={t("TYPE_AND_SELECT_YOUR_CAMERA")}
                                                        isLoading={camera_loader}
                                                    />
                                                </div>
                                                <div className="form-group row ">
                                                    <OptionsOutsideSelect
                                                        onChange={(value) => {
                                                            setForm((prevState) => ({
                                                                ...prevState,
                                                                ['lens_id']: value,
                                                            }))
                                                            setError((prevState) => ({
                                                                ...prevState,
                                                                ['lens_id']: "",
                                                            }))

                                                        }}
                                                        className="font-size-14-px"
                                                        isMulti
                                                        options={lensArray}
                                                        value={form?.lens_id}
                                                        error={error?.lens_id}
                                                        placeholder={t("LENS")}
                                                        isLoading={lens_loader}
                                                    />
                                                </div>
                                                <div className="form-group row">
                                                    <OptionsOutsideSelect
                                                        onChange={(value, e) => {
                                                            setForm((prevState) => ({
                                                                ...prevState,
                                                                ['speed_light_id']: e?.option?.value === 0 ? value?.filter((ele => ele?.value === 0)) : value?.filter((ele => ele?.value !== 0)),
                                                            }))
                                                            setError((prevState) => ({
                                                                ...prevState,
                                                                ['speed_light_id']: "",
                                                            }))

                                                        }}
                                                        className="font-size-14-px"
                                                        isMulti
                                                        options={speedLightsArray}
                                                        value={form?.speed_light_id}
                                                        error={error?.speed_light_id}
                                                        placeholder={t("SPEED_LIGHTS")}
                                                        isLoading={equipement_loader}
                                                    />
                                                </div>
                                                <div className="form-group row">
                                                    <OptionsOutsideSelect
                                                        onChange={(value, e) => {
                                                            setForm((prevState) => ({
                                                                ...prevState,
                                                                ['tripod_id']: e?.option?.value === 0 ? value?.filter((ele => ele?.value === 0)) : value?.filter((ele => ele?.value !== 0)),
                                                            }))
                                                            setError((prevState) => ({
                                                                ...prevState,
                                                                ['tripod_id']: "",
                                                            }))

                                                        }}
                                                        className="font-size-14-px"
                                                        isMulti
                                                        options={tripodsArray}
                                                        value={form?.tripod_id}
                                                        error={error?.tripod_id}
                                                        placeholder={t("TRIPODS")}
                                                        isLoading={equipement_loader}
                                                    />
                                                </div>
                                            </div>
                                            <div className="half">
                                                <div className="form-group row ">
                                                    <OptionsOutsideSelect
                                                        onChange={(value, e) => {
                                                            setForm((prevState) => ({
                                                                ...prevState,
                                                                ['strobe_id']: e?.option?.value === 0 ? value?.filter((ele => ele?.value === 0)) : value?.filter((ele => ele?.value !== 0)),
                                                            }))
                                                            setError((prevState) => ({
                                                                ...prevState,
                                                                ['strobe_id']: "",
                                                            }))

                                                        }}
                                                        className="font-size-14-px"
                                                        isMulti
                                                        options={strobesArray}
                                                        value={form?.strobe_id}
                                                        error={error?.strobe_id}
                                                        placeholder={t("STROBES")}
                                                        isLoading={equipement_loader}
                                                    />
                                                </div>
                                                <div className="form-group row">
                                                    <OptionsOutsideSelect
                                                        onChange={(value, e) => {
                                                            setForm((prevState) => ({
                                                                ...prevState,
                                                                ['specialize_item_id']: e?.option?.value === 0 ? value?.filter((ele => ele?.value === 0)) : value?.filter((ele => ele?.value !== 0)),
                                                            }))
                                                            setError((prevState) => ({
                                                                ...prevState,
                                                                ['specialize_item_id']: "",
                                                            }))

                                                        }}
                                                        className="font-size-14-px"
                                                        isMulti
                                                        options={specializedItemsArray}
                                                        value={form?.specialize_item_id}
                                                        error={error?.specialize_item_id}
                                                        placeholder={t("SPECIALIZES_ITEMS")}
                                                        isLoading={equipement_loader}
                                                    />
                                                </div>
                                                <div className="form-group row ">
                                                    <OptionsOutsideSelect
                                                        onChange={(value) => {
                                                            setForm((prevState) => ({
                                                                ...prevState,
                                                                ['smartphone_id']: value,
                                                            }))
                                                            setError((prevState) => ({
                                                                ...prevState,
                                                                ['smartphone_id']: "",
                                                            }))

                                                        }}
                                                        className="font-size-14-px"
                                                        isMulti
                                                        options={smartPhoneArray}
                                                        value={form?.smartphone_id}
                                                        error={error?.smartphone_id}
                                                        placeholder={t("SMARTPHONE")}
                                                        isLoading={smart_phone_loader}
                                                    />
                                                </div>
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