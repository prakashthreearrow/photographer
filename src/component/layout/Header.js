import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
} from "../../utils/helper";
import { logoutUser } from "../../redux/action";
import { Loader } from "../CommonComponent";
import { Button, LangSelector } from "../../component/CommonComponent";

export default function Header({
  logoutFlag,
  isJob,
  isPhotographer,
  langSelector,
  orderCount,
  client,
  calendar,
}) {
  const { t, i18n } = useTranslation();

  let userData = JSON.parse(getLocalStorageItem("userData"));

  const [isPublishOpen, setPublishOpen] = useState(false);
  const [hambuggerToggle, setHambuggerToggle] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();

  const logoutLoading = useSelector((state) => state?.Logout?.loading);

  const redirectDashboard = (e) => {
    e.preventDefault();
    removeLocalStorageItem("count");
    removeLocalStorageItem("downloadLink");
    sessionStorage.removeItem('reloadCount');
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
  };

  const logoutWhileImageUploading = (e) => {
    e.preventDefault();
    dispatch(
      logoutUser({
        callback: () => {

          removeLocalStorageItem("downloadLink");
          removeLocalStorageItem("userData");
          removeLocalStorageItem("token");
          removeLocalStorageItem("userId");
          removeLocalStorageItem("image");

          removeLocalStorageItem("SignUp");
          removeLocalStorageItem("SignUpNext");
          removeLocalStorageItem("SignUpNext1");
          removeLocalStorageItem("SignUpNext2");
          removeLocalStorageItem("SignUpNext3");

          removeLocalStorageItem("placeAnOrder");
          removeLocalStorageItem("landscape");
          removeLocalStorageItem("upTo15");
          removeLocalStorageItem("foodAndBeverage");
          removeLocalStorageItem("houseLandscape");
          removeLocalStorageItem("houseAndApt");
          removeLocalStorageItem("moreThan15");
          removeLocalStorageItem("products");
          removeLocalStorageItem("count");
          removeLocalStorageItem("editOrder");
          history.push("/");
        },
      })
    );
  };

  const logout = (e) => {
    e.preventDefault();
    if (logoutFlag === false) {
      dispatch(
        logoutUser({
          callback: () => {
            
            removeLocalStorageItem("downloadLink");
            removeLocalStorageItem("userData");
            removeLocalStorageItem("token");
            removeLocalStorageItem("userId");
            removeLocalStorageItem("image");

            removeLocalStorageItem("SignUp");
            removeLocalStorageItem("SignUpNext");
            removeLocalStorageItem("SignUpNext1");
            removeLocalStorageItem("SignUpNext2");
            removeLocalStorageItem("SignUpNext3");

            removeLocalStorageItem("placeAnOrder");
            removeLocalStorageItem("landscape");
            removeLocalStorageItem("upTo15");
            removeLocalStorageItem("foodAndBeverage");
            removeLocalStorageItem("houseLandscape");
            removeLocalStorageItem("houseAndApt");
            removeLocalStorageItem("moreThan15");
            removeLocalStorageItem("products");
            removeLocalStorageItem("count");
            removeLocalStorageItem("editOrder");
            history.push("/");
          },
        })
      );
    } else if (logoutFlag === true) {
      setPublishOpen(true);
    }
  };

  return (
    <>
      {logoutLoading && <Loader />}
      {isPublishOpen && (
        <div
          className={`modal fade ${
            isPublishOpen ? "show d-block bg-blur" : "d-none"
          }`}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3">
              <div className="modal-header bg-red border-bottom-0">
                <h5 className="modal-title"></h5>
                <i
                  className="fa fa-close cursor-pointer"
                  onClick={() => setPublishOpen(false)}
                />
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-11 text-center">
                    <h5>{t("IMAGE_UPLOADING_TERMINATE")}</h5>
                  </div>
                </div>
                <div className="row">
                  <div className="col-11 text-center">
                    <h1>{t("ARE_YOU_SURE_LOGOUT")}</h1>
                  </div>
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <Button
                  text="NO"
                  className="model-button-width"
                  onClick={() => setPublishOpen(false)}
                />
                <Button
                  text="YES"
                  className="model-button-width"
                  onClick={(e) => logoutWhileImageUploading(e)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <header className="bg-white d-flex flex-wrap align-items-center justify-content-center justify-content-md-between">
        <div className="col-1 col-sm-1 col-xl-1 col-xxl-1 d-flex justify-content-between">
          <a
            onClick={(e) => {
              redirectDashboard(e);
            }}
            className="d-flex align-items-center col-md-auto mb-2 mb-md-0 text-dark text-decoration-none cursor-pointer"
          >
            <svg
              width="88"
              height="29"
              viewBox="0 0 172 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.447232 42.6424C-0.0293684 40.736 -0.0253419 39.5465 0.0187136 30.2908C0.0187136 27.0347 0.0547453 22.8094 0.0547453 17.2344H7.0075C7.0075 20.3423 6.98348 23.0617 6.97146 25.4487C6.88736 39.0098 6.86732 42.2339 9.60677 45.3097C10.4804 46.2936 11.5527 47.0811 12.7528 47.6204C13.953 48.1597 15.2538 48.4386 16.5695 48.4386C17.8853 48.4386 19.1861 48.1597 20.3863 47.6204C21.5864 47.0811 22.6587 46.2936 23.5323 45.3097C26.2718 42.2339 26.2518 39.0138 26.1717 25.4567C26.1717 23.0537 26.1396 20.3463 26.1316 17.2344H33.1965C33.1965 20.3423 33.1965 23.0617 33.1605 25.4447C33.0763 39.0098 33.0564 42.2299 35.7958 45.3097C36.6702 46.2931 37.7428 47.0802 38.9432 47.6191C40.1437 48.1581 41.4447 48.4368 42.7605 48.4368C44.0764 48.4368 45.3774 48.1581 46.5778 47.6191C47.7783 47.0802 48.8509 46.2931 49.7253 45.3097C52.4607 42.2339 52.4447 39.0098 52.3606 25.4487C52.3606 23.0457 52.3285 20.3423 52.3245 17.2344H59.2733C59.2733 22.8094 59.2974 27.0347 59.3134 30.2908C59.3535 39.5465 59.3614 40.736 58.8728 42.6824C56.8703 51.4935 49.3368 55.4986 42.7686 55.5226C38.3251 55.5175 34.0633 53.7587 30.9096 50.6284L29.6641 49.3668L28.4184 50.6284C25.2704 53.7549 21.0163 55.5136 16.5795 55.5226C9.99122 55.4825 2.44575 51.5175 0.447232 42.6424Z"
                fill="#353535"
              />
              <path
                d="M74.6974 1.02441C75.4895 1.02441 76.2639 1.25931 76.9225 1.69939C77.5811 2.13947 78.0945 2.76497 78.3976 3.49679C78.7007 4.22862 78.7801 5.0339 78.6255 5.8108C78.471 6.58771 78.0895 7.30134 77.5294 7.86145C76.9693 8.42157 76.2557 8.80301 75.4788 8.95755C74.7019 9.11208 73.8966 9.03277 73.1647 8.72964C72.4329 8.4265 71.8074 7.91317 71.3674 7.25454C70.9273 6.59592 70.6924 5.82158 70.6924 5.02946C70.6924 3.96725 71.1144 2.94856 71.8654 2.19746C72.6165 1.44637 73.6352 1.02441 74.6974 1.02441ZM71.2211 17.2328H78.1738V55.5211H71.2211V17.2328Z"
                fill="#353535"
              />
              <path
                d="M108.087 17.2342C109.251 17.2334 110.413 17.338 111.559 17.5466V24.6836C109.104 23.955 106.481 24.0181 104.064 24.8641C101.646 25.7102 99.5566 27.2961 98.0913 29.3968C96.6261 31.4975 95.8597 34.0063 95.9009 36.5672C95.942 39.1281 96.7887 41.611 98.3207 43.6635C99.8527 45.716 101.992 47.2339 104.436 48.0018C106.879 48.7696 109.502 48.7485 111.933 47.9412C114.364 47.134 116.478 45.5818 117.977 43.5048C119.476 41.4278 120.282 38.9316 120.282 36.3703V1.5625H127.231V36.3783C127.232 40.1658 126.109 43.8685 124.005 47.018C121.902 50.1675 118.911 52.6224 115.412 54.0721C111.913 55.5219 108.063 55.9015 104.348 55.1627C100.633 54.424 97.2211 52.6003 94.5429 49.9221C91.8648 47.244 90.041 43.8317 89.3023 40.117C88.5636 36.4022 88.9431 32.5519 90.3929 29.0528C91.8426 25.5538 94.2976 22.5633 97.4471 20.4596C100.597 18.3559 104.299 17.2334 108.087 17.2342Z"
                fill="#FF7330"
              />
              <path
                d="M170.826 42.6688C168.824 51.4798 161.29 55.4849 154.722 55.5089C148.133 55.4689 140.592 51.4839 138.589 42.6287C137.945 40.0414 138.189 38.7518 138.189 17.2207H145.138C145.102 37.7626 144.517 41.6755 147.737 45.2961C148.611 46.2799 149.683 47.0674 150.883 47.6067C152.083 48.1461 153.384 48.4249 154.7 48.4249C156.016 48.4249 157.316 48.1461 158.517 47.6067C159.717 47.0674 160.789 46.2799 161.662 45.2961C164.867 41.6915 164.298 37.9028 164.266 17.2207H171.215C171.239 38.6717 171.491 40.0094 170.826 42.6688Z"
                fill="#FF7330"
              />
            </svg>
          </a>
        </div>
        <div className="col-11 col-sm-11 col-xl-10 col-xxl-10 text-end notification-mesg d-flex align-items-center justify-content-end">
          {langSelector ? <LangSelector /> : ""}
          {client ? (
            orderCount > 0 ? (
              <div className="cart-icons">
                <ul>
                  <li className="header-cart">
                    <a>
                      <svg
                        className="cursor-pointer"
                        onClick={() => {
                          history.push("/cart");
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M4.1421 4.00014L6.00913 16.1358C6.02271 16.236 6.05113 16.3314 6.0921 16.4199C6.21543 16.6862 6.45246 16.8891 6.74088 16.9662C6.82899 16.9899 6.92133 17.0017 7.01578 17.0001H18C18.4416 17.0001 18.8309 16.7105 18.9578 16.2875L21.9578 6.28749C22.0487 5.98471 21.991 5.65682 21.8023 5.40321C21.6136 5.1496 21.3161 5.00014 21 5.00014H6.31948L5.99058 2.86233C5.97826 2.77295 5.95413 2.68733 5.91981 2.60712C5.85751 2.46104 5.76213 2.33451 5.64429 2.23533C5.53497 2.14314 5.40561 2.07396 5.26367 2.03526C5.17434 2.0108 5.0806 1.99855 4.9847 2.00014H3C2.44772 2.00014 2 2.44785 2 3.00014C2 3.55242 2.44772 4.00014 3 4.00014H4.1421ZM7.85794 15.0001L6.62717 7.00014H19.656L17.256 15.0001H7.85794Z"
                          fill="#353535"
                        />
                        <path
                          d="M10 20.0001C10 21.1047 9.10457 22.0001 8 22.0001C6.89543 22.0001 6 21.1047 6 20.0001C6 18.8956 6.89543 18.0001 8 18.0001C9.10457 18.0001 10 18.8956 10 20.0001Z"
                          fill="#353535"
                        />
                        <path
                          d="M19 20.0001C19 21.1047 18.1046 22.0001 17 22.0001C15.8954 22.0001 15 21.1047 15 20.0001C15 18.8956 15.8954 18.0001 17 18.0001C18.1046 18.0001 19 18.8956 19 20.0001Z"
                          fill="#353535"
                        />
                      </svg>
                    </a>
                    <span className="count">{orderCount}</span>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="cart-icons">
                <ul>
                  <li className="header-cart">
                    <a>
                      <svg
                        className="cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M4.1421 4.00014L6.00913 16.1358C6.02271 16.236 6.05113 16.3314 6.0921 16.4199C6.21543 16.6862 6.45246 16.8891 6.74088 16.9662C6.82899 16.9899 6.92133 17.0017 7.01578 17.0001H18C18.4416 17.0001 18.8309 16.7105 18.9578 16.2875L21.9578 6.28749C22.0487 5.98471 21.991 5.65682 21.8023 5.40321C21.6136 5.1496 21.3161 5.00014 21 5.00014H6.31948L5.99058 2.86233C5.97826 2.77295 5.95413 2.68733 5.91981 2.60712C5.85751 2.46104 5.76213 2.33451 5.64429 2.23533C5.53497 2.14314 5.40561 2.07396 5.26367 2.03526C5.17434 2.0108 5.0806 1.99855 4.9847 2.00014H3C2.44772 2.00014 2 2.44785 2 3.00014C2 3.55242 2.44772 4.00014 3 4.00014H4.1421ZM7.85794 15.0001L6.62717 7.00014H19.656L17.256 15.0001H7.85794Z"
                          fill="#353535"
                        />
                        <path
                          d="M10 20.0001C10 21.1047 9.10457 22.0001 8 22.0001C6.89543 22.0001 6 21.1047 6 20.0001C6 18.8956 6.89543 18.0001 8 18.0001C9.10457 18.0001 10 18.8956 10 20.0001Z"
                          fill="#353535"
                        />
                        <path
                          d="M19 20.0001C19 21.1047 18.1046 22.0001 17 22.0001C15.8954 22.0001 15 21.1047 15 20.0001C15 18.8956 15.8954 18.0001 17 18.0001C18.1046 18.0001 19 18.8956 19 20.0001Z"
                          fill="#353535"
                        />
                      </svg>
                    </a>
                    <span className="count">{0}</span>
                  </li>
                </ul>
              </div>
            )
          ) : (
            ""
          )}

          {isJob ? (
            <div
              className={`align-items-center toggle-icons ${
                hambuggerToggle ? "p-done" : "p-block"
              }`}
            >
              <div className="header-alert">
                {calendar ? (
                  <a className="calender-header cursor-pointer">
                    <svg
                      onClick={() => {
                        history.push("/calender");
                        removeLocalStorageItem("downloadLink");
                      }}
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_436_1722)">
                        <path
                          d="M7 1C7.55228 1 8 1.44771 8 2V3H12V2C12 1.44771 12.4477 1 13 1C13.5523 1 14 1.44771 14 2V3H17C18.1046 3 19 3.89543 19 5V18C19 19.1046 18.1046 20 17 20H3C1.89543 20 1 19.1046 1 18V5C1 3.89543 1.89543 3 3 3H6V2C6 1.44771 6.44772 1 7 1ZM6 5H3V8H17V5H14V6C14 6.55228 13.5523 7 13 7C12.4477 7 12 6.55228 12 6V5H8V6C8 6.55228 7.55228 7 7 7C6.44772 7 6 6.55228 6 6V5ZM17 10H3V18H17V10Z"
                          fill="#353535"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_436_1722">
                          <rect
                            width="18"
                            height="19"
                            fill="white"
                            transform="translate(1 1)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </a>
                ) : (
                  ""
                )}

                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="20"
                    viewBox="0 0 18 20"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_436_1736)">
                      <path
                        d="M7.14614 1.24812C7.4433 0.516158 8.16138 0 9 0C9.83863 0 10.5567 0.516158 10.8539 1.24812C13.8202 2.06072 16 4.77579 16 8V12.6972L17.8321 15.4453C18.0366 15.7522 18.0557 16.1467 17.8817 16.4719C17.7077 16.797 17.3688 17 17 17H12.4646C12.2219 18.6961 10.7632 20 9 20C7.23677 20 5.77806 18.6961 5.53545 17H1C0.631206 17 0.292346 16.797 0.118327 16.4719C-0.0556921 16.1467 -0.0366195 15.7522 0.167951 15.4453L2 12.6972V8C2 4.77579 4.17983 2.06072 7.14614 1.24812ZM7.58535 17C7.79127 17.5826 8.34689 18 9 18C9.65311 18 10.2087 17.5826 10.4146 17H7.58535ZM9 3C6.23858 3 4 5.23858 4 8V13C4 13.1974 3.94156 13.3904 3.83205 13.5547L2.86852 15H15.1315L14.168 13.5547C14.0584 13.3904 14 13.1974 14 13V8C14 5.23858 11.7614 3 9 3Z"
                        fill="#353535"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_436_1736">
                        <rect width="18" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </a>
              </div>
              <div className="header-help">
                <a>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2ZM0 10C0 4.47715 4.47715 0 10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10Z"
                      fill="#353535"
                    />
                    <path
                      d="M10 12C9.44771 12 9 11.5523 9 11V10C9 9.44771 9.44772 9 10 9C10.5523 9 11 9.44771 11 10V11C11 11.5523 10.5523 12 10 12Z"
                      fill="#353535"
                    />
                    <path
                      d="M8.5 14.5C8.5 13.6716 9.17157 13 10 13C10.8284 13 11.5 13.6716 11.5 14.5C11.5 15.3284 10.8284 16 10 16C9.17157 16 8.5 15.3284 8.5 14.5Z"
                      fill="#353535"
                    />
                    <path
                      d="M10.3899 5.81137C9.4329 5.7658 8.63039 6.3004 8.48639 7.1644C8.3956 7.70917 7.88037 8.07719 7.3356 7.9864C6.79083 7.8956 6.42281 7.38037 6.51361 6.8356C6.86961 4.69961 8.8171 3.73421 10.4851 3.81363C11.3395 3.85432 12.2176 4.16099 12.8937 4.79278C13.5866 5.44027 14 6.36777 14 7.5C14 8.79131 13.4919 9.74892 12.6172 10.3321C11.8141 10.8675 10.8295 11 10 11C9.44772 11 9 10.5523 9 10C9 9.44771 9.44772 9 10 9C10.6705 9 11.1859 8.88252 11.5078 8.66795C11.7581 8.50109 12 8.2087 12 7.5C12 6.88224 11.7884 6.49723 11.5282 6.2541C11.2512 5.99526 10.848 5.83318 10.3899 5.81137Z"
                      fill="#353535"
                    />
                  </svg>
                  <span> {t("HELP_CENTER")}</span>
                </a>
              </div>
              <div className="d-flex justify-content-end d-xl-flex">
                <div className="dropdown">
                  <button
                    onClick={(e) => {
                      logout(e);
                    }}
                    type="button"
                    className="btn d-flex"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11 20C11 19.4477 10.5523 19 10 19H5V5H10C10.5523 5 11 4.55228 11 4C11 3.44771 10.5523 3 10 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H10C10.5523 21 11 20.5523 11 20Z"
                        fill="#353535"
                      />
                      <path
                        d="M21.7136 12.7005C21.8063 12.6062 21.8764 12.498 21.9241 12.3828C21.9727 12.2657 21.9996 12.1375 22 12.003L22 12L22 11.997C21.9992 11.7421 21.9016 11.4874 21.7071 11.2929L17.7071 7.29289C17.3166 6.90237 16.6834 6.90237 16.2929 7.29289C15.9024 7.68342 15.9024 8.31658 16.2929 8.70711L18.5858 11H9C8.44771 11 8 11.4477 8 12C8 12.5523 8.44771 13 9 13H18.5858L16.2929 15.2929C15.9024 15.6834 15.9024 16.3166 16.2929 16.7071C16.6834 17.0976 17.3166 17.0976 17.7071 16.7071L21.7064 12.7078L21.7136 12.7005Z"
                        fill="#353535"
                      />
                    </svg>
                    {t("LOG OUT")}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}

          {isJob ? (
            <div
              onClick={() => {
                setHambuggerToggle(!hambuggerToggle);
              }}
              className="hamburger"
            >
              <div className="hamburger-menu" id="hamburger-menu">
              <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 64 64"><line x2="64" y1="15.95" y2="15.95" fill="none" stroke="#010101" strokeMiterlimit="10" strokeWidth="4"/><line x2="64" y1="32.15" y2="32.15" fill="none" stroke="#010101" strokeMiterlimit="10" strokeWidth="4"/><line x2="64" y1="48.05" y2="48.05" fill="none" stroke="#010101" strokeMiterlimit="10" strokeWidth="4"/></svg>
              </div>
             
            </div>
          ) : (
            ""
          )}
          {isPhotographer ? (
            <div className="d-flex justify-content-end d-xl-flex">
              <div className="dropdown">
                <button
                  onClick={(e) => {
                    logout(e);
                  }}
                  type="button"
                  className="btn d-flex"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11 20C11 19.4477 10.5523 19 10 19H5V5H10C10.5523 5 11 4.55228 11 4C11 3.44771 10.5523 3 10 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H10C10.5523 21 11 20.5523 11 20Z"
                      fill="#353535"
                    />
                    <path
                      d="M21.7136 12.7005C21.8063 12.6062 21.8764 12.498 21.9241 12.3828C21.9727 12.2657 21.9996 12.1375 22 12.003L22 12L22 11.997C21.9992 11.7421 21.9016 11.4874 21.7071 11.2929L17.7071 7.29289C17.3166 6.90237 16.6834 6.90237 16.2929 7.29289C15.9024 7.68342 15.9024 8.31658 16.2929 8.70711L18.5858 11H9C8.44771 11 8 11.4477 8 12C8 12.5523 8.44771 13 9 13H18.5858L16.2929 15.2929C15.9024 15.6834 15.9024 16.3166 16.2929 16.7071C16.6834 17.0976 17.3166 17.0976 17.7071 16.7071L21.7064 12.7078L21.7136 12.7005Z"
                      fill="#353535"
                    />
                  </svg>
                  <span>{t("LOGOUT")}</span>
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </header>
    </>
  );
}
