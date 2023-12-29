import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Input,
  OptionsOutsideSelect,
  Footer,
  Loader,
  InputNumberCountryCodeCountryFlagDropDown,
  SelectDropDown
} from "../CommonComponent";
import validateSignUp from "../../validation/SignUpFlowPhotographer/signUp";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
} from "../../utils/helper";
import logo from "../../assets/images/logo.svg";
import leftArrowIcon from "../../assets/images/leftArrowIcon.svg";
import {
  categoryType,
  logoutUser,
  updatePhotographer,
} from "../../redux/action";

const SignUp = () => {
  const { i18n, t } = useTranslation();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    location: "",
    country_id: [],
    time_zone: [],
    mobile: "",
    default_country: "CL",
    work_email: "",
    confirm: false,
  });

  const ct = require('countries-and-timezones');
  const countries = ct.getAllCountries();
  let userData = JSON.parse(getLocalStorageItem("userData"));
  let SignUp = JSON.parse(getLocalStorageItem("SignUp"));

  const [error, setError] = useState({});
  const [categoryArray, setCategoryArray] = useState([]);
  const [countryArray, setCountryArray] = useState([]);
  const [timeZoneArray, setTimeZoneArray] = useState([]);
  const [isForm, setIsform] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

  const category_type = useSelector(
    (state) => state?.CategoryType?.categoryArray
  );

  const category_loader = useSelector((state) => state?.CategoryType?.loading);

  const loading = useSelector((state) => state?.Login?.loading);
  const logoutLoading = useSelector((state) => state?.Logout?.loading);

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
    changeLanguage({ label: "onReload", value: userData?.lang });

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
      }
    } else {
      history.push("/");
    }
  }, []);

  useEffect(() => {
    let country = {};
    let timeZoneSelected = {};
    if (userData || SignUp) {
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

      setForm((prevState) => ({
        ...prevState,
        first_name: SignUp?.first_name || userData?.first_name || "",
        last_name: SignUp?.last_name || userData?.last_name || "",
        email: SignUp?.email || userData?.email || "",
        location: SignUp?.location || userData?.location || "",
        country_id: SignUp ? SignUp?.country_id?.value : country,
        time_zone: SignUp ? SignUp?.time_zone?.value : timeZoneSelected,
        mobile: SignUp?.mobile || userData?.mobile || "",
        defaultCountry: SignUp?.defaultCountry || "",
        work_email: SignUp?.work_email || userData?.work_email || "",
        confirm:
          SignUp?.confirm || userData?.is_confirmed === 1 ? true : false || "",
      }));
    }
  }, [location?.state?.SignUp, location?.SignUp]);

  // admin added category
  useEffect(() => {
    if (userData?.categories) {
      let data = userData?.categories.map((itm) => ({
        label: `${itm?.category_name[0]?.name}`,
        value: `${itm?.category_name[0]?.id}`,
      }));

      setForm((prevState) => ({
        ...prevState,
        ["category_id"]: data,
      }));
    }
  }, []);

  // location category
  useEffect(() => {
    if (SignUp?.category_id) {
      let data = SignUp?.category_id.map((itm) => ({
        label: `${itm.label}`,
        value: `${itm.value}`,
      }));
      setForm((prevState) => ({
        ...prevState,
        ["category_id"]: data,
      }));
    }
  }, [location?.state?.SignUp?.category_id]);

  //category type
  useEffect(() => {
    if (category_type?.category?.length > 0) {
      let data = category_type?.category
        .filter(
          (category) =>
            category?.available_to_photographer === 1 ||
            category?.available_to_photographers === 1
        )
        .map((itm) => ({
          label: `${itm.name}`,
          value: `${itm.id}`,
        }));
      setCategoryArray(data);
    } else {
      dispatch(categoryType());
    }
  }, [category_type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    const { errors, isValid } = validateSignUp(form, t);

    let categories_ids = [];
    form?.category_id?.map((category) => {
      categories_ids.push(category.value);
    });
    let categoryIds = categories_ids.join(",");

    if (isValid) {
      setIsLoading(true);
      let profileUpdateForm = {
        id: userData?.id,
        first_name: form?.first_name || userData?.first_name || "",
        last_name: form.last_name || userData?.last_name || "",
        email: form?.email || userData?.email || "",
        location: form?.location || userData?.location || "",
        country_id: form?.country_id?.value,
        time_zone: form?.time_zone?.value,
        mobile: form?.mobile || userData?.mobile || "",
        work_email: form?.work_email || userData?.work_email || "",
        category: categoryIds,
        is_updated_steps: "1",
        is_confirmed:
          form?.confirm === true ? 1 : 0 || userData?.is_confirmed || "",
        lang: userData?.lang,
      };

      if (!isForm) {
        dispatch(
          updatePhotographer({
            profileUpdateForm,
            callback: (data) => {
              localStorage.setItem("userData", JSON.stringify(data));
              setIsLoading(false);
              history.push({
                pathname: "/sign-up-next",
                state: {
                  SignUp: form || location?.SignUp,
                  SignUpNext:
                    location?.state?.SignUpNext || location?.SignUpNext,
                  SignUpNext2:
                    location?.state?.SignUpNext2 || location?.SignUpNext2,
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
      } else {
        dispatch(
          updatePhotographer({
            profileUpdateForm,
            callback: (data) => {
              localStorage.setItem("userData", JSON.stringify(data));
              setIsLoading(false);
              history.push({
                pathname: "/sign-up-next",
                state: {
                  SignUp: form,
                  SignUpNext:
                    location?.state?.SignUpNext || location?.SignUpNext,
                  SignUpNext2:
                    location?.state?.SignUpNext2 || location?.SignUpNext2,
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

  const changeHandler = (e, name) => {
    setIsform(true);
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

  const changeLanguage = (event) => {
    if (event.label === "onReload") {
      i18n.changeLanguage(event.value);
    }
  };

  const logout = (e) => {
    e.preventDefault();
    dispatch(
      logoutUser({
        callback: () => {
          removeLocalStorageItem("downloadLink");
          removeLocalStorageItem("userData");
          removeLocalStorageItem("token");
          removeLocalStorageItem("userId");

          removeLocalStorageItem("SignUp");
          removeLocalStorageItem("SignUpNext");
          removeLocalStorageItem("SignUpNext2");
          removeLocalStorageItem("SignUpNext3");
          history.push("/");
        },
      })
    );
  };

  return (
    <>
      {isLoading && <Loader />}
      {loading && <Loader />}
      {logoutLoading && <Loader />}
      <section className="signUp-main">
        <div className="container">
          <div className="logo-center">
            <img src={logo} className="mx-auto signup_header_logo" alt="logo" />
          </div>
          <div className="signUp-inner">
            <div className="signUp-detail py-4 animated fadeIn signUp-client-detail">
              <div className="signUp-detail-inner">
                <div className="d-flex align-items-baseline photo-signup-header">
                  <img
                    onClick={(e) => {
                      logout(e);
                    }}
                    src={leftArrowIcon}
                    className="sm:ps-5 arrow arrow-left"
                    alt="logo"
                  />
                  <p className="text-body my-2">
                    {t("LETS_GET_TO_KNOW_YOU_FIRST")}
                  </p>
                </div>
                <form
                  className="signuppage-form"
                  onSubmit={(e) => handleSubmit(e)}
                >
                  <div className="form-group fg-mb">
                    <Input
                      type="text"
                      className=""
                      name="first_name"
                      value={
                        form?.first_name || ""
                      }
                      onChange={(e) => {
                        changeHandler(e);
                      }}
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
                      value={
                        form?.last_name || ""
                      }
                      onChange={(e) => {
                        changeHandler(e);
                      }}
                      error={error?.last_name}
                      maxLength="100"
                      label={t("LAST_NAME")}
                    />
                  </div>
                  <div className="form-group fg-mb">
                    <Input
                      name="email"
                      value={
                        form?.email || ""
                      }
                      onChange={(e) => {
                        changeHandler(e);
                      }}
                      type="email"
                      error={error?.email}
                      label={t("EMAIL")}
                    />
                  </div>
                  <div className="form-group fg-mb">
                    <Input
                      name="location"
                      value={
                        form?.location || ""
                      }
                      onChange={(e) => {
                        changeHandler(e);
                      }}
                      type="text"
                      error={error?.location}
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
                  <div className="form-group fg-mb custo-m">
                    <InputNumberCountryCodeCountryFlagDropDown
                      name="mobile"
                      onChange={(value) => {
                        setForm((prevState) => ({
                          ...prevState,
                          ["mobile"]: value,
                        }));

                        setError((prevState) => ({
                          ...prevState,
                          ["mobile"]: "",
                        }));
                        setIsform(true);
                      }}
                      value={
                        form?.mobile || ""
                      }
                      error={error?.mobile}
                      label={t("PHONE_NUMBER")}
                    />
                  </div>
                  <div className="form-group fg-mb">
                    <Input
                      name="work_email"
                      value={
                        form?.work_email || ""
                      }
                      onChange={(e) => {
                        changeHandler(e);
                      }}
                      type="text"
                      error={error?.work_email}
                      label={t("LINK_TO_YOUR_WORK")}
                    />
                  </div>
                  <div className="form-group signup-form-category fg-mb text-size  rounded-0">
                    <OptionsOutsideSelect
                      className="temp-custom-class rounded-0"
                      onChange={(value) => {
                        setForm((prevState) => ({
                          ...prevState,
                          ["category_id"]: value,
                        }));
                        setError((prevState) => ({
                          ...prevState,
                          ["category_id"]: "",
                        }));
                        setIsform(true);
                      }}
                      isMulti
                      options={categoryArray}
                      value={form?.category_id || []}
                      error={error?.category_id}
                      placeholder={t("CATEGORY_LIST")}
                      isLoading={category_loader}
                    />
                  </div>
                  <div className="form-group d-flex text-white position-relative error-position privacy-check mb-4">
                    <div className="d-flex">
                      <div className="round me-3">
                        <input
                          name="confirm"
                          onChange={(e) => {
                            changeHandler(e);
                            setIsform(true);
                          }}
                          checked={form?.confirm || false}
                          type="checkbox"
                          id="checkbox"
                        />

                        <label htmlFor="checkbox"></label>
                      </div>
                    </div>
                    <p className="pb-0">
                      {t("CONFIRM_THAT_YOU_ARE_LEGALLY_ALLOWED")}
                    </p>
                    {error && <div className="invalid">{error?.confirm}</div>}
                  </div>
                  <div className="text-center signup-btn-container">
                    <Button
                      text={t("NEXT")}
                      type="submit"
                      className="text-uppercase w-100 signUp-btn"
                    />
                  </div>
                </form>
              </div>
            </div>
            <Footer headerDesign={true} />
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
