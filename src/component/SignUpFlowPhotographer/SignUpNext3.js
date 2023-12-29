import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Footer, Input, Loader } from "../CommonComponent";
import logo from "../../assets/images/logo.svg";
import leftArrowIcon from "../../assets/images/leftArrowIcon.svg";
import { getLocalStorageItem } from "../../utils/helper";
import { updatePhotographer } from "../../redux/action";

export default function SignUpNext() {
  const { i18n, t } = useTranslation();

  const [form, setForm] = useState({
    approx_hours: "",
  });

  const [category, setCategory] = useState("");
  const [camera, setCamera] = useState("");
  const [lens, setLens] = useState("");
  const [smartPhones, setSmartPhones] = useState("");
  const [specializeItem, setSpecializeItem] = useState("");
  const [speedLight, setSpeedLight] = useState("");
  const [strobe, setStrobe] = useState("");
  const [tripods, setTripods] = useState("");
  const [isForm, setIsform] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  let userData = JSON.parse(getLocalStorageItem("userData"));
  let SignUp = JSON.parse(getLocalStorageItem("SignUp"));
  let SignUpNext = JSON.parse(getLocalStorageItem("SignUpNext"));
  let SignUpNext2 = JSON.parse(getLocalStorageItem("SignUpNext2"));
  let SignUpNext3 = JSON.parse(getLocalStorageItem("SignUpNext3"));
  const ct = require('countries-and-timezones');
  const countries = ct.getAllCountries();

  useEffect(() => {
    changeLanguage({ label: "onReload", value: userData?.lang });
    if (location?.SignUpNext2 !== undefined) {
      localStorage.setItem(
        "SignUpNext2",
        JSON.stringify(location?.SignUpNext2)
      );
    }

    if (getLocalStorageItem("token") && getLocalStorageItem("userData")) {
      if (userData?.roles[0]?.id === 5) {
        if (userData?.is_profile_completed === 1) {
          history.push("/dashboard");
        } else {
          if (userData?.is_profile_completed === 0) {
            if(SignUpNext2?.car_access){
              history.push("/sign-up-next3");
            }else if(userData?.is_updated_steps === "3"){
              history.push("/sign-up-next3");
            }else{
              history.push("/sign-up-next2");
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
      approx_hours: SignUpNext3?.approx_hours || userData?.approx_hours || "",
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
    if(userData?.smartphones){
      userData?.smartphones?.map((smart_phone) => {
        smartphone_ids.push(smart_phone?.smartphone_name[0]?.id);
      });
      setSmartPhones(smartphone_ids.join(","));
    }else{
      SignUpNext?.smartphone_id?.map((smart_phone) => {
        smartphone_ids?.push(smart_phone?.value);
      });
      setSmartPhones(smartphone_ids?.join(","));
    }

    let specialize_item_ids = [];
    if(userData?.specialize){
      userData?.specialize?.map((specialize_item) => {
        specialize_item_ids.push(specialize_item?.specialized_item_name[0]?.id ? specialize_item?.specialized_item_name[0]?.id : 0);
      });
      setSpecializeItem(specialize_item_ids.join(","));
    }else{
      SignUpNext?.specialize_item_id?.map((specialize_item) => {
        specialize_item_ids?.push(specialize_item?.value);
      });
      setSpecializeItem(specialize_item_ids?.join(","));
    }

     let speed_light_ids = [];
    if(userData?.speedlights){
      userData?.speedlights?.map((speed_light) => {
        speed_light_ids.push(speed_light?.speed_light_name[0]?.id);
      });
      setSpeedLight(speed_light_ids.join(","));
    }else{
      SignUpNext?.speed_light_id?.map((speed_light) => {
        speed_light_ids?.push(speed_light?.value);
      });
      setSpeedLight(speed_light_ids?.join(","));
    }

    let strobe_ids = [];
    if(userData?.strobes){
      userData?.strobes?.map((strobe) => {
        strobe_ids.push(strobe?.strobe_name[0]?.id);
      });
      setStrobe(strobe_ids.join(","));
    }else{
      SignUpNext?.strobe_id?.map((strobe) => {
        strobe_ids?.push(strobe?.value);
      });
      setStrobe(strobe_ids?.join(","));
    }

    let tripods_ids = [];
    if(userData?.tripods){
      userData?.tripods?.map((tripod) => {
        tripods_ids.push(tripod?.tripod_name[0]?.id);
      });
      setTripods(tripods_ids.join(","));
    }else{
      SignUpNext?.tripod_id?.map((tripod) => {
        tripods_ids?.push(tripod?.value);
      });
      setTripods(tripods_ids?.join(","));
    }
  }, []);
  
  const signUpNext2Prev = (e) => {
    e.preventDefault();
    history.push({
      pathname: "/sign-up-next2",
      state: {
        SignUp: SignUp,
        SignUpNext: SignUpNext,
        SignUpNext2: SignUpNext2,
        SignUpNext3: location?.state?.SignUpNext3,
        SignUpNext5: location?.state?.SignUpNext5,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
      is_updated_steps: "4",

      camera: camera,
      lens: lens,
      smart_phones: smartPhones,
      strobes: strobe,
      specialize: specializeItem,
      tripods: tripods,
      speedlight: speedLight,
    };

    profileUpdateForm = {
      ...profileUpdateForm,
      car_access_other: SignUpNext2?.car_access_other || userData?.car_access_other,
    };

    profileUpdateForm = {
      ...profileUpdateForm,
      car_access: SignUpNext2?.car_access || userData?.car_access,
      approx_hours: form?.approx_hours || 0,
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
              pathname: "/sign-up-next5",
              state: {
                SignUp: SignUp,
                SignUpNext: SignUpNext,
                SignUpNext2: SignUpNext2,
                SignUpNext3: form,
                SignUpNext5:
                  location?.state?.SignUpNext5 || location?.SignUpNext5,
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
              pathname: "/sign-up-next5",
              state: {
                SignUp: SignUp,
                SignUpNext: SignUpNext,
                SignUpNext2: SignUpNext2,
                SignUpNext3: form,
                SignUpNext5:
                  location?.state?.SignUpNext5 || location?.SignUpNext5,
              },
            });
          },
        })
      );
    }
  };

  const allowNumberOnly = (event) => {
    let charCode = event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      event.target.value = event.target.value.replace(/[^0-9]/g, "");
    } else {
      event.target.value = event.target.value.replace(/[^0-9]/g, "");
    }
    setForm((prevState) => ({
      ...prevState,
      ["approx_hours"]: event.target.value,
    }));
  };

  const changeLanguage = (event) => {
    if (event.label === "onReload") {
      i18n.changeLanguage(event.value);
    }
  };

  const changeHandler = (e, name) => {
    if (e.target) {
      const value = e.target.value;
      const { name } = e.target;
      setForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      const { value } = e;
      setForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <section className="signUpNext3-main ">
        <div className="container">
          <div className="text-center">
            <img src={logo} className="header-logo" alt="logo" />
          </div>
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 signUpNext3-detail flex-wrap animated fadeIn">
              <div className="progress_line"></div>
              <div className="progress_line_white"></div>
              <div className="w-100 position-relative photo-signup-header">
                <img
                  onClick={(e) => {
                    signUpNext2Prev(e);
                  }}
                  src={leftArrowIcon}
                  className=""
                  alt="logo"
                />

                <p className="text-body my-2 ">
                  {t("APPROXIMATELY_HOW_MANY_HOURS")}
                </p>
                <span></span>
              </div>
              <form className="mx-xl-5" onSubmit={(e) => handleSubmit(e)}>
                <div className="row justify-content-center">
                  <div className="col-12 col-sm-10 col-md-">
                    <div className="form-group mb-4">
                      <Input
                        type="text"
                        onKeyUp={(e) => allowNumberOnly(e)}
                        className="h-25 signUpNext3-input-field"
                        name="approx_hours"
                        value={form?.approx_hours || ""}
                        onChange={(e) => {
                          changeHandler(e);
                          setIsform(true);
                        }}
                        maxLength="100"
                      />
                      <div className="left-align-optional">
                        <p className="mt-2 optional-text">
                          *{t("OPTIONAL_TEXT_FIELD")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center button_set pb-5">
                  <Button
                    text={t("NEXT")}
                    type="submit"
                    className="text-uppercase mt-3 w-100 signUpNext3-button"
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
