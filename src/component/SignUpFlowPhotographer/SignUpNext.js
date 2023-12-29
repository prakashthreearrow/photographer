import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { OptionsOutsideSelect, Button, Footer, Loader } from "../CommonComponent";
import logo from "../../assets/images/logo.svg";
import leftArrowIcon from "../../assets/images/leftArrowIcon.svg";
import validateSignUpNext from "../../validation/SignUpFlowPhotographer/SignUpNext";
import { getLocalStorageItem } from "../../utils/helper";
import {
  cameraType,
  equipementType,
  lensType,
  smartPhoneType,
  updatePhotographer
} from "../../redux/action";

export default function SignUpNext() {
  const { i18n, t } = useTranslation();

  const [form, setForm] = useState({
    camera_id: [],
    lens_id: [],
    speed_light_id: [],
    tripod_id: [],
    strobe_id: [],
    specialize_item_id: [],
    smartphone_id: [],
  });

  const [cameraArray, setCameraArray] = useState([]);
  const [lensArray, setLensArray] = useState([]);
  const [speedLightsArray, setSpeedLightsArray] = useState([]);
  const [tripodsArray, setTripodsArray] = useState([]);
  const [strobesArray, setStrobesArray] = useState([]);
  const [specializedItemsArray, setSpecializedItemsArray] = useState([]);
  const [smartPhoneArray, setSmartPhoneArray] = useState([]);

  const [category, setCategory] = useState("");

  const [error, setError] = useState({});
  const [isForm, setIsform] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

  let userData = JSON.parse(getLocalStorageItem("userData"));
  let SignUp = JSON.parse(getLocalStorageItem("SignUp"));
  let SignUpNext = JSON.parse(getLocalStorageItem("SignUpNext"));
  const ct = require('countries-and-timezones');
  const countries = ct.getAllCountries();

  const camera_types = useSelector((state) => state?.CameraType?.cameraArray);

  const camera_loader = useSelector((state) => state?.CameraType?.loading);

  const equipement_type = useSelector(
    (state) => state?.EquipementType?.equipementArray
  );

  const equipement_loader = useSelector(
    (state) => state?.EquipementType?.loading
  );

  const lens_type = useSelector((state) => state?.LensType?.lensArray);

  const lens_loader = useSelector((state) => state?.LensType?.loading);

  const smart_phone_type = useSelector(
    (state) => state?.SmartPhoneType?.smartPhoneArray
  );

  const smart_phone_loader = useSelector(
    (state) => state?.SmartPhoneType?.loading
  );

  const changeLanguage = (event) => {
    if (event.label === "onReload") {
      i18n.changeLanguage(event.value);
    }
  };

  useEffect(() => {
    changeLanguage({ label: "onReload", value: userData?.lang });

    if (location?.state !== undefined) {
      localStorage.setItem(
        "SignUp",
        JSON.stringify(location?.state?.SignUp)
      );
    }

    if (getLocalStorageItem("token") && getLocalStorageItem("userData")) {
      if (userData?.roles[0]?.id === 5) {
        if (userData?.is_profile_completed === 1) {
          history.push("/dashboard");
        } else {
          if (SignUp?.first_name) {
            history.push("/sign-up-next");
          } else if (userData?.is_updated_steps === "1") {
            history.push("/sign-up-next");
          } else {
            history.push("/sign-up");
          }
        }
      } else if (userData?.roles[0]?.id === 7) {
        if (userData?.is_profile_completed === 1) {
          history.push("/client-dashboard");
        }
      }
    } else {
      history.push("/");
    }
  }, []);

  // location camera
  useEffect(() => {
    if (SignUpNext?.camera_id) {
      let data = SignUpNext?.camera_id?.map((itm) => ({
        label: `${itm?.label}`,
        value: itm?.value,
      }));
      setForm((prevState) => ({
        ...prevState,
        ["camera_id"]: data,
      }));
    } else {
      let data = userData?.cameras?.map((itm) => ({
        label: `${itm?.camera_name[0]?.brand}${" "}${itm?.camera_name[0]?.model}`,
        value: itm?.camera_name[0]?.id,
      }));
      setForm((prevState) => ({
        ...prevState,
        ["camera_id"]: data,
      }));
    }
  }, []);

  // location lens
  useEffect(() => {
    if (SignUpNext?.lens_id) {
      let data = SignUpNext?.lens_id?.map((itm) => ({
        label: `${itm?.label}`,
        value: itm?.value,
      }));
      setForm((prevState) => ({
        ...prevState,
        ["lens_id"]: data,
      }));
    } else {
      let data = userData?.lenses?.map((itm) => ({
        label: `${itm?.lens_name[0]?.name}`,
        value: itm?.lens_name[0]?.id,
      }));
      setForm((prevState) => ({
        ...prevState,
        ["lens_id"]: data,
      }));
    }
  }, []);

  // location smart phone
  useEffect(() => {
    if (SignUpNext?.smartphone_id) {
      let data = SignUpNext?.smartphone_id?.map((itm) => ({
        label: `${itm?.label}`,
        value: itm?.value,
      }));
      setForm((prevState) => ({
        ...prevState,
        ["smartphone_id"]: data,
      }));
    } else {
      let data = userData?.smartphones?.map((itm) => ({
        label: `${itm?.smartphone_name[0]?.model_name}`,
        value: itm?.smartphone_name[0]?.id,
      }));
      setForm((prevState) => ({
        ...prevState,
        ["smartphone_id"]: data,
      }));
    }
  }, []);

  // location specialize items
  useEffect(() => {
    if (SignUpNext?.specialize_item_id) {
      let data = SignUpNext?.specialize_item_id?.map((itm) => ({
        label: `${itm?.label}`,
        value: itm?.value,
      }));
      setForm((prevState) => ({
        ...prevState,
        ["specialize_item_id"]: data,
      }));
    } else {
      let data = userData?.specialize?.map((itm) => ({
        label: `${itm?.specialized_item_name[0]?.name}`,
        value: itm?.specialized_item_name[0]?.id,
      }));
      setForm((prevState) => ({
        ...prevState,
        ["specialize_item_id"]: data,
      }));
    }
  }, []);

  // location speed light
  useEffect(() => {
    if (SignUpNext?.speed_light_id) {
      let data = SignUpNext?.speed_light_id?.map((itm) => ({
        label: `${itm?.label}`,
        value: itm?.value,
      }));
      setForm((prevState) => ({
        ...prevState,
        ["speed_light_id"]: data,
      }));
    } else {
      let data = userData?.speedlights?.map((itm) => ({
        label: `${itm?.speed_light_name[0]?.name}`,
        value: itm?.speed_light_name[0]?.id,
      }));
      setForm((prevState) => ({
        ...prevState,
        ["speed_light_id"]: data,
      }));
    }
  }, []);

  // location tripod
  useEffect(() => {
    if (SignUpNext?.tripod_id) {
      let data = SignUpNext?.tripod_id?.map((itm) => ({
        label: `${itm?.label}`,
        value: itm?.value,
      }));
      setForm((prevState) => ({
        ...prevState,
        ["tripod_id"]: data,
      }));
    } else {
      let data = userData?.tripods?.map((itm) => ({
        label: `${itm?.tripod_name[0]?.name}`,
        value: itm?.tripod_name[0]?.id,
      }));
      setForm((prevState) => ({
        ...prevState,
        ["tripod_id"]: data,
      }));
    }
  }, []);

  // location strobe
  useEffect(() => {
    if (SignUpNext?.strobe_id) {
      let data = SignUpNext?.strobe_id?.map((itm) => ({
        label: `${itm?.label}`,
        value: itm?.value,
      }));
      setForm((prevState) => ({
        ...prevState,
        ["strobe_id"]: data,
      }));
    } else {
      let data = userData?.strobes?.map((itm) => ({
        label: `${itm?.strobe_name[0]?.name}`,
        value: itm?.strobe_name[0]?.id,
      }));
      setForm((prevState) => ({
        ...prevState,
        ["strobe_id"]: data,
      }));
    }
  }, []);

  // admin added category
  useEffect(() => {
    let categories_ids = [];
    if (SignUp?.category_id) {
      SignUp?.category_id?.map((category) => {
        categories_ids?.push(category.value);
      });
    } else {
      userData?.categories?.map((category) => {
        categories_ids?.push(category?.category_name[0]?.id);
      });
    }

    let categoryIds = categories_ids?.join(",");
    setCategory(categoryIds);

  }, []);

  //camera type
  useEffect(() => {
    if (camera_types?.camera?.length > 0) {
      let data = camera_types.camera.map((itm) => ({
        label: `${itm.brand}${" "}${itm.model}`,
        value: itm.id,
      }));
      setCameraArray(data);
    } else {
      dispatch(cameraType());
    }
  }, [camera_types]);

  //lens type
  useEffect(() => {
    if (lens_type?.lens?.length > 0) {
      let data = lens_type.lens.map((itm) => ({
        label: itm.name,
        value: itm.id,
      }));
      setLensArray(data);
    } else {
      dispatch(lensType());
    }
  }, [lens_type]);

  //smart phone type
  useEffect(() => {
    if (smart_phone_type?.smartphone?.length > 0) {
      let data = smart_phone_type.smartphone.map((itm) => ({
        label: itm.model_name,
        value: itm.id,
      }));
      setSmartPhoneArray(data);
    } else {
      dispatch(smartPhoneType());
    }
  }, [smart_phone_type]);

  //specialized type
  useEffect(() => {
    if (equipement_type?.specialize_items?.length > 0) {
      let data = equipement_type.specialize_items.map((itm) => ({
        label: itm.name,
        value: itm.id,
      }));

      data.unshift({
        label: t("NONE"),
        value: 0,
      });

      setSpecializedItemsArray(data);
    } else {
      dispatch(equipementType());
    }
  }, [equipement_type]);

  //speed light type
  useEffect(() => {
    if (equipement_type?.speed_light?.length > 0) {
      let data = equipement_type.speed_light.map((itm) => ({
        label: itm.name,
        value: itm.id,
      }));

      data.unshift({
        label: t("NONE"),
        value: 0,
      });

      setSpeedLightsArray(data);
    } else {
      dispatch(equipementType());
    }
  }, [equipement_type]);

  //tripod type
  useEffect(() => {
    if (equipement_type?.tripod?.length > 0) {
      let data = equipement_type.tripod.map((itm) => ({
        label: itm.name,
        value: itm.id,
      }));

      data.unshift({
        label: t("NONE"),
        value: 0,
      });

      setTripodsArray(data);
    } else {
      dispatch(equipementType());
    }
  }, [equipement_type]);

  //strobe type
  useEffect(() => {
    if (equipement_type?.strobe?.length > 0) {
      let data = equipement_type.strobe.map((itm) => ({
        label: itm.name,
        value: itm.id,
      }));

      data.unshift({
        label: t("NONE"),
        value: 0,
      });

      setStrobesArray(data);
    } else {
      dispatch(equipementType());
    }
  }, [equipement_type]);

  const signUpPrev = (e) => {
    e.preventDefault();
    history.push({
      pathname: "/sign-up",
      state: {
        SignUp: SignUp,
        SignUpNext: location?.state?.SignUpNext,
        SignUpNext2: location?.state?.SignUpNext2,
        SignUpNext3: location?.state?.SignUpNext3,
        SignUpNext4: location?.state?.SignUpNext4,
        SignUpNext5: location?.state?.SignUpNext5,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { errors, isValid } = validateSignUpNext(form, t);
    if (isValid) {
      setIsLoading(true);


      let camera_ids = [];
      form?.camera_id?.map((camera) => {
        camera_ids.push(camera.value);
      });
      let cameraIds = camera_ids.join(",");

      let lens_ids = [];
      form?.lens_id?.map((lens) => {
        lens_ids.push(lens.value);
      });
      let lensIds = lens_ids.join(",");

      let speedLight_ids = [];
      form?.speed_light_id?.map((speed_light) => {
        speedLight_ids.push(speed_light.value);
      });
      let speedLightIds = speedLight_ids.join(",");

      let tripod_ids = [];
      form?.tripod_id?.map((tripod) => {
        tripod_ids.push(tripod.value);
      });
      let tripodIds = tripod_ids.join(",");

      let strobe_ids = [];
      form?.strobe_id?.map((strobe) => {
        strobe_ids.push(strobe.value);
      });
      let strobeIds = strobe_ids.join(",");

      let specializedItem_ids = [];
      form?.specialize_item_id?.map((specializedItem) => {
        specializedItem_ids.push(specializedItem.value);
      });
      let specializedItemIds = specializedItem_ids.join(",");

      let smartPhone_ids = [];
      form?.smartphone_id?.map((smartPhone) => {
        smartPhone_ids.push(smartPhone.value);
      });
      let smartPhonesIds = smartPhone_ids.join(",");

      //country and time zone
      let country = {};
      let timeZoneSelected = {};
      if (userData?.country_id) {
        const countryNames = Object.values(countries);

        let countryData = countryNames?.find(
          (country) => country?.id === userData?.country_id
        );

        let time_zones = countryData?.timezones?.map((itm) => ({
          label: itm,
          value: itm,
        }));

        timeZoneSelected = time_zones?.find(
          (ele) => ele?.value === userData?.time_zone
        );

        country = {
          label: countryData?.name,
          value: countryData?.id,
        };

      }

      let profileUpdateForm = {};

      profileUpdateForm = {
        ...profileUpdateForm,
        id: userData?.id,
        first_name: SignUp?.first_name || userData?.first_name || "",
        last_name: SignUp?.last_name || userData?.last_name || "",
        email: SignUp?.email || userData?.email || "",
        location: SignUp?.location || userData?.location || "",
        country_id: SignUp ? SignUp?.country_id?.value : country,
        time_zone: SignUp ? SignUp?.time_zone?.value : timeZoneSelected,
        mobile: SignUp?.mobile || userData?.mobile || "",
        work_email: SignUp?.work_email || userData?.work_email || "",
        category: category,
        is_confirmed: SignUp?.confirm === true ? 1 : 0 || userData?.is_confirmed || "",

        camera: cameraIds,
        lens: lensIds,
        smart_phones: smartPhonesIds,
        strobes: strobeIds,
        specialize: specializedItemIds,
        tripods: tripodIds,
        speedlight: speedLightIds,
        is_updated_steps: "2",
        lang: userData?.lang
      };


      if (!isForm) {

        dispatch(
          updatePhotographer({
            profileUpdateForm,
            callback: (data) => {

              localStorage.setItem("userData", JSON.stringify(data));
              setIsLoading(false);
              history.push({
                pathname: "/sign-up-next2",
                state: {
                  SignUp: SignUp,
                  SignUpNext: form,
                  SignUpNext2: location?.state?.SignUpNext2 || location?.SignUpNext2,
                  SignUpNext3: location?.state?.SignUpNext3 || location?.SignUpNext3,
                  SignUpNext4: location?.state?.SignUpNext4 || location?.SignUpNext4,
                  SignUpNext5: location?.state?.SignUpNext5 || location?.SignUpNext5,
                },
              });
            },
          })
        );


      } else {
        dispatch(
          updatePhotographer({
            profileUpdateForm,
            callback: (data) => {
              localStorage.setItem("userData", JSON.stringify(data));
              setIsLoading(false);
              history.push({
                pathname: "/sign-up-next2",
                state: {
                  SignUp: SignUp,
                  SignUpNext: form,
                  SignUpNext2: location?.state?.SignUpNext2 || location?.SignUpNext2,
                  SignUpNext3: location?.state?.SignUpNext3 || location?.SignUpNext3,
                  SignUpNext4: location?.state?.SignUpNext4 || location?.SignUpNext4,
                  SignUpNext5: location?.state?.SignUpNext5 || location?.SignUpNext5,
                },
              });
            },
          })
        );


      }
    } else {
      setError(errors);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <section className="signUpNext-main ">
        <div className="container">
          <div className="logo-center">
            <img src={logo} className="header-logo" alt="logo" />
          </div>
          <div className="row justify-content-center">
            <div className="col-10 col-sm-12 col-md-8 signUpNext-detail py-5 animated fadeIn">
              <div className="d-flex align-items-baseline photo-signup-header">
                <img
                  onClick={(e) => {
                    signUpPrev(e);
                  }}
                  src={leftArrowIcon}
                  className="sm:ps-5 arrow arrow-left"
                  alt="logo"
                />
                <p className="text_body">{t("LETS_GET_TO_KNOW_EQUIPMENT")}</p>
              </div>
              <form
                className="mx-xl-10 signupnext-padding "
                onSubmit={(e) => handleSubmit(e)}
              >
                <div className="row justify-content-evenly ">
                  <div className="col-12 col-lg-5">
                    <div className="form-group row fg-md1">
                      <OptionsOutsideSelect
                        onChange={(value) => {
                          setForm((prevState) => ({
                            ...prevState,
                            ["camera_id"]: value,
                          }));
                          setError((prevState) => ({
                            ...prevState,
                            ["camera_id"]: "",
                          }));
                          setIsform(true);
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
                    <div className="form-group row fg-md1">
                      <OptionsOutsideSelect
                        onChange={(value) => {
                          setForm((prevState) => ({
                            ...prevState,
                            ["lens_id"]: value,
                          }));
                          setError((prevState) => ({
                            ...prevState,
                            ["lens_id"]: "",
                          }));
                          setIsform(true);
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
                    <div className="form-group row fg-md1">
                      <OptionsOutsideSelect
                        onChange={(value, e) => {
                          setForm((prevState) => ({
                            ...prevState,
                            ["speed_light_id"]: e?.option?.value === 0 ? value?.filter((ele => ele?.value === 0)) : value?.filter((ele => ele?.value !== 0))
                          }));
                          setError((prevState) => ({
                            ...prevState,
                            ["speed_light_id"]: "",
                          }));
                          setIsform(true);
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
                    <div className="form-group row fg-md1">
                      <OptionsOutsideSelect
                        onChange={(value, e) => {
                          setForm((prevState) => ({
                            ...prevState,
                            ["tripod_id"]: e?.option?.value === 0 ? value?.filter((ele => ele?.value === 0)) : value?.filter((ele => ele?.value !== 0)),
                          }));
                          setError((prevState) => ({
                            ...prevState,
                            ["tripod_id"]: "",
                          }));
                          setIsform(true);
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
                  <div className="col-12 col-lg-5">
                    <div className="form-group row fg-md1">
                      <OptionsOutsideSelect
                        onChange={(value, e) => {
                          setForm((prevState) => ({
                            ...prevState,
                            ["strobe_id"]: e?.option?.value === 0 ? value?.filter((ele => ele?.value === 0)) : value?.filter((ele => ele?.value !== 0)),
                          }));
                          setError((prevState) => ({
                            ...prevState,
                            ["strobe_id"]: "",
                          }));
                          setIsform(true);
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
                    <div className="form-group row fg-md1">
                      <OptionsOutsideSelect
                        onChange={(value, e) => {
                          setForm((prevState) => ({
                            ...prevState,
                            ["specialize_item_id"]: e?.option?.value === 0 ? value?.filter((ele => ele?.value === 0)) : value?.filter((ele => ele?.value !== 0)),
                          }));
                          setError((prevState) => ({
                            ...prevState,
                            ["specialize_item_id"]: "",
                          }));
                          setIsform(true);
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
                    <div className="form-group row fg-md1">
                      <OptionsOutsideSelect
                        onChange={(value) => {
                          setForm((prevState) => ({
                            ...prevState,
                            ["smartphone_id"]: value,
                          }));
                          setError((prevState) => ({
                            ...prevState,
                            ["smartphone_id"]: "",
                          }));
                          setIsform(true);
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
                <div className="text-center mt-5">
                  <Button
                    text={t("NEXT")}
                    type="submit"
                    className="text-uppercase w-100 signUpNext-button"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
        <Footer headerDesign={true} />
      </section>
    </>
  );
}
