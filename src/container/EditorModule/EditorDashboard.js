import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import $ from "jquery";
import { useTranslation } from "react-i18next";
import Moment from "react-moment";
import {
  Footer
} from "../../component/CommonComponent";
import { getLocalStorageItem } from "../../utils/helper";
import iconsearch from "../../assets/images/iconsearch.png";
import flagchil from "../../assets/images/Chile.png";
import Header from "../../component/layout/Header";
import {
  userProfile,
  getJobListEditor,
} from "../../redux/action";

const JobDashboard = () => {
  const { t } = useTranslation();
  const mountedRef = useRef(null);
  let userData = JSON.parse(getLocalStorageItem("userData"));

  const [form, setForm] = useState({
    reason: "",
  });

  const editor_job_list = useSelector(
    (state) => state?.GetJobListEditor?.jobListEditor
  );

  const [userCategoryList, setUserCategoryList] = useState([]);
  const [uploadImageLoader, setUploadImageLoader] = useState(false);
  const [userProfileDashBoardData, setUserProfileDashBoard] =
    useState(userData);
  const [photographerJobList, setPhotographerJobList] = useState(
    editor_job_list
  );
  const [filterList, setFilterList] = useState([]);
  const [search, setSearch] = useState("");
  const [toggleLeftArrow, setToggleLeftArrow] = useState(false);
  const [toggleSortArrow, setToggleSortArrow] = useState(false);
  const [toggleRightArrow, setToggleRightArrow] = useState(false);
  const [activeCount, setActiveCount] = useState(0);
  const [previousJobCardCount, setPreviousJobCardCount] = useState(0);
  const [newJobCount, setNewJobCount] = useState(0);
  const [job_id, setJob_id] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clearLoaderTimeOut, setClearLoaderTimeOut] = useState(0);

  const history = useHistory();
  const dispatch = useDispatch();

  const user_data = useSelector((state) => state?.Login?.userData);

  let show_reel = userProfileDashBoardData?.work_email?.split("/")[0];
  let show_reel_link = `${show_reel === "https:" || show_reel === "http:"
    ? userProfileDashBoardData?.work_email
    : `https://${userProfileDashBoardData?.work_email}`
    }`;


  useEffect(() => {
    let categoryList = [];
    userData?.categories?.map((data) => {
      data?.category_name?.map((element) => {
        categoryList.push(element?.id.toString());
      });
    });
    setUserCategoryList(categoryList);

    $(document).ready(function () {
      $(".toggle-svg").click(function () {
        $(".toggle-menu-one").slideToggle();
      });
    });

    return () => {
      mountedRef.current = false;
    };
  }, []);

  //api call for job listing
  useEffect(async () => {
    let user_profile_id = userData?.id || user_data?.id;
    setLoading(true);
    if (search?.length === 0) {
      dispatch(userProfile({ user_profile_id }));
      let photographer_job = {
        photographer_id: user_profile_id,
      };

      dispatch(
        getJobListEditor({
          photographer_job,
          callback: async (data) => {
            setLoading(false);
            if (data?.jobs) {
              setPhotographerJobList(
                data?.jobs.map((element) => {

                  //below line of code to remove AM and PM from the date
                  let am_pm = element?.date_of_upload?.search("AM");
                  if (am_pm == -1) {
                    var remove_am_pm = element?.date_of_upload?.replace(' PM', '');
                  } else {
                    var remove_am_pm = element?.date_of_upload?.replace(' AM', '');
                  }

                  return {
                    ...element,
                    id: element?.id?.toString(),
                    date_of_upload: remove_am_pm
                  };
                })
              );
              setFilterList(
                data?.jobs.map((element) => {
                  let am_pm = element?.date_of_upload?.search("AM");
                  if (am_pm == -1) {
                    var remove_am_pm = element?.date_of_upload?.replace(' PM', '');
                  } else {
                    var remove_am_pm = element?.date_of_upload?.replace(' AM', '');
                  }
                  return {
                    ...element,
                    id: element?.id?.toString(),
                    date_of_upload: remove_am_pm
                  };
                })
              );
            }
          },
        })
      );
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

    return () => {
      mountedRef.current = false;
    };
  }, [job_id]);

  //search filter
  useEffect(() => {
    if (search) {
      let filter = photographerJobList?.filter((elemet) => {
        return (
          elemet?.id?.indexOf(search) > -1 ||
          elemet?.category_short_form?.toLowerCase().indexOf(search) > -1 ||
          elemet?.project_location?.toLowerCase().indexOf(search) > -1 ||
          elemet?.date_of_shoot?.indexOf(search) > -1 ||
          elemet?.date_of_delivery?.indexOf(search) > -1
        );
      });
      setFilterList(filter);
    }

    return () => {
      mountedRef.current = false;
    };
  }, [search]);

  //initial data show of active shoots, previous jobs cards and new jobs on the right section.
  useEffect(() => {
    let activeJobs = editor_job_list?.filter(
      (job) => (((job?.in_process === 1 && job?.editor_status === 1) || (job?.in_process === 2 && job?.editor_status === 1) || (job?.in_process === 3 && job?.editor_status === 1) || (job?.in_process === 6 && job?.editor_status === 1)))
    );
    let count1 =
      activeJobs !== undefined && activeJobs.length > 0
        ? activeJobs.length
        : 0;
    setActiveCount(count1);

    let previous_job_card = editor_job_list?.filter(
      (job) => (job?.in_process === 5 && job?.is_raise_invoice_editor === 1)
    );
    let count2 =
      previous_job_card !== undefined && previous_job_card?.length > 0
        ? previous_job_card?.length
        : 0;
    setPreviousJobCardCount(count2);

    let new_job = editor_job_list?.filter((job) => (((job?.in_process === 1 && job?.editor_status === 0) || (job?.in_process === 2 && job?.editor_status === 0) || (job?.in_process === 3 && job?.editor_status === 0) || (job?.in_process === 6 && job?.editor_status === 0))));
    let count3 =
      new_job !== undefined && new_job?.length > 0 ? new_job?.length : 0;
    setNewJobCount(count3);

    return () => {
      mountedRef.current = false;
    };
  }, [JSON.stringify(editor_job_list)]);

  const scrollToBottom = () => {
    window.scrollTo(0, 1000);
  };

  const jobDetail = (e, job) => {
    e.preventDefault();
    history.push({
      pathname: `/job-detail-editor/${job?.id}`,
      jobDetail: job,
    });
  };

  const edit_profile = (e, job) => {
    e.preventDefault();
    history.push({
      pathname: "/edit-editor-profile",
    });
  };

  const sortBy_shooting_date = (e) => {
    e.preventDefault();
    setToggleSortArrow(!toggleSortArrow);
    setLoading(true);

    clearTimeout(clearLoaderTimeOut);
    let clearLoaderTime = setTimeout(() => {
      setLoading(false);
    }, 2000);
    setClearLoaderTimeOut(clearLoaderTime);

    if (toggleSortArrow) {
      setFilterList(
        editor_job_list?.map((element) => {

          //below line of code to remove AM and PM from the date
          let am_pm = element?.date_of_upload?.search("AM");
          if (am_pm == -1) {
            var remove_am_pm = element?.date_of_upload?.replace(' PM', '');
          } else {
            var remove_am_pm = element?.date_of_upload?.replace(' AM', '');
          }

          return {
            ...element,
            id: element?.id?.toString(),
            date_of_upload: remove_am_pm
          };
        })
      );
      setPhotographerJobList(
        editor_job_list?.map((element) => {

          //below line of code to remove AM and PM from the date
          let am_pm = element?.date_of_upload?.search("AM");
          if (am_pm == -1) {
            var remove_am_pm = element?.date_of_upload?.replace(' PM', '');
          } else {
            var remove_am_pm = element?.date_of_upload?.replace(' AM', '');
          }
          return {
            ...element,
            id: element?.id?.toString(),
            date_of_upload: remove_am_pm
          };
        })
      );
    } else {
      let sorted_by_shootDate = filterList.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return (
          new Date(a.date_of_shoot).getTime() -
          new Date(b.date_of_shoot).getTime()
        );
      });

      // let sorted_by_time = sorted_by_shootDate.sort(({ time_of_shoot: a }, { time_of_shoot: b }) => a > b ? 1 : a < b ? -1 : 0);
      setFilterList(
        sorted_by_shootDate?.map((element) => {
          return {
            ...element,
            id: element?.id?.toString(),
          };
        })
      );
      setPhotographerJobList(
        sorted_by_shootDate?.map((element) => {
          return {
            ...element,
            id: element?.id?.toString(),
          };
        })
      );
    }
  };

  const reset_filter = (e) => {
    e.preventDefault();
    setToggleLeftArrow(false);
    setToggleRightArrow(false);

    setToggleSortArrow(false);
    setLoading(true);

    clearTimeout(clearLoaderTimeOut);
    let clearLoaderTime = setTimeout(() => {
      setLoading(false);
    }, 2000);
    setClearLoaderTimeOut(clearLoaderTime);

    setFilterList(
      editor_job_list?.map((element) => {

        //below line of code to remove AM and PM from the date
        let am_pm = element?.date_of_upload?.search("AM");
        if (am_pm == -1) {
          var remove_am_pm = element?.date_of_upload?.replace(' PM', '');
        } else {
          var remove_am_pm = element?.date_of_upload?.replace(' AM', '');
        }

        return {
          ...element,
          id: element?.id?.toString(),
          date_of_upload: remove_am_pm
        };
      })
    );
    setPhotographerJobList(
      editor_job_list?.map((element) => {

        //below line of code to remove AM and PM from the date
        let am_pm = element?.date_of_upload?.search("AM");
        if (am_pm == -1) {
          var remove_am_pm = element?.date_of_upload?.replace(' PM', '');
        } else {
          var remove_am_pm = element?.date_of_upload?.replace(' AM', '');
        }

        return {
          ...element,
          id: element?.id?.toString(),
          date_of_upload: remove_am_pm
        };
      })
    );
  };

  //new jobs filter.
  const new_jobs = (e) => {
    e.preventDefault();
    setLoading(true);
    setToggleLeftArrow(false);
    setToggleRightArrow(false);

    setToggleSortArrow(false);

    clearTimeout(clearLoaderTimeOut);
    let clearLoaderTime = setTimeout(() => {
      setLoading(false);
    }, 2000);
    setClearLoaderTimeOut(clearLoaderTime);

    let new_jobs = editor_job_list?.filter(
      (job) => (((job?.in_process === 1 && job?.editor_status === 0) || (job?.in_process === 2 && job?.editor_status === 0) || (job?.in_process === 3 && job?.editor_status === 0) || (job?.in_process === 6 && job?.editor_status === 0)))
    );

    if (new_jobs) {
      setFilterList(
        new_jobs?.map((element) => {

          //below line of code to remove AM and PM from the date
          let am_pm = element?.date_of_upload?.search("AM");
          if (am_pm == -1) {
            var remove_am_pm = element?.date_of_upload?.replace(' PM', '');
          } else {
            var remove_am_pm = element?.date_of_upload?.replace(' AM', '');
          }

          return {
            ...element,
            id: element?.id?.toString(),
            date_of_upload: remove_am_pm
          };
        })
      );

      setPhotographerJobList(
        new_jobs?.map((element) => {

          //below line of code to remove AM and PM from the date
          let am_pm = element?.date_of_upload?.search("AM");
          if (am_pm == -1) {
            var remove_am_pm = element?.date_of_upload?.replace(' PM', '');
          } else {
            var remove_am_pm = element?.date_of_upload?.replace(' AM', '');
          }

          return {
            ...element,
            id: element?.id?.toString(),
            date_of_upload: remove_am_pm
          };
        })
      );
    }
    scrollToBottom();
  };

  //active jobs filter.
  const active_jobs = (e) => {
    e.preventDefault();
    setLoading(true);

    setToggleSortArrow(false);

    clearTimeout(clearLoaderTimeOut);
    let clearLoaderTime = setTimeout(() => {
      setLoading(false);
    }, 2000);
    setClearLoaderTimeOut(clearLoaderTime);

    if (toggleLeftArrow === false) {
      let activeJobs = editor_job_list?.filter(
        (job) => (((job?.in_process === 1 && job?.editor_status === 1) || (job?.in_process === 2 && job?.editor_status === 1) || (job?.in_process === 3 && job?.editor_status === 1) || (job?.in_process === 6 && job?.editor_status === 1)))
      );
      if (activeJobs) {
        setFilterList(
          activeJobs?.map((element) => {

            //below line of code to remove AM and PM from the date
            let am_pm = element?.date_of_upload?.search("AM");
            if (am_pm == -1) {
              var remove_am_pm = element?.date_of_upload?.replace(' PM', '');
            } else {
              var remove_am_pm = element?.date_of_upload?.replace(' AM', '');
            }

            return {
              ...element,
              id: element?.id?.toString(),
              date_of_upload: remove_am_pm
            };
          })
        );

        setPhotographerJobList(
          activeJobs?.map((element) => {

            //below line of code to remove AM and PM from the date
            let am_pm = element?.date_of_upload?.search("AM");
            if (am_pm == -1) {
              var remove_am_pm = element?.date_of_upload?.replace(' PM', '');
            } else {
              var remove_am_pm = element?.date_of_upload?.replace(' AM', '');
            }

            return {
              ...element,
              id: element?.id?.toString(),
              date_of_upload: remove_am_pm
            };
          })
        );
      }
    } else {
      setFilterList(
        editor_job_list?.map((element) => {

          //below line of code to remove AM and PM from the date
          let am_pm = element?.date_of_upload?.search("AM");
          if (am_pm == -1) {
            var remove_am_pm = element?.date_of_upload?.replace(' PM', '');
          } else {
            var remove_am_pm = element?.date_of_upload?.replace(' AM', '');
          }

          return {
            ...element,
            id: element?.id?.toString(),
            date_of_upload: remove_am_pm
          };
        })
      );
      setPhotographerJobList(
        editor_job_list?.map((element) => {

          //below line of code to remove AM and PM from the date
          let am_pm = element?.date_of_upload?.search("AM");
          if (am_pm == -1) {
            var remove_am_pm = element?.date_of_upload?.replace(' PM', '');
          } else {
            var remove_am_pm = element?.date_of_upload?.replace(' AM', '');
          }

          return {
            ...element,
            id: element?.id?.toString(),
            date_of_upload: remove_am_pm
          };
        })
      );
    }
  };

  //previous jobs filter.
  const previous_job_cards = (e) => {
    e.preventDefault();
    setLoading(true);

    setToggleSortArrow(false);

    clearTimeout(clearLoaderTimeOut);
    let clearLoaderTime = setTimeout(() => {
      setLoading(false);
    }, 2000);
    setClearLoaderTimeOut(clearLoaderTime);

    if (toggleRightArrow === false) {
      let previous_job_card = editor_job_list?.filter(
        (job) => (job?.in_process === 5 && job?.is_raise_invoice_editor === 1)
      );
      if (previous_job_card) {
        setFilterList(
          previous_job_card?.map((element) => {

            //below line of code to remove AM and PM from the date
            let am_pm = element?.date_of_upload?.search("AM");
            if (am_pm == -1) {
              var remove_am_pm = element?.date_of_upload?.replace(' PM', '');
            } else {
              var remove_am_pm = element?.date_of_upload?.replace(' AM', '');
            }

            return {
              ...element,
              id: element?.id?.toString(),
              date_of_upload: remove_am_pm
            };
          })
        );

        setPhotographerJobList(
          previous_job_card?.map((element) => {

            //below line of code to remove AM and PM from the date
            let am_pm = element?.date_of_upload?.search("AM");
            if (am_pm == -1) {
              var remove_am_pm = element?.date_of_upload?.replace(' PM', '');
            } else {
              var remove_am_pm = element?.date_of_upload?.replace(' AM', '');
            }


            return {
              ...element,
              id: element?.id?.toString(),
              date_of_upload: remove_am_pm
            };
          })
        );
      }
    } else {
      setFilterList(
        editor_job_list?.map((element) => {

          //below line of code to remove AM and PM from the date
          let am_pm = element?.date_of_upload?.search("AM");
          if (am_pm == -1) {
            var remove_am_pm = element?.date_of_upload?.replace(' PM', '');
          } else {
            var remove_am_pm = element?.date_of_upload?.replace(' AM', '');
          }

          return {
            ...element,
            id: element?.id?.toString(),
            date_of_upload: remove_am_pm
          };
        })
      );
      setPhotographerJobList(
        editor_job_list?.map((element) => {

          //below line of code to remove AM and PM from the date
          let am_pm = element?.date_of_upload?.search("AM");
          if (am_pm == -1) {
            var remove_am_pm = element?.date_of_upload?.replace(' PM', '');
          } else {
            var remove_am_pm = element?.date_of_upload?.replace(' AM', '');
          }

          return {
            ...element,
            id: element?.id?.toString(),
            date_of_upload: remove_am_pm
          };
        })
      );
    }
  };

  return (
    <>
      <section className="dashboard-main-one dashboard-job">
        <Header
          isJob={true}
          logoutFlag={uploadImageLoader}
          langSelector={true}
        />
        <div className="content dashboard-background">
          <div className="cards-section dashboard-sec">
            <div className="row m-0">
              {/*left section start */}
              <div className="col-md-12 col-lg-3 p-0 col-xxl-3 left-card">
                <div className="justify-content-center w-100 h-100">
                  <div className="card border-0 bg-lightwhite p-4 mb-0 font-cabin border-14px w-100 text-center position-relative h-100">
                    <div className="dropdonw position-relative drop-bulltets text-end">
                      <a
                        className=""
                        role="button"
                        id="dropdownMenuLink"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <svg
                          className="toggle-svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12Z"
                            fill="#FF7330"
                          ></path>
                          <path
                            d="M10 6C10 7.10457 10.8954 8 12 8C13.1046 8 14 7.10457 14 6C14 4.89543 13.1046 4 12 4C10.8954 4 10 4.89543 10 6Z"
                            fill="#FF7330"
                          ></path>
                          <path
                            d="M10 18C10 19.1046 10.8954 20 12 20C13.1046 20 14 19.1046 14 18C14 16.8954 13.1046 16 12 16C10.8954 16 10 16.8954 10 18Z"
                            fill="#FF7330"
                          ></path>
                        </svg>
                      </a>
                      <div className="toggle-menu-one">
                        <ul>
                          <li
                            className="cursor-pointer"
                            onClick={(e) => {
                              edit_profile(e);
                            }}
                          >
                            {t("EDIT")}
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="mb-2 pro-img">
                      {userData?.image ? (
                        <img
                          src={`${process.env.REACT_APP_AWS_DSP_AWS_URL}profile_${userData?.id}/${userData?.image}`}
                          alt="profile"
                        />
                      ) : (
                        <span>
                          {userProfileDashBoardData?.first_name
                            ?.split("")[0]
                            ?.toUpperCase()}
                          {userProfileDashBoardData?.last_name
                            ?.split("")[0]
                            ?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <h5 className="font-cabin font-24 m-0">{`${userProfileDashBoardData?.first_name ||
                      user_data?.first_name
                      }${" "}${userProfileDashBoardData?.last_name ||
                      user_data?.last_name
                      }`}</h5>
                    <span className="font-cabin font-16 text-gray">
                      {userData?.position ? userData?.position : "-"}
                    </span>
                    <p className="cname"></p>
                    {userCategoryList?.length > 0 ? (
                      <span className="horizon-line-2"></span>
                    ) : (
                      ""
                    )}
                    <div className="contact-info">
                      <ul className="d-flex p-0 mx-0 mb-30 flex-wrap justify-content-center lists-tags">
                        <li
                          key={0}
                          className="list-style-none mt-5px mx-5px"
                        >
                          <span
                            className={`${(userProfileDashBoardData.editing_suite === "1" || userProfileDashBoardData.editing_suite === "3")
                              ? "btn-tab"
                              : ""
                              } pro_development mb-2 font-cabin w-auto letter-spacing-65 text-uppercase text-black font-11 mb-2`}
                          >
                            {t("PHOTO")}
                          </span>
                        </li>
                        <li
                          key={1}
                          className="list-style-none mt-5px mx-5px"
                        >
                          <span
                            className={`${(userProfileDashBoardData.editing_suite === "2" || userProfileDashBoardData.editing_suite === "3")
                              ? "btn-tab"
                              : ""
                              } pro_development mb-2 font-cabin w-auto letter-spacing-65 text-uppercase text-black font-11 mb-2`}
                          >
                            {t("VIDEO")}
                          </span>
                        </li>
                      </ul>
                      <div className="contact-info-one contact">
                        <h6>{t("CONTACT_NUMBER")}</h6>
                        {
                          userProfileDashBoardData?.mobile ? <a
                            href={`tel:${userProfileDashBoardData?.mobile}`}
                          >{`${userProfileDashBoardData?.mobile}`}</a> : "-"
                        }

                      </div>
                      <div className="contact-info-one email">
                        <h6>{t("EMAIL")}</h6>
                        {
                          userProfileDashBoardData?.email ? <a
                            href={`mailto:${userProfileDashBoardData?.email}`}
                          >{`${userProfileDashBoardData?.email}`}</a> : ""
                        }

                      </div>
                      <div className="contact-info-one link">
                        <h6>{t("WEBSITE")}</h6>
                        {
                          userProfileDashBoardData?.work_email ? <a
                            target="_blank"
                            className="active"
                            href={show_reel_link}
                          >{`${userProfileDashBoardData?.work_email}`}</a> : ""
                        }

                      </div>
                    </div>

                    <span className="horizon-line-2 mb-30"></span>

                    <div className="team-name mb-30">
                      <h3 className="team-title">
                        <Moment format="MMMM YYYY">{new Date()}</Moment>
                      </h3>
                      <div className="name-lable">
                      </div>
                    </div>

                    <span className="horizon-line-2 mb-30"></span>

                    <div className="team-name need-support">
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
              </div>
              {/*left section end */}

              {/*right section start */}
              <div className="col-md-12 col-lg-9 from-table-calender  col-xx-9">
                {/*top section start */}
                <div className="hello-block col-12  bg-lightwhite border-14px place-order d-flex flex-wrap align-items-center justify-content-center">
                  <div className="col-sm-6 pe-2">
                    <h2>
                      {t("HELLO")},{" "}
                      {`${userProfileDashBoardData?.first_name ||
                        user_data?.first_name
                        }`}
                    </h2>
                    <p>{t("ACCESS_YOUR_PAST_ORDER")}</p>
                  </div>
                  <div className="col-sm-6 text-end count-one">
                    {newJobCount > 0 ? (
                      <div className="job-number">
                        <h1
                          className="cursor-pointer"
                          onClick={(e) => {
                            new_jobs(e);
                          }}
                        >
                          {newJobCount}
                        </h1>
                        <p>{t("NEW_JOB")}</p>
                      </div>
                    ) : (
                      <div className="job-number">
                        <h1
                          className="cursor-pointer"
                          onClick={(e) => {
                            new_jobs(e);
                          }}
                        >
                          0
                        </h1>
                        <p>{t("NEW_JOB")}</p>
                      </div>
                    )}
                  </div>
                </div>
                {/*top section end */}

                {/*middle section filter start */}
                <div className="job-card d-flex d-flex flex-wrap justify-content-between">
                  <div
                    onClick={(e) => {
                      active_jobs(e);
                      setToggleLeftArrow(!toggleLeftArrow);
                      setToggleRightArrow(false);
                    }}
                    className="job green-border bg-lightwhite border-14px d-flex justify-content-between align-items-center cursor-pointer"
                  >
                    <div className="job-number">
                      <h1>{activeCount}</h1>
                      <p>{t("ACTIVE_JOBS")}</p>
                    </div>
                    <div className="job-arrow">
                      <a className={`${toggleLeftArrow ? "arrow-down" : ""}`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="15"
                          viewBox="0 0 24 15"
                          fill="none"
                        >
                          <path
                            d="M22.5737 1.0625L12.4972 12.9375L1.301 1.0625"
                            stroke="#353535"
                            strokeWidth="2"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>

                  <div
                    onClick={(e) => {
                      previous_job_cards(e);
                      setToggleRightArrow(!toggleRightArrow);
                      setToggleLeftArrow(false);
                    }}
                    className="job orange-border  bg-lightwhite border-14px p-5 d-flex justify-content-between align-items-center cursor-pointer"
                  >
                    <div className="job-number">
                      <h1>{previousJobCardCount}</h1>
                      <p>{t("PREVIOUS_JOB_CARD")}</p>
                    </div>
                    <div className="job-arrow">
                      <a className={`${toggleRightArrow ? "arrow-d" : ""}`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="15"
                          viewBox="0 0 24 15"
                          fill="none"
                        >
                          <path
                            d="M22.5737 1.0625L12.4972 12.9375L1.301 1.0625"
                            stroke="#353535"
                            strokeWidth="2"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                {/*middle section filter end */}

                {/*bottom section listing start */}
                <div className="job-card-list">
                  {/*search filter start */}
                  <section className="form-section">
                    <div>
                      <form className="search_all h-50px">
                        <div className="dropdown h-50px">
                          <div className="input-group h-100 position-relative">
                            <button
                              onClick={(e) => {
                                reset_filter(e);
                              }}
                              className="label-all h-100 font-cabin input-group-text bg-lightwhite border-0 border-end-1"
                              type="button"
                              id="basic-addon1"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              {t("ALL")}
                              <svg
                                className="ml-2"
                                width="8"
                                height="4"
                                viewBox="0 0 8 4"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4.21053 4L8 0H0.421053L4.21053 4Z"
                                  fill="#353535"
                                ></path>
                              </svg>
                            </button>
                            <input
                              onChange={(e) => {
                                setSearch(e.target.value);
                              }}
                              type="text"
                              className="bg-lightwhite rounded-end h-100 form-control border-0 border-left"
                              placeholder="Search something"
                              aria-label="Username"
                              aria-describedby="basic-addon1"
                            />
                            <img
                              src={iconsearch}
                              className="position-absolute"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </section>
                  {/*search filter end */}

                  {/*job listing start */}
                  <div className="card card-table border-0 bg-lightwhite border-14px p-0">
                    <div className="row m-0">
                      <div className="table-responsive job_cards_table">
                        <table className="table-width m-0 p-0">
                          <tbody className="position-relative">
                            <tr className="border-0">
                              <th
                                width="189px"
                                className="font-cabin font-10 text-gray"
                              >
                                {t("JOBS_CARDS")}
                              </th>
                              <th
                                width="187px"
                                className="font-cabin font-10 text-gray"
                              >
                                {t("CATEGORY")}
                              </th>
                              <th
                                onClick={(e) => {
                                  sortBy_shooting_date(e);
                                }}
                                width="187px"
                                className={`font-cabin font-10 text-gray cursor-pointer ${toggleSortArrow ? "arrow-down-two" : ""
                                  }`}
                              >
                                {" "}
                                {t("UPLOAD_DATE_AND_TIME")}{" "}
                                <span>
                                  <svg
                                    width="24px"
                                    height="24px"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M3.43558 11.4939C3.16282 11.1822 3.1944 10.7083 3.50613 10.4356L11.5061 3.43557C11.7889 3.18814 12.2111 3.18814 12.4939 3.43557L20.4939 10.4356C20.8056 10.7083 20.8372 11.1822 20.5644 11.4939C20.2917 11.8056 19.8179 11.8372 19.5061 11.5644L12.75 5.65283L12.75 20C12.75 20.4142 12.4142 20.75 12 20.75C11.5858 20.75 11.25 20.4142 11.25 20L11.25 5.65283L4.49389 11.5644C4.18216 11.8372 3.70834 11.8056 3.43558 11.4939Z"
                                      fill="#91908E"
                                    />
                                  </svg>
                                </span>{" "}
                              </th>
                              <th
                                width="200px"
                                className="font-cabin font-10 text-gray text-center"
                              >
                                {t("ACTION")}
                              </th>
                            </tr>
                            {loading ? (
                              <tr className="spin-parent">
                                <td className="spin-child">
                                  <span
                                    className="spinner-border text-dark"
                                    role="status"
                                  >
                                    <span className="sr-only">Loading...</span>
                                  </span>
                                </td>
                              </tr>
                            ) : photographerJobList?.length > 0 ? (
                              filterList?.map((photographerJob, index) => {
                                return (
                                  <tr
                                    key={index}
                                    className="table_row_card border-0"
                                  >
                                    <td
                                      onClick={(e) => {
                                        jobDetail(e, photographerJob);
                                      }}
                                      className={`position-relative rounded-start first-column cursor-pointer ${((photographerJob?.in_process === 1 && photographerJob?.editor_status === 1)
                                        || (photographerJob?.in_process === 2 && photographerJob?.editor_status === 1)
                                        || (photographerJob?.in_process === 3 && photographerJob?.editor_status === 1)
                                        || (photographerJob?.in_process === 6 && photographerJob?.editor_status === 1)
                                        || (photographerJob?.in_process === 0 && photographerJob?.editor_status === 1))
                                        ? "dark-green-left-border-production"
                                        : photographerJob?.in_process === 4
                                          ? "red-left-border-rejected"
                                          : (photographerJob?.in_process === 5 && photographerJob?.is_raise_invoice_editor === 1)
                                            ? "black-left-border-completed"
                                            : photographerJob?.in_process === 7
                                              ? "orange-left-border-on-review"
                                              : (photographerJob?.in_process === 5  && photographerJob?.is_raise_invoice_editor === 0)
                                              ? "orange-left-border-on-review"
                                              : "orange-left-border-on-review"
                                        } font-14 border-left-radius`}
                                    >
                                      <span className="blue">
                                        {((photographerJob?.in_process === 1 && photographerJob?.editor_status === 1)
                                          || (photographerJob?.in_process === 2 && photographerJob?.editor_status === 1)
                                          || (photographerJob?.in_process === 3 && photographerJob?.editor_status === 1)
                                          || (photographerJob?.in_process === 6 && photographerJob?.editor_status === 1)
                                          || (photographerJob?.in_process === 0 && photographerJob?.editor_status === 1))
                                          ? "Post Production"
                                          : photographerJob?.in_process === 4
                                            ? "Rejected"
                                            : (photographerJob?.in_process === 5  && photographerJob?.is_raise_invoice_editor === 1)
                                              ? "Completed"
                                              : photographerJob?.in_process === 7
                                                ? "In Review"
                                                : (photographerJob?.in_process === 5  && photographerJob?.is_raise_invoice_editor === 0)
                                                ? "In Review"
                                                : "New"}
                                      </span>
                                      {`${photographerJob?.job_card_number
                                        ? photographerJob?.job_card_number
                                        : "-"
                                        }`}
                                    </td>
                                    <td
                                      onClick={(e) => {
                                        jobDetail(e, photographerJob);
                                      }}
                                      className="cursor-pointer"
                                    >
                                      <span className="category-data">
                                        {photographerJob?.category_short_form
                                          ? photographerJob?.category_short_form
                                          : "-"}
                                      </span>
                                    </td>
                                    <td
                                      onClick={(e) => {
                                        jobDetail(e, photographerJob);
                                      }}
                                      className="cursor-pointer"
                                    >
                                      <span
                                        className={`date-table d-flex flex-column ${((photographerJob?.in_process === 1 && photographerJob?.editor_status === 1)
                                          || (photographerJob?.in_process === 2 && photographerJob?.editor_status === 1)
                                          || (photographerJob?.in_process === 3 && photographerJob?.editor_status === 1)
                                          || (photographerJob?.in_process === 6 && photographerJob?.editor_status === 1)
                                          || (photographerJob?.in_process === 0 && photographerJob?.editor_status === 1))
                                          ? "dark-green"
                                          : photographerJob?.in_process === 4
                                            ? "red"
                                            : (photographerJob?.in_process === 5  && photographerJob?.is_raise_invoice_editor === 1)
                                              ? "black"
                                              : photographerJob?.in_process === 7
                                                ? "orange"
                                                : (photographerJob?.in_process === 5  && photographerJob?.is_raise_invoice_editor === 0)
                                                ? "orange"
                                                : "orange"
                                          }`}
                                      >
                                        <span
                                          className={`mb-1 ${((photographerJob?.in_process === 1 && photographerJob?.editor_status === 1)
                                            || (photographerJob?.in_process === 2 && photographerJob?.editor_status === 1)
                                            || (photographerJob?.in_process === 3 && photographerJob?.editor_status === 1)
                                            || (photographerJob?.in_process === 6 && photographerJob?.editor_status === 1)
                                            || (photographerJob?.in_process === 0 && photographerJob?.editor_status === 1))
                                            ? "dark-green"
                                            : photographerJob?.in_process === 4
                                              ? "red"
                                              : (photographerJob?.in_process === 5  && photographerJob?.is_raise_invoice_editor === 1)
                                                ? "black"
                                                : photographerJob?.in_process === 7
                                                  ? "orange"
                                                  : (photographerJob?.in_process === 5  && photographerJob?.is_raise_invoice_editor === 0)
                                                  ? "orange"
                                                  : "orange"
                                            }`}
                                        >
                                          <Moment format="D MMM YYYY">
                                            {photographerJob?.date_of_upload}
                                          </Moment>
                                        </span>
                                        <span className="time-one">
                                          <Moment format="hh:mm A">
                                            {photographerJob?.date_of_upload}
                                          </Moment>
                                        </span>
                                      </span>
                                    </td>

                                    <td className="border-right-radius">
                                      <span className="product-brief">
                                        <div
                                          className={`btn-wrap-block ${photographerJob?.photographer_accept ===
                                            "1" ||
                                            photographerJob?.in_process === "2"
                                            ? "d-block text-center"
                                            : ""
                                            } `}
                                        >
                                          <a
                                            onClick={(e) => {
                                              jobDetail(e, photographerJob);
                                            }}
                                            className="primary cursor-pointer"
                                          >
                                            {t("VIEW")}
                                          </a>
                                        </div>
                                      </span>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr className="job-dashboard-table-raw justify-content-center">
                                <td colSpan="6">{t("NO_JOB_FOUND")}</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  {/*job listing end */}
                  
                </div>
                {/*bottom section listing end */}
              </div>
              {/*right section start */}
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
};

export default JobDashboard;
