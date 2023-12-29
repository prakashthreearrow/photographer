import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { gapi } from "gapi-script";
import { toast } from "react-toastify";
import { useHistory, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Input,
  Footer,
  Loader,
  SelectDropDown,
} from "../component/CommonComponent";
import logo from "../assets/images/logo1.png";
import googleIcon from "../assets/images/google-icon.svg";
import { ErrorToast } from "../utils/helper";
import linkedinIcon from "../assets/images/linkedin-icon.svg";
import instagramIcon from "../assets/images/intagram-icon.svg";
import validateRegister from "../validation/register";
import { GoogleLogin } from "react-google-login";
import { getLocalStorageItem, removeLocalStorageItem } from "../utils/helper";
import {
  photographerRegister,
  googleLoginUser,
  linkedinAccessTokenLoginUser,
  linkedinGetProfileUser,
  instagramAccessTokenUser,
  instagramGetProfileUser,
  clientRegister,
} from "../redux/action";
import { GOOGLE_CLIENT_ID } from "../utils/constants";
import $ from "jquery";
import client_right_image from "../assets/images/creative-img.jpeg";
import client_left_image from "../assets/images/login-bg-left.jpg";

const Register = () => {
  const { i18n, t } = useTranslation();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const DOCUMENT_TYPE = [
    { label: t("PHOTOGRAPHER"), value: "5" },
    { label: t("EDITOR"), value: "6" },
  ];

  const LANGUAGE_OPTIONS = [
    {
      label: t("SPANISH"),
      value: "es",
    },
    {
      label: "English",
      value: "en",
    },
  ];
  const location = useLocation();

  const params = new URLSearchParams(window.location.search);
  const user_access_token = params.get("code");
  let userData = JSON.parse(getLocalStorageItem("userData"));
  let activeToggleLeft = location?.loginToggleLeft === false ? false : true;
  let activeToggleRight = location?.loginToggleRight === true ? true : false;

  const [error, setError] = useState({});
  const [loginToggleLeft, setLoginToggleLeft] = useState(activeToggleLeft);
  const [loginToggleRight, setLoginToggleRight] = useState(activeToggleRight);
  const [toolTipData, setToolTipData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [onClickButtonToggle, setOnClickButtonToggle] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();

  const registerLoading = useSelector(
    (state) => state?.PhotographerRegiste?.loading
  );

  const [langSelected, setLangSelected] = useState("");
  const [changeLang, setChangeLang] = useState("en");
  const [roleSelected, setRoleSelected] = useState("");
  const [role, setRole] = useState("5");

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: GOOGLE_CLIENT_ID,
        scope: "email",
        plugin_name: "chat",
      });
    }
    gapi.load("client:auth2", start);
  }, []);

  useEffect(() => {
    setOnClickButtonToggle(false);
    const languageSelected = LANGUAGE_OPTIONS?.find(
      (element) => element?.value === changeLang
    );
    setLangSelected({
      label: changeLang === "en" ? "English" : "Española",
      value: languageSelected.value,
    });
    changeLanguage({ label: "onReload", value: languageSelected?.value });
  }, [changeLang]);

  useEffect(() => {
    if (roleSelected.value === "5") {
      setRoleSelected({
        label: changeLang === "en" ? "Photographer" : "Fotógrafo",
        value: roleSelected.value,
      });
    } else {
      setRoleSelected({
        label: changeLang === "en" ? "Editor" : "Editor",
        value: roleSelected.value,
      });
    }
  }, [changeLang]);

  useEffect(() => {
    let code = user_access_token;
    let social = getLocalStorageItem("social");
    if (code !== null) {
      // linkedin login
      if (social === 1 || social === "1") {
        removeLocalStorageItem("social");
        dispatch(
          linkedinAccessTokenLoginUser({
            code,
            callback: (access_token) => {
              if (access_token) {
                dispatch(
                  linkedinGetProfileUser({
                    access_token,
                    callback: (data) => {
                      if (data) {
                        if (data?.data?.user?.is_profile_completed === 1) {
                          localStorage.setItem(
                            "userData",
                            JSON.stringify(data?.data?.user)
                          );
                          localStorage.setItem(
                            "userId",
                            JSON.stringify(data?.data?.user?.id)
                          );
                          localStorage.setItem(
                            "token",
                            data?.data?.token
                          );
                          history.push("/dashboard");
                        } else if (
                          data?.data?.user?.is_profile_completed === 0
                        ) {
                          localStorage.setItem(
                            "userData",
                            JSON.stringify(data?.data?.user)
                          );
                          localStorage.setItem(
                            "userId",
                            JSON.stringify(data?.data?.user?.id)
                          );
                          localStorage.setItem(
                            "token",
                            data?.data?.token
                          );
                          if (data?.data?.user?.is_updated_steps === "1") {
                            history.push("/sign-up-next");
                          } else if (
                            data?.data?.user?.is_updated_steps === "2"
                          ) {
                            history.push("/sign-up-next2");
                          } else if (
                            data?.data?.user?.is_updated_steps === "3"
                          ) {
                            history.push("/sign-up-next3");
                          } else if (
                            data?.data?.user?.is_updated_steps === "4"
                          ) {
                            history.push("/sign-up-next5");
                          } else if (
                            data?.data?.user?.is_updated_steps === "0"
                          ) {
                            history.push("/sign-up");
                          }
                        } else {
                          history.push("/");
                        }
                      }
                    },
                  })
                );
              }
            },
          })
        );
      } else if (social === 2 || social === "2") {
        removeLocalStorageItem("social");
        // instagram login
        dispatch(
          instagramAccessTokenUser({
            code,
            callback: (access_token) => {
              if (access_token) {
                dispatch(
                  instagramGetProfileUser({
                    access_token,
                    callback: (data) => {
                      if (data) {
                        if (data?.data?.user?.is_profile_completed === 1) {
                          localStorage.setItem(
                            "userData",
                            JSON.stringify(data?.data?.user)
                          );
                          localStorage.setItem(
                            "userId",
                            JSON.stringify(data?.data?.user?.id)
                          );
                          localStorage.setItem(
                            "token",
                            data?.data?.token
                          );
                          history.push("/dashboard");
                        } else if (
                          data?.data?.user?.is_profile_completed === 0
                        ) {
                          localStorage.setItem(
                            "userData",
                            JSON.stringify(data?.data?.user)
                          );
                          localStorage.setItem(
                            "userId",
                            JSON.stringify(data?.data?.user?.id)
                          );
                          localStorage.setItem(
                            "token",
                            data?.data?.token
                          );
                          if (data?.data?.user?.is_updated_steps === "1") {
                            history.push("/sign-up-next");
                          } else if (
                            data?.data?.user?.is_updated_steps === "2"
                          ) {
                            history.push("/sign-up-next2");
                          } else if (
                            data?.data?.user?.is_updated_steps === "3"
                          ) {
                            history.push("/sign-up-next3");
                          } else if (
                            data?.data?.user?.is_updated_steps === "4"
                          ) {
                            history.push("/sign-up-next5");
                          } else if (
                            data?.data?.user?.is_updated_steps === "0"
                          ) {
                            history.push("/sign-up");
                          }
                        } else {
                          history.push("/");
                        }
                      }
                    },
                  })
                );
              }
            },
          })
        );
      }
    }
  }, [user_access_token]);

  useEffect(() => {
    if (location?.roles === "5") {
      setRoleSelected({ label: "Photographer", value: "5" });
    } else if (location?.roles === "6") {
      setRoleSelected({ label: "Editor", value: "6" });
    } else {
      setRoleSelected({ label: "Photographer", value: "5" });
    }

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
          } else if (userData?.is_updated_steps === "0") {
            history.push("/sign-up");
          }else{
            history.push("/register");
          }
        }
      } else if (userData?.roles[0]?.id === 7) {
        if (userData?.is_profile_completed === 1) {
          history.push("/client-dashboard");
        } else {
          history.push("/sign-up-client");
        }
      }
    }

    setLoading(true);
    var timer = setTimeout(() => {
      setLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const LoginToggleLeft = (e) => {
    e.preventDefault();
    setToolTipData(null);
    setLoginToggleLeft(false);
    setLoginToggleRight(true);
  };

  const LoginToggleRight = (e) => {
    e.preventDefault();
    setToolTipData(null);
    setLoginToggleLeft(true);
    setLoginToggleRight(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    const { errors, isValid } = validateRegister(form, loginToggleLeft, t);

    if (isValid) {
      setOnClickButtonToggle(true);
      var profileForm = {
        email: form?.email,
        password: form?.password,
        lang: changeLang,
      };

      if (parseInt(role) > 0 && loginToggleLeft === true) {
        removeLocalStorageItem("userData");
        removeLocalStorageItem("token");
        profileForm.role = roleSelected?.value;
        dispatch(
          photographerRegister({
            profileForm,
            callback: (data) => {
              if (data) {
                setOnClickButtonToggle(false);
                if (data.length !== undefined) {
                  setToolTipData(data);
                }
                if (data?.roles[0]?.id === 5) {
                  if (data?.is_profile_completed === 0) {
                    if (data?.is_updated_steps === "1") {
                      history.push("/sign-up-next");
                    } else if (data?.is_updated_steps === "2") {
                      history.push("/sign-up-next2");
                    } else if (data?.is_updated_steps === "3") {
                      history.push("/sign-up-next3");
                    } else if (data?.is_updated_steps === "4") {
                      history.push("/sign-up-next5");
                    } else if (data?.is_updated_steps === "0") {
                      history.push("/sign-up");
                    }
                  }
                } else {
                  if (userData?.is_profile_completed === 1) {
                    history.push("/editor-dashboard");
                  } else {
                    history.push("/sign-up-editor");
                  }
                }
              }
            },
          })
        );
      } else {
        dispatch(
          clientRegister({
            profileForm,
            callback: (data) => {
              setOnClickButtonToggle(false);
              if (data.length !== undefined) {
                setToolTipData(data);
              }
              if (data?.roles[0]?.id === 7) {
                if (data?.is_profile_completed === 0) {
                  history.push("/sign-up-client");
                }
              }
            },
          })
        );
      }
    } else {
      setError(errors);
    }
  };

  const changeHandler = (e, name) => {
    setToolTipData(null);
    setOnClickButtonToggle(false);
    if (Array.isArray(e)) {
      setForm((prevState) => ({
        ...prevState,
        ["role"]: Array.isArray(e) ? e.map((x) => x.value) : [],
      }));
      setError((prevState) => ({
        ...prevState,
        ["role"]: "",
      }));
    } else {
      if (e.target) {
        const { name, value } = e.target;
        setError((prevState) => ({
          ...prevState,
          [name]: "",
        }));
        setForm((prevState) => ({ ...prevState, [name]: value }));
      } else {
        const { value } = e;
        setError((prevState) => ({
          ...prevState,
          [name]: "",
        }));
        setForm((prevState) => ({ ...prevState, [name]: value }));
      }
    }
  };

  const responseGoogle = (response) => {
    if (response?.error === "idpiframe_initialization_failed") {
      toast.error(
        <ErrorToast msg="Please make sure that 3rd party cookies have not been blocked." />
      );
    }
    if (response?.accessToken) {
      setLoading(true);
      let user_data = response?.profileObj;
      let googleForm = {
        name: user_data?.name,
        givenName: user_data?.givenName,
        familyName: user_data?.familyName,
        imageUrl: user_data?.imageUrl,
        email: user_data?.email,
        googleId: user_data?.googleId,
      };
      dispatch(
        googleLoginUser({
          googleForm,
          callback: (data) => {
            if (data) {
              setLoading(false);
              if (data?.is_profile_completed === 1) {
                history.push("/dashboard");
              } else if (data?.is_profile_completed === 0) {
                if (data?.is_updated_steps === "1") {
                  history.push("/sign-up-next");
                } else if (data?.is_updated_steps === "2") {
                  history.push("/sign-up-next2");
                } else if (data?.is_updated_steps === "3") {
                  history.push("/sign-up-next3");
                } else if (data?.is_updated_steps === "4") {
                  history.push("/sign-up-next5");
                } else if (data?.is_updated_steps === "0") {
                  history.push("/sign-up");
                }
              } else {
                history.push("/");
              }
            }
          },
        })
      );
    }
  };

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.value);
    setChangeLang(event.value);
  };

  $(document).ready(function () {
    $(document).on("click", ".social-login", function () {
      var data_id = $(this).attr("data-id");
      localStorage.setItem("social", data_id);
    });

    $(".toggle-button-left , .toggle-button-right").click(function () {
      clearTimeout(left);
      $(".creative-right-img").addClass("fade-in");
      var left = setTimeout(function () {
        $(".creative-right-img").removeClass("fade-in");
      }, 400);
    });

    $(".toggle-button-left , .toggle-button-left").click(function () {
      clearTimeout(right);
      $(".creative-left-img").addClass("fade-in");
      var right = setTimeout(function () {
        $(".creative-left-img").removeClass("fade-in");
      }, 400);
    });
  });

  return (
    <>
      {loading && <Loader />}
      {registerLoading && <Loader />}
      <section
        className={`${
          loginToggleLeft === true
            ? "login-main-right-bg "
            : loginToggleRight === true
            ? "login-main-left-bg fade-in"
            : ""
        } login_animation`}
      >
        <div className="container">
          <div className="header-logo">
            <img src={logo} className="mx-auto login_header_logo" alt="logo" />
          </div>
          <div className="row login-box">
            <div className="col-12 col-lg-6 main-login-section over-y">
              <div className="login-detail s-top">
                <div className="d-block client-creative-toggler text-center">
                  <p className="text-body form-pages-title my-2">
                    {t("SIGN_UP_TITLE")}
                  </p>
                  <div className="d-flex justify-content-center">
                    <button
                      onClick={(e) => {
                        LoginToggleLeft(e);
                        setOnClickButtonToggle(false);
                      }}
                      className="toggle-button-left text-uppercase"
                    >
                      {t("I_AM_A_CLIENT")}
                    </button>
                    <button
                      onClick={(e) => {
                        LoginToggleRight(e);
                        setOnClickButtonToggle(false);
                      }}
                      className="toggle-button-right text-uppercase"
                    >
                      {t("I_AM_A_CREATIVE")}
                    </button>
                  </div>
                  <form
                    className="social-login-form"
                    onSubmit={(e) => handleSubmit(e)}
                  >
                    {loginToggleLeft === true ? (
                      <div className="form-group row my-2 toggle-right-input-top-margin no-mtop">
                        <SelectDropDown
                          options={DOCUMENT_TYPE}
                          isSearchable={false}
                          value={roleSelected}
                          name="role"
                          className="multiple-search lang-place"
                          onChange={(value) => {
                            setOnClickButtonToggle(false);
                            setRoleSelected(value);
                          }}
                          label={t("ROLE")}
                          error={error?.role}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                    <div
                      className={`${
                        loginToggleLeft === false
                          ? "left-top-bottom-margin"
                          : ""
                      } form-group row my-2 toggle-right-input-top-margin`}
                    >
                      <SelectDropDown
                        options={LANGUAGE_OPTIONS}
                        isSearchable={false}
                        value={langSelected}
                        name="language selector"
                        className="multiple-search lang-place"
                        onChange={changeLanguage}
                        label={t("LANGUAGE_SELECTOR")}
                      />
                    </div>
                    <div className="form-group mb-2 toggle-left-input-top-margin">
                      <div
                        className={`${
                          toolTipData !== null ? "tooltip-one" : ""
                        }`}
                      >
                        <Input
                          type="text"
                          className=""
                          name="email"
                          value={form?.email}
                          onChange={(e) => changeHandler(e)}
                          error={error?.email}
                          maxLength="100"
                          label={t("EMAIL")}
                        />
                        <div
                          className={`${
                            toolTipData !== null ? "tooltip-content" : ""
                          }`}
                        >
                          <h5>{toolTipData}</h5>
                        </div>
                      </div>
                    </div>

                    <div className="form-group mb-4">
                      <Input
                        name="password"
                        value={form?.password}
                        onChange={(e) => changeHandler(e)}
                        type="password"
                        error={error?.password}
                        label={t("PASSWORD")}
                      />
                    </div>
                    <div className="form-group mb-4">
                      <h6 className="set_text text-uppercase">
                        {t("SIGN_UP")}:
                      </h6>
                    </div>
                    <div className="form-group mb-4 d-flex flex-column flex-sm-row gap-2 justify-content-between">
                      <GoogleLogin
                        clientId={GOOGLE_CLIENT_ID}
                        className=""
                        buttonText=""
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={"https://app.widu.co/"}
                        render={(renderProps) => (
                          <div
                            className="social-login-container align-item-center social-google-container"
                            onClick={renderProps.onClick}
                          >
                            <img
                              className="social-login-icon"
                              src={googleIcon}
                            />
                            <h6 className="social-app-name">GOOGLE</h6>
                          </div>
                        )}
                      />
                      <div
                        onClick={() => {
                          window.open(
                            `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_LINKEDIN_REDIRECT_URL}&state&scope=r_emailaddress,r_liteprofile`,
                            "_self"
                          );
                        }}
                        className="social-login-container align-item-center social-linkedin-container social-login"
                        data-id="1"
                      >
                        <img className="social-login-icon" src={linkedinIcon} />
                        <h6 className="social-app-name">LINKEDIN</h6>
                      </div>
                      <div
                        onClick={() =>
                          window.open(
                            `https://www.instagram.com/oauth/authorize?app_id=${process.env.REACT_APP_ID}&redirect_uri=${process.env.REACT_APP_INSTA_REDIRECT_URL}&scope=user_profile&response_type=code`,
                            "_self"
                          )
                        }
                        className="social-login-container align-item-center social-instagram-container social-login"
                        data-id="2"
                      >
                        <img
                          className="social-login-icon"
                          src={instagramIcon}
                        />
                        <h6 className="social-app-name">INSTAGRAM</h6>
                      </div>
                    </div>
                    <div className="form-group d-flex justify-content-center">
                      <Link
                        className="register-link text-decoration-none text-uppercase"
                        to="/forgot-password"
                      >
                        {t("FORGOT_PASSWORD")}
                      </Link>
                    </div>
                    <div className="form-group d-flex justify-content-center mb-4">
                      <Link
                        className="register-link text-decoration-none text-uppercase"
                        to={{
                          pathname: "/",
                          loginToggleLeft: loginToggleLeft,
                          loginToggleRight: loginToggleRight,
                        }}
                      >
                        {t("BACK_TO_LOGIN")}
                      </Link>
                    </div>
                    <div className="text-center w-100">
                      <Button
                        disabled={onClickButtonToggle}
                        text={t("SIGN_UP_BUTTON")}
                        type="submit"
                        className={`${
                          onClickButtonToggle ? "disable-btn-one" : ""
                        } w-100 login-btn text-uppercase`}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 client-right-img creative-right-img">
              <img
                className="client-right-image-section right-show"
                src={client_right_image}
              />
              <img
                className="client-right-image-section left-show"
                src={client_left_image}
              />
            </div>
          </div>
        </div>
        <Footer headerDesign={true} />
      </section>
    </>
  );
};

export default Register;
