import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ContentLoader from "react-content-loader";
import { gapi } from "gapi-script";
import { toast } from "react-toastify";
import Select, { components as Components } from "react-select";
import { useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Button,
  Input,
  Footer,
  Loader,
  SelectDropDown,
} from "../component/CommonComponent";
import logo from "../assets/images/logo.svg";
import googleIcon from "../assets/images/google-icon.svg";
import linkedinIcon from "../assets/images/linkedin-icon.svg";
import instagramIcon from "../assets/images/intagram-icon.svg";
import downIndicator from "../assets/images/downIndicator.png";
import validateLogin from "../validation/login";
import { ErrorToast, SuccessToast } from "../utils/helper";
import { GoogleLogin } from "react-google-login";
import { getLocalStorageItem, removeLocalStorageItem } from "../utils/helper";
import {
  googleLoginUser,
  loginUser,
  linkedinAccessTokenLoginUser,
  linkedinGetProfileUser,
  instagramAccessTokenUser,
  instagramGetProfileUser,
  clientLogin,
  resendEmail
} from "../redux/action";
import { GOOGLE_CLIENT_ID, LANGUAGE_OPTIONS } from "../utils/constants";
import $ from "jquery";
import client_right_image from "../assets/images/creative-img.jpeg";
import client_left_image from "../assets/images/login-bg-left.jpg";

const Login = () => {
  const { i18n, t } = useTranslation();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "",
  });

  let MyLoader = () => <ContentLoader />;

  const params = new URLSearchParams(window?.location?.search);
  const user_access_token = params?.get("code");
  const register_successfull = params?.get("email-verify");

  let userData = JSON.parse(getLocalStorageItem("userData"));

  const [error, setError] = useState({});
  const [loginToggleLeft, setLoginToggleLeft] = useState(true);
  const [loginToggleRight, setLoginToggleRight] = useState(true);
  const [toolTipData, setToolTipData] = useState(null);
  const [onClickButtonToggle, setOnClickButtonToggle] = useState(false);
  const [resendEmailFlag, setResendEmailFlag] = useState(false);
console.log("resendEmailFlag",resendEmailFlag)
  const history = useHistory();
  const dispatch = useDispatch();

  const loginLoading = useSelector((state) => state?.Login?.loading);
  const clientLoginLoading = useSelector(
    (state) => state?.ClientLogin?.loading
  );

  const [loading, setLoading] = useState(false);

  const [langSelected, setLangSelected] = useState("");
  const [changeLang, setChangeLang] = useState("en");
  const [roleSelected, setRoleSelected] = useState("");

  const DOCUMENT_TYPE = [
    { label: t("PHOTOGRAPHER"), value: "5" },
    { label: t("EDITOR"), value: "6" },
  ];

  useEffect(() => {
    if (register_successfull === "1") {
      toast.success(
        <SuccessToast msg="Success, your email has been verified. Please log in." />
      );
    }
    function start() {
      gapi.client.init({
        clientId: GOOGLE_CLIENT_ID,
        scope: "email",
        plugin_name: "chat",
      });
    }
    gapi.load("client:auth2", start);
  }, [register_successfull]);

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

    const languageSelected = LANGUAGE_OPTIONS?.find(
      (element) => element?.value === changeLang
    );
    setLangSelected(languageSelected);
    changeLanguage({ label: "onReload", value: languageSelected?.value });
  }, [changeLang]);

  const customStyles = {
    option: (styles, state) => ({
      ...styles,
      cursor: "pointer",
      backgroundColor: state.isSelected ? "#FF7330" : styles.backgroundColor,
      textAlign: "center",

      color: "#3F3F3F",
      "&:hover": {
        backgroundColor: "#F6F6F6",
      },
    }),
    control: (styles) => ({
      ...styles,
      cursor: "pointer",
    }),
  };

  MyLoader = () => (
    <ContentLoader viewBox="0 0 380 70">
      <Loader />
    </ContentLoader>
  );

  useEffect(() => {
    setRoleSelected({ label: "Photographer", value: "5" });
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
                          history.push("/register");
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
    if (getLocalStorageItem("token") && getLocalStorageItem("userData")) {
      if (userData?.roles[0]?.id === 5) {
        if (userData?.is_profile_completed === 1) {
          history.push("/dashboard");
        } else {
          if (userData?.is_updated_steps === "1") {
            history.push("/sign-up-next");
          } else if (
            userData?.is_updated_steps === "2"
          ) {
            history.push("/sign-up-next2");
          } else if (
            userData?.is_updated_steps === "3"
          ) {
            history.push("/sign-up-next3");
          } else if (
            userData?.is_updated_steps === "4"
          ) {
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

    setLoading(true);
    var timer = setTimeout(() => {
      setLoading(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const LoginToggleLeft = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setResendEmailFlag(false);
    setToolTipData(null);
    setLoginToggleLeft(false);
    setLoginToggleRight(true);
  };

  const LoginToggleRight = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setResendEmailFlag(false);
    setToolTipData(null);
    setLoginToggleLeft(true);
    setLoginToggleRight(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.scrollTo(0, 0);
    const { errors, isValid } = validateLogin(form, t);
    removeLocalStorageItem("userData");
    removeLocalStorageItem("token");
    if (isValid) {
      setOnClickButtonToggle(true);
      let profileForm = {
        email: form?.email,
        password: form?.password,
      };

      if (loginToggleLeft === true) {
        profileForm.role = roleSelected.value;
        dispatch(
          loginUser({
            profileForm,
            callback: (data) => {
              if (data) {
                setOnClickButtonToggle(false);
                let downloadLink = JSON.parse(getLocalStorageItem("downloadLink"));
                if (downloadLink) {
                  history.push(`/download-link/${downloadLink}`);
                } else {
                  if (data?.code == 400) {
                    setToolTipData(data?.errors[0]);
                    if (data?.is_resendemail == 1) {
                      if(data?.resendtime >= 12){
                        setResendEmailFlag(true);
                      }
                    }
                  } else {
                    localStorage.setItem('userData', JSON.stringify(data?.user));
                    if (data?.user?.roles[0]?.id === 5) {
                      if (data?.user?.is_profile_completed === 1) {
                        history.push("/dashboard");
                      } else if (data?.user?.is_profile_completed === 0) {

                        if (data?.user?.is_updated_steps === "1") {
                          history.push("/sign-up-next");
                        } else if (
                          data?.user?.is_updated_steps === "2"
                        ) {
                          history.push("/sign-up-next2");
                        } else if (
                          data?.user?.is_updated_steps === "3"
                        ) {
                          history.push("/sign-up-next3");
                        } else if (
                          data?.user?.is_updated_steps === "4"
                        ) {
                          history.push("/sign-up-next5");
                        } else if (
                          data?.user?.is_updated_steps === "0"
                        ) {
                          history.push("/sign-up");
                        }
                      }
                    } else if (data?.user?.roles[0]?.id === 6) {
                      if (data?.user?.is_profile_completed === 1) {
                        history.push("/editor-dashboard");
                      } else {
                        history.push("/sign-up-editor");
                      }
                    } else if (data?.user?.roles[0]?.id === 7) {
                      if (data?.user?.parent_id !== null) {
                        history.push("/sign-up-client3");
                      } else {
                        if (data?.user?.is_profile_completed === 1) {
                          history.push("/client-dashboard");
                        } else {
                          history.push("/sign-up-client");
                        }
                      }
                    }
                  }

                }
              }
            },
          })
        );
      } else {
        dispatch(
          clientLogin({
            profileForm,
            callback: (data) => {
              if (data) {
                setOnClickButtonToggle(false);
                let downloadLink = JSON.parse(getLocalStorageItem("downloadLink"));
                if (downloadLink) {
                  history.push(`/download-link/${downloadLink}`);
                } else {
                  if (data?.length !== undefined) {
                    setToolTipData(data);
                  }
                  if (data?.roles[0]?.id === 5) {
                    if (data?.is_profile_completed === 1) {
                      history.push("/dashboard");
                    } else if (data?.is_profile_completed === 0) {
                      if (data?.is_updated_steps === "1") {
                        history.push("/sign-up-next");
                      } else if (
                        data?.is_updated_steps === "2"
                      ) {
                        history.push("/sign-up-next2");
                      } else if (
                        data?.is_updated_steps === "3"
                      ) {
                        history.push("/sign-up-next3");
                      } else if (
                        data?.is_updated_steps === "4"
                      ) {
                        history.push("/sign-up-next5");
                      } else if (
                        data?.is_updated_steps === "0"
                      ) {
                        history.push("/sign-up");
                      }
                    }
                  } else if (data?.roles[0]?.id === 7) {
                    if (data?.parent_id !== null) {
                      history.push("/sign-up-client3");
                    } else {
                      if (data?.is_profile_completed === 1) {
                        history.push("/client-dashboard");
                      } else {
                        history.push("/sign-up-client");
                      }
                    }
                  } else if (data?.roles[0]?.id === 6) {
                    if (data?.is_profile_completed === 1) {
                      history.push("/editor-dashboard");
                    } else {
                      history.push("/sign-up-editor");
                    }
                  }
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
    setResendEmailFlag(false);
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

  const resendEmailSubmit = (e) => {
    e.preventDefault();
    setResendEmailFlag(false);
    setToolTipData(null);
    let resendEmailPayload = {
      is_send_roles:parseInt(roleSelected?.value),
      email:form?.email
    };
    dispatch(
      resendEmail({
        resendEmailPayload,
        callback: (data) => {
          if (data) {
            toast.success(
              <SuccessToast msg={data?.message} />
            );
          }
        },
      })
    );
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
                if (data?.data?.user?.is_updated_steps === "1") {
                  history.push("/sign-up-next");
                } else if (data?.data?.user?.is_updated_steps === "2") {
                  history.push("/sign-up-next2");
                } else if (data?.data?.user?.is_updated_steps === "3") {
                  history.push("/sign-up-next3");
                } else if (data?.data?.user?.is_updated_steps === "4") {
                  history.push("/sign-up-next5");
                } else if (
                  data?.data?.user?.is_updated_steps === "0"
                ) {
                  history.push("/sign-up");
                }
              } else {
                history.push("/register");
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

  const DropdownIndicator = (props) => {
    return (
      <Components.DropdownIndicator {...props}>
        <img src={downIndicator} alt="downIndicator" />
      </Components.DropdownIndicator>
    );
  };

  $(document).ready(function () {
    $(document).on("click", ".social-login", function () {
      var data_id = $(this).attr("data-id");
      localStorage.setItem("social", data_id);
    });

    $(".toggle-button-left ").click(function () {
      clearTimeout(right);
      $(".creative-left-img").addClass("fade-in");
      var right = setTimeout(function () {
        $(".creative-left-img").removeClass("fade-in");
      }, 400);
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
      {loginLoading && <Loader />}
      {clientLoginLoading && <Loader />}
      <section
        className={`${loginToggleLeft === true
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
          <Select
            placeholder="Language Selector "
            className="select-format new-lang d-block d-lg-none"
            onChange={changeLanguage}
            value={langSelected}
            styles={customStyles}
            isSearchable={false}
            options={LANGUAGE_OPTIONS}
            components={{
              DropdownIndicator,
              IndicatorSeparator: () => null,
            }}
          />

          <div className="row login-box">
            <div className="col-12 col-lg-6 main-login-section login-center">
              <Select
                placeholder="Language Selector"
                className="select-format new-lang  d-none d-lg-block"
                onChange={changeLanguage}
                value={langSelected}
                styles={customStyles}
                isSearchable={false}
                options={LANGUAGE_OPTIONS}
                components={{
                  DropdownIndicator,
                  IndicatorSeparator: () => null,
                }}
              />
              <div className="login-detail s-top">
                <div className="d-block client-creative-toggler text-center">
                  <p className="text-body form-pages-title my-2">
                    {t("LOGIN")}
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
                      <div className="mt-5 form-group row my-2 toggle-right-input-top-margin no-mtop">
                        <SelectDropDown
                          options={DOCUMENT_TYPE}
                          isSearchable={false}
                          value={roleSelected}
                          name="role"
                          className="multiple-search lang-place"
                          onChange={(value) => {
                            setToolTipData(null);
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
                    <div className="form-group  mb-2 toggle-left-input-top-margin">
                      <div
                        className={`${toolTipData !== null ? "tooltip-one" : ""
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
                          className={`${toolTipData !== null ? "tooltip-content" : ""
                            }`}
                        >
                          <h5>{toolTipData}</h5>
                        </div>
                      </div>
                    </div>

                    <div className="form-group mb-2">
                      <Input
                        name="password"
                        value={form?.password}
                        onChange={(e) => changeHandler(e)}
                        type="password"
                        error={error?.password}
                        label={t("PASSWORD")}
                      />
                    </div>
                    {
                      resendEmailFlag ? <div className="text-end cursor-pointer">
                        <a onClick={(e)=> {resendEmailSubmit(e)}}  className="register-link text-decoration-none">{t("RESEND_EMAIL_VERIFICATION")}</a>
                      </div> : ""
                    }

                    <div className="form-group mb-4">
                      <h6 className="set_text text-uppercase">
                        {t("SIGN_IN")}:
                      </h6>

                    </div>
                    <div className="form-group mb-4 d-flex flex-column flex-sm-row gap-2 justify-content-between">
                      <GoogleLogin
                        clientId={GOOGLE_CLIENT_ID}
                        className=""
                        buttonText=""
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy={"single_host_origin"}
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
                        to={{
                          pathname: "/register",
                          loginToggleLeft: loginToggleLeft,
                          loginToggleRight: loginToggleRight,
                          roles: roleSelected?.value,
                        }}
                      >
                        {t("CLICK_HERE_TO_REGISTER")}
                      </Link>
                    </div>
                    <div className="form-group d-flex justify-content-center mb-4">
                      <Link
                        className="register-link text-decoration-none text-uppercase"
                        to="/forgot-password"
                      >
                        {t("FORGOT_PASSWORD")}
                      </Link>
                    </div>
                    <div className="text-center w-100">
                      <Button
                        disabled={onClickButtonToggle}
                        text={t("LOGIN")}
                        type="submit"
                        className={`${onClickButtonToggle ? "disable-btn-one" : ""
                          } w-100 login-btn`}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 client-right-img creative-right-img ">
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

export default Login;
