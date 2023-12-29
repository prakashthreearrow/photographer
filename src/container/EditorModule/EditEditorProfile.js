import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  Button,
  Footer,
  Input,
  InputNumberCountryCodeCountryFlagDropDown,
  SelectDropDown,
  MultipleSearchSelect,
  OptionsOutsideSelect
} from "../../component/CommonComponent";
import Header from "../../component/layout/Header";
import { s3 } from "../../utils/aws";
import leftArrowIcon from "../../assets/images/leftArrowIcon.svg";
import editIcon from "../../assets/images/edit-icon.png";
import validateSignUpEditor from "../../validation/SignUpFlowEditor/signUpFlowEditor";
import {
  getLocalStorageItem,
  WarningToast,
  makeRandomNumber,
} from "../../utils/helper";
import { IMAGE_EDITOR, VIDEO_EDITOR, EDITING_SUITE_TYPE } from './../../utils/constants';
import {
  editorUpdate,
} from "../../redux/action";

export default function SignUpNext() {
  const { i18n, t } = useTranslation();

  let userData = JSON.parse(getLocalStorageItem("userData"));
  let user_image = JSON.parse(getLocalStorageItem("image"));
  let user_id = JSON.parse(getLocalStorageItem("userId"));
  const ct = require("countries-and-timezones");
  const countries = ct.getAllCountries();

  const EDITING_TYPE = [
    { label: "Adobe Creative Cloud", value: "1" },
    { label: "Adobe Photoshop", value: "2" },
    { label: "PhotoDirector Essential", value: "3" },
    { label: "Pixlr", value: "4" },
  ];

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    location: "",
    country_id: [],
    showreel_link: "",
    editing_suite: [],
    time_zone: [],
    mobile: "",
    imageFile: "",
    image: "",
    default_country: "CL",

    image_editor: [],
    video_editor: [],
  });

  const [error, setError] = useState("");
  const [uploadImageLoader, setUploadImageLoader] = useState(false);
  const [countryArray, setCountryArray] = useState([]);
  const [timeZoneArray, setTimeZoneArray] = useState([]);
  const [imageArray, setImageArray] = useState([]);
  const [videoArray, setVideoArray] = useState([]);
  const [onClickButtonToggle, setOnClickButtonToggle] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();
  const profile = useRef();

  // user session of image and video editor
  useEffect(() => {
    if (userData?.image_editor) {
      let imageData = userData?.image_editor?.split(",");

      let temporaryImageData = IMAGE_EDITOR.map((itm) => ({
        label: itm.label,
        value: itm.value,
      }));

      temporaryImageData.unshift({
        label: t("NONE"),
        value: 0,
      });

      let imageDataArray = temporaryImageData?.map((itm) => ({
        label: `${itm?.label}`,
        value: `${itm?.value}`,
      }))?.filter((image) => !imageData?.includes(image?.value.toString()))

      setImageArray(imageDataArray);

      let data = imageData?.map((itm) => ({
        label: `${temporaryImageData?.find((ele) => ele?.value === parseInt(itm))?.label}`,
        value: `${parseInt(temporaryImageData?.find((ele) => ele?.value === parseInt(itm))?.value)}`,
      }));

      setForm((prevState) => ({
        ...prevState,
        ['image_editor']: data,
      }));
    }


    //video_editor
    let temporarryVideoData = VIDEO_EDITOR.map((itm) => ({
      label: itm.label,
      value: itm.value,
    }));

    temporarryVideoData.unshift({
      label: t("NONE"),
      value: 0,
    });

    let videoDataArray = temporarryVideoData?.map((itm) => ({
      label: `${itm?.label}`,
      value: `${itm?.value}`,
    }))
    setVideoArray(videoDataArray);

    if (userData?.video_editor) {
      let videoData = userData?.video_editor?.split(",");

      let temporarryVideoData = VIDEO_EDITOR.map((itm) => ({
        label: itm.label,
        value: itm.value,
      }));

      temporarryVideoData.unshift({
        label: t("NONE"),
        value: 0,
      });


      let videoDataArray = temporarryVideoData?.map((itm) => ({
        label: `${itm?.label}`,
        value: `${itm?.value}`,
      }))?.filter((video) => !videoData?.includes(video?.value.toString()))

      setVideoArray(videoDataArray);

      let data = videoData?.map((itm) => ({
        label: `${temporarryVideoData?.find((ele) => ele?.value === parseInt(itm))?.label}`,
        value: `${parseInt(temporarryVideoData?.find((ele) => ele?.value === parseInt(itm))?.value)}`,
      }));

      setForm((prevState) => ({
        ...prevState,
        ['video_editor']: data,
      }));
    }

  }, [])

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
          history.push("/edit-editor-profile");
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

    let suiteType = EDITING_SUITE_TYPE?.find(
      (suite) => suite?.value === parseInt(userData?.editing_suite)
    );
    setForm((prevState) => ({
      ...prevState,
      first_name: userData?.first_name || "",
      last_name: userData?.last_name || "",
      location: userData?.location || "",
      email: userData?.email || "",
      country_id: country,
      time_zone: timeZoneSelected,
      mobile: userData?.mobile,
      showreel_link: userData?.work_email,
      editing_suite: suiteType,
    }));
  }, []);

  const changeHandler = (e, name) => {
    if (e.target) {
      const value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;

      const { name } = e.target;
      setError((prevState) => ({
        ...prevState,
        [name]: "",
      }));
      setForm((prevState) => ({
        ...prevState,
        [name]: value,
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

  const uploadMultipleImageInS3 = async (filename, file) => {
    let userData = JSON.parse(getLocalStorageItem("userData"));
    let originalName = `${makeRandomNumber(9)}${userData?.first_name}${userData?.id
      }`;
    const fileName = `${originalName}${"."}${filename?.split(".")?.pop()}`;

    const params = {
      Body: file,
      Bucket: process.env.REACT_APP_BUCKET_NAME,
      ACL: "public-read",
      Key: `profile_${userData?.id}/${fileName}`,
    };

    let s3Bucket = await s3.putObject(params).promise();

    if (s3Bucket) {
      console.log(
        "Successfully original image uploaded data to " +
        params?.Bucket +
        "/" +
        params?.Key
      );
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
        image: form?.image,
        lang: userData?.lang,

        image_editor: image_editor_ids.join(","),
        video_editor: video_editor_ids?.join(","),
        is_profile_completed: 1
      };

      dispatch(
        editorUpdate({
          profileForm,
          callback: (data) => {
            if (data) {
              setOnClickButtonToggle(false);
              localStorage.setItem("userData", JSON.stringify(data));
              localStorage.setItem("image", JSON.stringify(data?.image));
              localStorage.setItem("userId", JSON.stringify(data?.id));
            }
          },
        })
      );
    } else {
      setError(errors);
    }
  };

  return (
    <>
      <Header isJob={true} logoutFlag={uploadImageLoader} langSelector={true} />
      <section className="signUpNext-main dashboard-job signUp-main">
        <div className="container">
          <div className="back-btnn">
            <a>
              <img
                onClick={() => history.push("/dashboard")}
                src={leftArrowIcon}
                className="sm:ps-5 arrow cursor-pointer"
                alt="logo"
              />{" "}
              {t("EDIT_PROFILE")}{" "}
            </a>
          </div>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="row justify-content-center"
          >
            <div className="col-10 col-sm-12 col-md-8  py-5 animated fadeIn job-edit-profile signUp-client-detail editor-profile">
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
                          <div
                            className="profile-image mx-auto cursor-pointer"
                            onClick={uploadProfile}
                          >
                            <img
                              className="main-img"
                              src={URL.createObjectURL(form?.imageFile)}
                              alt=""
                              onClick={uploadProfile}
                            />
                            <img
                              className="editicon"
                              src={editIcon}
                              alt="img"
                            />
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

                          <div
                            className="profile-image mx-auto cursor-pointer"
                            onClick={uploadProfile}
                          >
                            <img
                              className="main-img"
                              src={`${process.env.REACT_APP_AWS_DSP_AWS_URL}profile_${user_id}/${user_image}`}
                              alt="img"
                            />
                            <img
                              className="editicon"
                              src={editIcon}
                              alt="img"
                            />
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
                          <div
                            className="profile-image mx-auto cursor-pointer"
                            onClick={uploadProfile}
                          >
                            <span className="profile-name">
                              {form?.first_name?.split("")[0]?.toUpperCase()}
                              {form?.last_name?.split("")[0]?.toUpperCase()}
                            </span>

                            <img
                              className="editicon"
                              src={editIcon}
                              alt="img"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="form-group row">
                      <label>{t("PERSONAL_DETAIL")}</label>
                      <div className="d-flex justify-content-between flex-wrap">
                        <div className="half">
                          <Input
                            type="text"
                            className=""
                            name="first_name"
                            value={form?.first_name}
                            onChange={(e) => {
                              changeHandler(e);
                            }}
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
                            onChange={(e) => {
                              changeHandler(e);
                            }}
                            error={error?.email}
                            maxLength="100"
                            label={t("EMAIL_ADDRESS")}
                          />
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
                          <Input
                            name="showreel_link"
                            value={form?.showreel_link || ""}
                            onChange={(e) => {
                              changeHandler(e);
                            }}
                            type="text"
                            error={error?.showreel_link}
                            label="Showreel Link"
                          />
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
                        <div className="half">
                          <Input
                            type="text"
                            className=""
                            name="last_name"
                            value={form?.last_name}
                            onChange={(e) => {
                              changeHandler(e);
                            }}
                            error={error?.last_name}
                            maxLength="100"
                            label={t("LAST_NAME")}
                          />
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
                                ["country_id"]: value,
                              }));
                              setError((prevState) => ({
                                ...prevState,
                                ["country_id"]: "",
                              }));
                            }}
                            label={t("COUNTRY")}
                            error={error?.country_id}
                          />
                          <InputNumberCountryCodeCountryFlagDropDown
                            name="mobile"
                            className="country-one"
                            onChange={(value) => {
                              setForm((prevState) => ({
                                ...prevState,
                                ["mobile"]: value,
                              }));

                              setError((prevState) => ({
                                ...prevState,
                                ["mobile"]: "",
                              }));
                            }}
                            value={form?.mobile}
                            error={error?.mobile}
                            label={t("PHONE_NUMBER")}
                          />
                          <SelectDropDown
                            options={timeZoneArray}
                            value={form.time_zone || ""}
                            name="time zone"
                            className="multiple-search "
                            onChange={(value) => {
                              setOnClickButtonToggle(false);
                              setForm((prevState) => ({
                                ...prevState,
                                ["time_zone"]: value,
                              }));
                              setError((prevState) => ({
                                ...prevState,
                                ["time_zone"]: "",
                              }));
                            }}
                            label={t("TIME_ZONE")}
                            error={error?.time_zone}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <label>{t("EDITING_SUITE_AND_SOFTWARE")}</label>
                      <div className="d-flex justify-content-between flex-wrap">
                        {form?.editing_suite?.value === 1 ? <div className="half">
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
                          /> {console.log("videoArray", videoArray)}
                        </div> : form?.editing_suite?.value === 2 ? <div className="half">
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
                          />
                        </div> : <>
                          <div className="half">
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
                            />
                          </div> {console.log("videoArray", videoArray)}
                          <div className="half">
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
                            />
                          </div>
                        </>}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center ">
                  <Button
                    disabled={onClickButtonToggle}
                    text={t("SAVE")}
                    type="submit"
                    className={`${onClickButtonToggle ? "disable-btn-one" : ""} text-uppercase w-100 signUpNext-button`}
                  />
                </div>
              </div>
            </div>
          </form>
          <Footer headerDesign={true} />
        </div>
      </section>
    </>
  );
}
