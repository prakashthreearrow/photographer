import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Footer, Loader } from "../CommonComponent";
import logo from "../../assets/images/logo.svg";
import leftArrowIcon from "../../assets/images/leftArrowIcon.svg";
import tickIcon from "../../assets/images/tick.svg";
import validateSignUpNext2 from "../../validation/SignUpFlowPhotographer/SignUpNext2";
import { getLocalStorageItem } from "../../utils/helper";
import { updatePhotographer } from "../../redux/action";

export default function SignUpNext() {
  const { i18n, t } = useTranslation();

  const [form, setForm] = useState({
    car_access: "",
    car_access_other: "",
  });

  const [error, setError] = useState({});
  const [isForm, setIsform] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [category, setCategory] = useState("");
  const [camera, setCamera] = useState("");
  const [lens, setLens] = useState("");
  const [smartPhones, setSmartPhones] = useState("");
  const [specializeItem, setSpecializeItem] = useState("");
  const [speedLight, setSpeedLight] = useState("");
  const [strobe, setStrobe] = useState("");
  const [tripods, setTripods] = useState("");

  const location = useLocation();
  const history = useHistory();

  let userData = JSON.parse(getLocalStorageItem("userData"));
  let SignUp = JSON.parse(getLocalStorageItem("SignUp"));
  let SignUpNext = JSON.parse(getLocalStorageItem("SignUpNext"));
  let SignUpNext2 = JSON.parse(getLocalStorageItem("SignUpNext2"));
  const ct = require('countries-and-timezones');
  const countries = ct.getAllCountries();

  const dispatch = useDispatch();

  useEffect(() => {
    changeLanguage({ label: "onReload", value: userData?.lang });

    if (location?.state !== undefined) {
      localStorage.setItem(
        "SignUpNext",
        JSON.stringify(location?.state?.SignUpNext)
      );
    }

    if (getLocalStorageItem("token") && getLocalStorageItem("userData")) {
      if (userData?.roles[0]?.id === 5) {
        if (userData?.is_profile_completed === 1) {
          history.push("/dashboard");
        } else {
          if (userData?.is_profile_completed === 0) {
            if (SignUpNext?.camera_id) {
              history.push("/sign-up-next2");
            } else if (userData?.is_updated_steps === "2") {
              history.push("/sign-up-next2");
            } else {
              history.push("/sign-up-next");
            }
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

  useEffect(() => {
    setForm((prevState) => ({
      ...prevState,
      car_access: SignUpNext2?.car_access || userData?.car_access || "",
      car_access_other: SignUpNext2?.car_access_other || userData?.car_access_other || ""
    }));
  }, []);

  // data from login user response session
  useEffect(() => {
    let category_ids = [];
    if (userData?.categories) {
      userData?.categories?.map((category) => {
        category_ids.push(`${category?.category_name[0]?.id}`);
      });
      setCategory(category_ids.join(","));
    } else {
      SignUp?.category_id?.map((category) => {
        category_ids?.push(category?.value);
      });
      setCategory(category_ids?.join(","));
    }
  }, []);

  // data from user response session
  useEffect(() => {
    let camera_ids = [];
    if (userData?.cameras) {
      userData?.cameras?.map((camera) => {
        camera_ids.push(camera?.camera_name[0]?.id);
      });
      setCamera(camera_ids.join(","));
    } else {
      SignUpNext?.camera_id?.map((camera) => {
        camera_ids?.push(camera?.value);
      });
      setCamera(camera_ids?.join(","));
    }

    let lens_ids = [];
    if (userData?.lenses) {
      userData?.lenses?.map((lens) => {
        lens_ids.push(lens?.lens_name[0]?.id);
      });
      setLens(lens_ids.join(","));
    } else {
      SignUpNext?.lens_id?.map((lens) => {
        lens_ids?.push(lens?.value);
      });
      setLens(lens_ids?.join(","));
    }

    let smartphone_ids = [];
    if (userData?.smartphones) {
      userData?.smartphones?.map((smart_phone) => {
        smartphone_ids.push(smart_phone?.smartphone_name[0]?.id);
      });
      setSmartPhones(smartphone_ids.join(","));
    } else {
      SignUpNext?.smartphone_id?.map((smart_phone) => {
        smartphone_ids?.push(smart_phone?.value);
      });
      setSmartPhones(smartphone_ids?.join(","));
    }

    let specialize_item_ids = [];
    if (userData?.specialize) {
      userData?.specialize?.map((specialize_item) => {
        specialize_item_ids.push(specialize_item?.specialized_item_name[0]?.id ? specialize_item?.specialized_item_name[0]?.id : 0);
      });

      setSpecializeItem(specialize_item_ids.join(","));
    } else {
      SignUpNext?.specialize_item_id?.map((specialize_item) => {
        specialize_item_ids?.push(specialize_item?.value);
      });
      setSpecializeItem(specialize_item_ids?.join(","));
    }

    let speed_light_ids = [];
    if (userData?.speedlights) {
      userData?.speedlights?.map((speed_light) => {
        speed_light_ids.push(speed_light?.speed_light_name[0]?.id);
      });
      setSpeedLight(speed_light_ids.join(","));
    } else {
      SignUpNext?.speed_light_id?.map((speed_light) => {
        speed_light_ids?.push(speed_light?.value);
      });
      setSpeedLight(speed_light_ids?.join(","));
    }

    let strobe_ids = [];
    if (userData?.strobes) {
      userData?.strobes?.map((strobe) => {
        strobe_ids.push(strobe?.strobe_name[0]?.id);
      });
      setStrobe(strobe_ids.join(","));
    } else {
      SignUpNext?.strobe_id?.map((strobe) => {
        strobe_ids?.push(strobe?.value);
      });
      setStrobe(strobe_ids?.join(","));
    }

    let tripods_ids = [];
    if (userData?.tripods) {
      userData?.tripods?.map((tripod) => {
        tripods_ids.push(tripod?.tripod_name[0]?.id);
      });
      setTripods(tripods_ids.join(","));
    } else {
      SignUpNext?.tripod_id?.map((tripod) => {
        tripods_ids?.push(tripod?.value);
      });
      setTripods(tripods_ids?.join(","));
    }
  }, []);

  const signUpNextPrev = (e) => {
    e.preventDefault();
    history.push({
      pathname: "/sign-up-next",
      state: {
        SignUp: SignUp,
        SignUpNext: SignUpNext,
        SignUpNext2: form,
        SignUpNext3: location?.state?.SignUpNext3,
        SignUpNext4: location?.state?.SignUpNext4,
        SignUpNext5: location?.state?.SignUpNext5,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { errors, isValid } = validateSignUpNext2(form, t);
    if (isValid) {

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
      };

      profileUpdateForm = {
        ...profileUpdateForm,
        camera: camera,
        lens: lens,
        smart_phones: smartPhones,
        strobes: strobe,
        specialize: specializeItem,
        tripods: tripods,
        speedlight: speedLight,
      };

      if (form?.car_access_other) {
        profileUpdateForm = {
          ...profileUpdateForm,
          car_access_other: form?.car_access_other,
        };
      }
      profileUpdateForm = {
        ...profileUpdateForm,
        car_access: form?.car_access,
        is_updated_steps: "3",
        lang: userData?.lang,
      };

      setIsLoading(true);
      if (!isForm) {
        dispatch(
          updatePhotographer({
            profileUpdateForm,
            callback: (data) => {
              localStorage.setItem("userData", JSON.stringify(data));
              setIsLoading(false);
              history.push({
                pathname: "/sign-up-next3",
                SignUp: SignUp,
                SignUpNext: SignUpNext,
                SignUpNext2: form,
                SignUpNext3:
                  location?.state?.SignUpNext3 || location?.SignUpNext3,
                SignUpNext4:
                  location?.state?.SignUpNext4 || location?.SignUpNext4,
                SignUpNext5:
                  location?.state?.SignUpNext5 || location?.SignUpNext5,
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
                pathname: "/sign-up-next3",
                state: {
                  SignUp: SignUp,
                  SignUpNext: SignUpNext,
                  SignUpNext2: form,
                  SignUpNext3:
                    location?.state?.SignUpNext3 || location?.SignUpNext3,
                  SignUpNext4:
                    location?.state?.SignUpNext4 || location?.SignUpNext4,
                  SignUpNext5:
                    location?.state?.SignUpNext5 || location?.SignUpNext5,
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

  const changeLanguage = (event) => {
    if (event.label === "onReload") {
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

  return (
    <>
      {isLoading && <Loader />}
      <section className="signUpNext2-main">
        <div className="container">
          <div className="text-center">
            <img src={logo} className="header-logo" alt="logo" />
          </div>
          <div className="d-flex justify-content-center">
            <div className=" signUpNext2-detail animated fadeIn">
              <div className="d-flex">
                <div className="progress_line"></div>
                <div className="progress_line_white"></div>
              </div>
              <div className="d-flex align-items-baseline p-3 position-relative photo-signup-header">
                <img
                  onClick={(e) => {
                    signUpNextPrev(e);
                  }}
                  src={leftArrowIcon}
                  className=""
                  alt="logo"
                />
                <p className="text-body text-center ">
                  {t("DO_YOU_HAVE_ACCESS_TO_CAR")}
                </p>
              </div>

              <form className="pt-5" onSubmit={(e) => handleSubmit(e)}>
                <div className=" mb-5 pb-5">
                  <div className="form-group p-2 d-flex flex-column flex-sm-row align-items-baseline justify-content-center flex-wrap">
                    <div className="options py-3">
                      <label title="item1" className="px-5">
                        <input
                          type="radio"
                          name="car_access"
                          value="1"
                          onChange={(e) => {
                            changeHandler(e);
                          }}
                          checked={form?.car_access === "1"}
                        />
                        <span>
                          <img src={tickIcon} className="tick_icon" />
                        </span>
                        {t("YES")}
                      </label>
                    </div>
                    <div className="options py-3">
                      <label title="item2" className="px-5">
                        <input
                          type="radio"
                          name="car_access"
                          value="0"
                          onChange={(e) => {
                            changeHandler(e);
                          }}
                          checked={form?.car_access == "0"}
                        />
                        <span>
                          <img src={tickIcon} className="tick_icon" />
                        </span>
                        {t("NO")}
                      </label>
                    </div>
                    <div className="d-flex flex-row options py-3 pb-3">
                      <label title="item3" className="px-5">
                        <input
                          type="radio"
                          name="car_access"
                          value="2"
                          onChange={(e) => {
                            changeHandler(e);
                          }}
                          checked={form?.car_access === "2"}
                        />
                        <span>
                          <img src={tickIcon} className="tick_icon" />
                        </span>
                        {t("OTHER")}

                        {form?.car_access == "2" ? (
                          <input
                            type="text"
                            className=""
                            onChange={(e) => {
                              setForm((prevState) => ({
                                ...prevState,
                                ["car_access_other"]: e.target.value,
                              }));
                              setError((prevState) => ({
                                ...prevState,
                                ["car_access_other"]: "",
                              }));
                              setIsform(true);
                            }}
                            value={form?.car_access_other || ""}
                          />
                        ) : (
                          ""
                        )}
                      </label>
                    </div>
                    {error?.car_access && (
                      <div className="invalid text-center pt-3">
                        {error?.car_access}
                      </div>
                    )}
                    {error?.car_access_other && (
                      <div className="invalid-error text-center pt-3 ">
                        {error?.car_access_other}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center p-2 pb-5">
                  <Button
                    text={t("NEXT")}
                    type="submit"
                    className="text-uppercase w-100 signUpNext2-button"
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
