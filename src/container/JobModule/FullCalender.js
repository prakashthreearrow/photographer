import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import $ from "jquery";
import Moment from 'moment';
// import Moment from "react-moment";
import "react-datepicker/dist/react-datepicker.css";
import { Footer } from "../../component/CommonComponent";
import leftArrowIcon from "../../assets/images/leftArrowIcon.svg";
import { getLocalStorageItem, url } from "../../utils/helper";
import Header from "../../component/layout/Header";
import { getPhotographerJob } from "../../redux/action";

const Calender = () => {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState(new Date());
  const [dateArray, setDateArray] = useState([]);
  const [toggleSortArrow, setToggleSortArrow] = useState(false);
  const [filterList, setFilterList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [clearLoaderTimeOut, setClearLoaderTimeOut] = useState(0);

  const photographer_job_list = useSelector(
    (state) => state?.getPhotographerJob?.photoGrapherJob
  );
  const [photographerJobList, setPhotographerJobList] = useState(
    photographer_job_list
  );

  const dispatch = useDispatch();
  const history = useHistory();

  const userProfileData = useSelector(
    (state) => state?.UserProfile?.userProfile
  );
  let userData = JSON.parse(getLocalStorageItem("userData"));

  useEffect(async () => {
    let user_profile_id = userData?.id || userProfileData?.id;
    let photographer_job = {
      photographer_id: user_profile_id,
    };

    dispatch(
      getPhotographerJob({
        photographer_job,
        callback: async (data) => {
          if (data?.jobs) {
            let arrayDate = data?.jobs
              ?.filter((date) => date?.in_process !== 5)
              .filter((date) => date?.in_process !== 4)
              .map((dateFormat) => {
                return ({
                  title: dateFormat?.job_card_number,
                  date: new Date(dateFormat?.date_of_delivery),
                  classNames: dateFormat?.in_process === 1 ? "background-dark-green" : dateFormat?.in_process === 2 ? "background-light-green" :
                    dateFormat?.in_process === 3 ? "background-orange" : dateFormat?.in_process === 4 ? "background-red" :
                      dateFormat?.in_process === 5 ? "background-black" : dateFormat?.in_process === 6 ? "background-purple" : "background-orange",
                  url: dateFormat?.id
                })
              });
            setDateArray(arrayDate);
          }
        },
      })
    );

    return () => {
      setDateArray([]);
      setPhotographerJobList([]);
      setDateArray([]);
    }
  }, []);

  const sortBy_shooting_date = (e) => {
    e.preventDefault();
    // setToggleLeftArrow(false);
    // setToggleRightArrow(false);
    setToggleSortArrow(!toggleSortArrow);
    setLoading(true);

    clearTimeout(clearLoaderTimeOut);
    let clearLoaderTime = setTimeout(() => {
      setLoading(false);
    }, 2000);
    setClearLoaderTimeOut(clearLoaderTime);

    let year = startDate.getFullYear();
    let month = startDate.getMonth() + 1;
    let date = startDate.getDate();
    let digitFormatDate = date.toString().length === 1 ? "0" + date : date;

    let formatedDate = year + "-" + month + "-" + digitFormatDate;

    if (toggleSortArrow) {
      setFilterList(
        photographer_job_list?.filter(
          (element) => element?.date_of_delivery === formatedDate
        )
      );
      setPhotographerJobList(
        photographer_job_list?.filter(
          (element) => element?.date_of_delivery === formatedDate
        )
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

  const jobDetail = (e, job) => {
    e.preventDefault();
    history.push({
      pathname: `/job-detail/${job?.id}`,
      jobDetail: job,
    });
  };

  const onChange = (dates) => {
    // const [start, end] = dates;
    let year = dates.getFullYear();
    let month = dates.getMonth() + 1;
    let date = dates.getDate();
    let digitFormatDate = date.toString().length === 1 ? "0" + date : date;
    let digitFormatMonth = month.toString().length === 1 ? "0" + month : month;

    let formatedDate = year + "-" + digitFormatMonth + "-" + digitFormatDate;

    setStartDate(dates);

    setFilterList(
      photographer_job_list?.filter(
        (element) => element?.date_of_delivery === formatedDate
      )
    );
    setPhotographerJobList(
      photographer_job_list?.filter(
        (element) => element?.date_of_delivery === formatedDate
      )
    );
  };

  $(document).ready(function () {

  });

  function renderEventContent(eventInfo) {
    eventInfo.jsEvent.preventDefault();
    history.push({
      pathname: `/job-detail/${eventInfo.event.url}`
    });
  }

  return (
    <>
      <section className="dashboard-main-one position-relative file-set job-detail dashboard-job">
        <Header isJob={true} langSelector={true} logoutFlag={false} />
        <div className="content dashboard-background">
          <img
            onClick={() => history.push("/dashboard")}
            src={leftArrowIcon}
            className="sm:ps-5 arrow arrow-left cursor-pointer"
            alt="logo"
          />
          <div className="cards-section dashboard-sec intro-card date-picker-custom mt-4">
            <div className="row m-0">
              <div className="col-md-12 intro-card-right " id="calendar">
                {/* <h3 className="calender-title"> {t("CALENDAR")}</h3> */}
                <FullCalendar
                   themeSystem="bootstrap4"
                   businessHours={false}
                   weekNumbers={true}
                   nowIndicator={true}
                   fixedWeekCount={false}
                   views={{
                     timeGridPlugin: {
                       dayMaxEventRows: 2
                     }
                   }}
               
                   plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                   headerToolbar={{
                     right: 'button',
                     left: 'title,prev,next',
                     center: 'dayGridMonth,timeGridWeek,timeGridDay,today',
                   }}
                   events={dateArray}
                   displayEventTime={false}
                   eventClick={(e) => { renderEventContent(e) }}
                />
              </div>
              {filterList?.length > 0 ? <div className="table-responsive job_cards_table">
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
                        {t("SHOOTING_DATE")}{" "}
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
                        width="210px"
                        className="font-cabin font-10 text-gray"
                      >
                        {t("SHOOT_ADDRESS")}
                      </th>

                      <th
                        width="126px"
                        className="font-cabin font-10 text-gray"
                      >
                        {t("SUBMISSION_DUE_DATE")}
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
                          <tr key={index} className="table_row_card border-0">
                            <td
                              onClick={(e) => {
                                jobDetail(e, photographerJob);
                              }}
                              className={`position-relative rounded-start first-column cursor-pointer ${photographerJob?.in_process === 1
                                ? "dark-green-left-border-production"
                                : photographerJob?.in_process === 2
                                  ? "light-green-left-border-post-production"
                                  : photographerJob?.in_process === 3
                                    ? "orange-left-border-on-review"
                                    : photographerJob?.in_process === 4
                                      ? "red-left-border-rejected"
                                      : photographerJob?.in_process === 5
                                        ? "black-left-border-completed"
                                        : photographerJob?.in_process === 6
                                          ? "purple-left-border-completed"
                                          : "orange-left-border-on-review"
                                } font-14 border-left-radius`}
                            >
                              <span className="blue">
                                {photographerJob?.in_process === 1
                                  ? "Active Shoot"
                                  : photographerJob?.in_process === 2
                                    ? "Post Production"
                                    : photographerJob?.in_process === 3
                                      ? "In Review"
                                      : photographerJob?.in_process === 4
                                        ? "Rejected"
                                        : photographerJob?.in_process === 5
                                          ? "Completed"
                                          : photographerJob?.in_process === 6
                                            ? "Re-upload requested"
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
                                className={`date-table d-flex flex-column ${photographerJob?.in_process === 1
                                  ? "dark-green"
                                  : photographerJob?.in_process === 2
                                    ? "light-green"
                                    : photographerJob?.in_process === 3
                                      ? "orange"
                                      : photographerJob?.in_process === 4
                                        ? "red"
                                        : photographerJob?.in_process === 5
                                          ? "black"
                                          : photographerJob?.in_process === 6
                                            ? "purple"
                                            : "orange"
                                  }`}
                              >
                                <span
                                  className={`mb-1 ${photographerJob?.in_process === 1
                                    ? "dark-green "
                                    : photographerJob?.in_process === 2
                                      ? "light-green"
                                      : photographerJob?.in_process === 3
                                        ? "orange"
                                        : photographerJob?.in_process === 4
                                          ? "red"
                                          : photographerJob?.in_process === 5
                                            ? "black"
                                            : photographerJob?.in_process === 6
                                              ? "purple"
                                              : "orange"
                                    }`}
                                >
                                  <Moment format="D MMM YYYY">
                                    {photographerJob?.date_of_shoot}
                                  </Moment>
                                </span>
                                <span className="time-one">
                                  {photographerJob?.time_of_shoot ? (
                                    <Moment format="hh:mm A">
                                      {photographerJob?.date_of_shoot}
                                    </Moment>
                                  ) : (
                                    "-"
                                  )}
                                </span>
                              </span>
                            </td>
                            <td
                              onClick={(e) => {
                                jobDetail(e, photographerJob);
                              }}
                              className="cursor-pointer"
                            >
                              <span className="company_address">
                                {photographerJob?.project_location
                                  ? photographerJob?.project_location
                                  : "-"}{" "}
                              </span>
                            </td>

                            <td
                              onClick={(e) => {
                                jobDetail(e, photographerJob);
                              }}
                              className="cursor-pointer"
                            >
                              <span className="product-brief">
                                {photographerJob?.date_of_delivery
                                  ? photographerJob?.date_of_delivery
                                  : "-"}
                              </span>
                            </td>
                            <td className="border-right-radius">
                              <span className="product-brief">
                                <div
                                  className={`btn-wrap-block ${photographerJob?.photographer_accept ===
                                    "1" || photographerJob?.in_process === "2"
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
                      <tr className="job-dashboard-table-raw td-full">
                        <td colSpan="6">{t("NO_JOB_FOUND")}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div> : ""}

            </div>
          </div>
          <div className="mt-5">
            <Footer />
          </div>
        </div>
      </section>
    </>
  );
};

export default Calender;
