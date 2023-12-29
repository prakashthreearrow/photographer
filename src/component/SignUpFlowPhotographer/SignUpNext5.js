import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Footer, Loader } from "../CommonComponent";
import logo from "../../assets/images/logo.svg";
import leftArrowIcon from "../../assets/images/leftArrowIcon.svg";
import validateSignUpNext5 from "../../validation/SignUpFlowPhotographer/SignUpNext5";
import { updatePhotographer } from "../../redux/action";
import { getLocalStorageItem, removeLocalStorageItem } from "../../utils/helper";

export default function SignUpNext() {
  const { i18n, t } = useTranslation();

  const [form, setForm] = useState({
    maximum_commuting_id: "",
    maximum_commuting_other: "",
  });

  const [category, setCategory] = useState("");
  const [camera, setCamera] = useState([]);
  const [lens, setLens] = useState([]);
  const [smart_phones, setSmart_phones] = useState([]);
  const [strobes, setStrobes] = useState([]);
  const [specialize, setSpecialize] = useState([]);
  const [tripods, setTripods] = useState([]);
  const [speedlight, setSpeedlight] = useState([]);
  const [onClickButtonToggle, setOnClickButtonToggle] = useState(false);

  const [error, setError] = useState({});
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
    changeLanguage({ label: 'onReload', value: userData?.lang });

    if (location?.state !== undefined) {
      localStorage.setItem("SignUpNext3", JSON.stringify(location?.state?.SignUpNext3));
    }

    if (getLocalStorageItem("token") && getLocalStorageItem("userData")) {
      if (userData?.roles[0]?.id === 5) {
        if (userData?.is_profile_completed === 1) {
          history.push("/dashboard");
        } else {
          if (SignUpNext2?.car_access) {
            history.push("/sign-up-next5");
          } else if (userData?.is_updated_steps === "4") {
            history.push("/sign-up-next5");
          } else {
            history.push("/sign-up-next3");
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
      maximum_commuting_id: form?.maximum_commuting_id || location?.state?.SignUpNext5?.maximum_commuting_id || location?.SignUpNext5?.maximum_commuting_id || "",
      maximum_commuting_other: form?.maximum_commuting_other || location?.state?.SignUpNext5?.maximum_commuting_other || location?.SignUpNext5?.maximum_commuting_other || "",
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
      setSmart_phones(smartphone_ids.join(","));
    } else {
      SignUpNext?.smartphone_id?.map((smart_phone) => {
        smartphone_ids?.push(smart_phone?.value);
      });
      setSmart_phones(smartphone_ids?.join(","));
    }

    let specialize_item_ids = [];
    if (userData?.specialize) {
      userData?.specialize?.map((specialize_item) => {
        specialize_item_ids.push(specialize_item?.specialized_item_name[0]?.id ? specialize_item?.specialized_item_name[0]?.id : 0);
      });
      setSpecialize(specialize_item_ids.join(","));
    } else {
      SignUpNext?.specialize_item_id?.map((specialize_item) => {
        specialize_item_ids?.push(specialize_item?.value);
      });
      setSpecialize(specialize_item_ids?.join(","));
    }

    let speed_light_ids = [];
    if (userData?.speedlights) {
      userData?.speedlights?.map((speed_light) => {
        speed_light_ids.push(speed_light?.speed_light_name[0]?.id);
      });
      setSpeedlight(speed_light_ids.join(","));
    } else {
      SignUpNext?.speed_light_id?.map((speed_light) => {
        speed_light_ids?.push(speed_light?.value);
      });
      setSpeedlight(speed_light_ids?.join(","));
    }

    let strobe_ids = [];
    if (userData?.strobes) {
      userData?.strobes?.map((strobe) => {
        strobe_ids.push(strobe?.strobe_name[0]?.id);
      });
      setStrobes(strobe_ids.join(","));
    } else {
      SignUpNext?.strobe_id?.map((strobe) => {
        strobe_ids?.push(strobe?.value);
      });
      setStrobes(strobe_ids?.join(","));
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

  const signUpNext4Prev = (e) => {
    e.preventDefault();

    history.push({
      pathname: '/sign-up-next3',
      state: {
        SignUp: SignUp, SignUpNext: SignUpNext, SignUpNext2: SignUpNext2,
        SignUpNext3: SignUpNext3, SignUpNext5: form
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { errors, isValid } = validateSignUpNext5(form, t);
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

      setOnClickButtonToggle(true);
      let profileUpdateForm = {
        id: userData?.id,
        first_name: SignUp?.first_name || userData?.first_name,
        last_name: SignUp?.last_name || userData?.last_name,
        work_email: SignUp?.work_email || userData?.work_email,
        email: SignUp?.email || userData?.email,
        location: SignUp?.location || userData?.location,
        country_id: SignUp ? SignUp?.country_id?.value : country,
        time_zone: SignUp ? SignUp?.time_zone?.value : timeZoneSelected,
        mobile: SignUp?.mobile || userData?.mobile,
        is_confirmed: SignUp?.confirm === true ? 1 : 0 || userData?.is_confirmed || "",
        car_access: SignUpNext2?.car_access || userData?.car_access,
        month_1: 0,
        month_2: 0,
        month_3: 0,
        maximum_commuting_id: form?.maximum_commuting_id,
        category: category,
        camera: camera,
        lens: lens,
        smart_phones: smart_phones,
        strobes: strobes,
        specialize: specialize,
        tripods: tripods,
        speedlight: speedlight,
        is_updated_steps: "5",
        approx_hours: SignUpNext3?.approx_hours || userData?.approx_hours || 0,
        lang: userData?.lang
      };

      setIsLoading(true);

      if (SignUpNext2?.car_access === "2" || userData?.car_access === "2") {
        profileUpdateForm = {
          ...profileUpdateForm,
          car_access_other: SignUpNext2?.car_access_other || userData?.car_access_other
        }
      }
      if (form?.maximum_commuting_id === "5" || location?.state?.SignUpNext5?.maximum_commuting_id === "5" || location?.SignUpNext5?.maximum_commuting_id === "5") {
        profileUpdateForm = {
          ...profileUpdateForm,
          maximum_commuting_other: form?.maximum_commuting_other || location?.state?.SignUpNext5?.maximum_commuting_other || location?.SignUpNext5?.maximum_commuting_other
        }
      }

      dispatch(
        updatePhotographer({
          profileUpdateForm,
          callback: () => {
            removeLocalStorageItem("SignUp");
            removeLocalStorageItem("SignUpNext");

            removeLocalStorageItem("SignUpNext3");
            setIsLoading(false);
            history.push("/sign-up-next6");
          },
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

  return (
    <>
      {isLoading && <Loader />}
      <section className="signUpNext5-main ">
        <div className='container'>
          <div className='text-center'>
            <img src={logo} className="header-logo" alt="logo" />
          </div>
          <div className="row justify-content-center" >
            <div className="col-12 col-md-7 col-sm-12py-5 signUpNext5-detail animated fadeIn">
              <div className='progress_line'></div>
              <div className="d-flex justify position-relative photo-signup-header">
                <img onClick={(e) => { signUpNext4Prev(e) }} src={leftArrowIcon} className="mx-auto" alt="logo" />
                <p className="text-body my-2">{t("WHAT_IS_THE_THE_MAXIMUM_COMMUTING")}</p>
              </div>
              <form className="mx-xl-10 w-100" onSubmit={(e) => handleSubmit(e)}>
                <div className="row set_width mx-auto ">
                  <div className="col-12 col-sm-6">
                    <div className="form-group row">
                      <div className='d-flex flex-row-reverse justify-content-end mb-3'>
                        <input id="test12" onChange={(e) => { changeHandler(e) }} type="radio" name="maximum_commuting_id" value="1" checked={form?.maximum_commuting_id === "1"} />
                        {t("UP_TO_THIRTY_MINUTES")}
                        <label htmlFor="test12" title="item1" className="me-2 d-flex align-items-center">
                        </label>
                      </div>
                      <div className='d-flex flex-row-reverse justify-content-end mb-3'>
                        <input id="test13" onChange={(e) => { changeHandler(e) }} type="radio" name="maximum_commuting_id" value="2" checked={form?.maximum_commuting_id === "2"} />
                        {t("UP_TO_SIXTHY_MINUTES")}
                        <label htmlFor="test13" title="item1" className="me-2 d-flex align-items-center">
                        </label>
                      </div>
                      <div className='d-flex flex-row-reverse justify-content-end mb-3'>
                        <input id="test14" onChange={(e) => { changeHandler(e) }} type="radio" name="maximum_commuting_id" value="3" checked={form?.maximum_commuting_id === "3"} />
                        {t("UP_TO_ONE_TWENTY_MINUTES")}
                        <label htmlFor="test14" title="item1" className="me-2 d-flex align-items-center">
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="form-group row">

                      <div className='d-flex flex-row-reverse justify-content-end mb-3'>
                        <input id="test15" onChange={(e) => { changeHandler(e) }} type="radio" name="maximum_commuting_id" value="4" checked={form?.maximum_commuting_id === "4"} />
                        {t("I_AM_RATHER_FLEXIBLE")}
                        <label htmlFor="test15" title="item1" className="me-2 d-flex align-items-center">
                        </label>
                      </div>
                      <div className='d-flex flex-row-reverse justify-content-end mb-3' >
                        <input id="test16" onChange={(e) => { changeHandler(e) }} type="radio" name="maximum_commuting_id" value="5" checked={form?.maximum_commuting_id === "5"} />
                        {t("OTHER")}
                        <label htmlFor="test16" title="item1" className="me-2 d-flex align-items-center">
                        </label>
                      </div>
                      {form?.maximum_commuting_id === '5' ? <label title="item3" className="">
                        <input onChange={(e) => {
                          setForm((prevState) => ({
                            ...prevState,
                            ['maximum_commuting_other']: e.target.value,
                          }))
                          setError((prevState) => ({
                            ...prevState,
                            ['maximum_commuting_other']: "",
                          }))

                        }} className='align-middle margin-btm-10 next5-input' type="text" name="maximum_commuting_other" id='timing6' />
                      </label> : ""}

                    </div>
                    <div className='set_width mx-auto'>
                      {error?.maximum_commuting_id && <div className="invalid">{error?.maximum_commuting_id}</div>}
                      {error?.maximum_commuting_other && <div className="invalid">{error?.maximum_commuting_other}</div>}
                    </div>
                  </div>
                </div>

                <div className="text-center mt-5">
                  <Button disabled={onClickButtonToggle} text={t("DONE")} type="submit" className={`${onClickButtonToggle ? "disable-btn-one" : ""} mt-1 signUpNext5-button text-uppercase`} />
                </div>
              </form>
            </div>
          </div>
        </div>
        <Footer headerDesign={true} />
      </section>
    </>
  );
};