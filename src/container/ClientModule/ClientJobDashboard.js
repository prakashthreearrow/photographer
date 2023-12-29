import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import $ from "jquery";
import { useTranslation } from 'react-i18next';
import Moment from 'react-moment';
import { Footer, Button, Textarea } from "../../component/CommonComponent";
import { getLocalStorageItem } from "../../utils/helper";
import profile_pic from "../../assets/images/profile.png";
import iconsearch from "../../assets/images/iconsearch.png";
import iconclose from "../../assets/images/close-icon.png";
import flagchil from "../../assets/images/Chile.png";
import visualimg from "../../assets/images/visual-img.png";
import Header from "../../component/layout/Header";
import { getTeamMember, getClientJob, rejectPhotographerJob, getClientDetail, deleteTeamMember } from "../../redux/action";
import validateReason from "../../validation/JobModule/rejectReason";

const JobDashboard = () => {

    const { t } = useTranslation();
    const mountedRef = useRef(true);
    let userData = JSON.parse(getLocalStorageItem("userData"));
    let placeAnOrderCount = JSON.parse(getLocalStorageItem("placeAnOrder"));
    let placeAnOrderArray = JSON.parse(getLocalStorageItem("editOrder"));
    var orderCount = 0;
    if (placeAnOrderArray?.editing?.length > 0) {
        orderCount = 1;
    } else {
        orderCount = 0;
    }
    if (placeAnOrderCount?.length > 0) {
        orderCount = orderCount + placeAnOrderCount?.length;
    }

    const [form, setForm] = useState({
        reason: ""
    });

    const client_job_list = useSelector((state) => state?.GetClientJob?.clientJob);

    const [error, setError] = useState({});
    const [userCategoryList, setUserCategoryList] = useState([]);
    const [uploadImageLoader, setUploadImageLoader] = useState(false);
    const [userProfileDashBoardData, setUserProfileDashBoard] = useState(userData);
    const [photographerJobList, setPhotographerJobList] = useState(client_job_list?.clients);
    const [filterList, setFilterList] = useState([]);
    const [search, setSearch] = useState("");
    const [toggleLeftArrow, setToggleLeftArrow] = useState(false);
    const [toggleSortArrow, setToggleSortArrow] = useState(false);
    const [toggleRightArrow, setToggleRightArrow] = useState(false);
    const [activeCount, setActiveCount] = useState(0);
    const [previousJobCardCount, setPreviousJobCardCount] = useState(0);
    const [isPublishOpen, setPublishOpen] = useState(false);
    const [isDeleteTeamOpen, setIsDeleteTeamOpen] = useState(false);
    const [job_id, setJob_id] = useState(null);
    const [loading, setLoading] = useState(false);
    const [clearLoaderTimeOut, setClearLoaderTimeOut] = useState(0);
    const [teamMemberTags, setTeamMemberTags] = useState([]);
    const [deleteTeamEmail, setDeleteTeamEmail] = useState(0);
    const [teamID, setTeamID] = useState(null);
    const [teamLoader, setTeamLoader] = useState(null);

    const history = useHistory();
    const dispatch = useDispatch();

    const user_data = useSelector((state) => state?.Login?.userData);

    let show_reel = userProfileDashBoardData?.work_email?.split("/")[0]
    let show_reel_link = `${show_reel === "https:" || show_reel === "http:" ? userProfileDashBoardData?.work_email : `https://${userProfileDashBoardData?.work_email}`}`

    const jobDetail = (e, job) => {
        e.preventDefault();
        history.push({
            pathname: `/client-job-detail/${job?.id}`,
            jobDetail: job
        });

    }

    const edit_profile = (e, job) => {
        e.preventDefault();
        history.push({
            pathname: '/client-edit-profile',
        });

    }

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

        if (toggleSortArrow) {
            setFilterList(client_job_list?.clients?.map((element) => {
                return ({
                    ...element,
                    id: element?.id?.toString(),
                })
            }));
            setPhotographerJobList(client_job_list?.clients?.map((element) => {
                return ({
                    ...element,
                    id: element?.id?.toString(),
                })
            }));
        } else {
            let sorted_by_shootDate = filterList.sort(function (a, b) {
                // Turn your strings into dates, and then subtract them
                // to get a value that is either negative, positive, or zero.
                return new Date(a.date_of_shoot).getTime() - new Date(b.date_of_shoot).getTime();
            });

            setFilterList(sorted_by_shootDate?.map((element) => {
                return ({
                    ...element,
                    id: element?.id?.toString(),
                })
            }));
            setPhotographerJobList(sorted_by_shootDate?.map((element) => {
                return ({
                    ...element,
                    id: element?.id?.toString(),
                })
            }));
        }

    }

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

        setFilterList(client_job_list?.clients?.map((element) => {
            return ({
                ...element,
                id: element?.id?.toString(),
            })
        }));
        setPhotographerJobList(client_job_list?.clients?.map((element) => {
            return ({
                ...element,
                id: element?.id?.toString(),
            })
        }));
    }

    const active_shoots = (e) => {
        e.preventDefault();
        setLoading(true);

        setToggleSortArrow(false);

        clearTimeout(clearLoaderTimeOut);
        let clearLoaderTime = setTimeout(() => {
            setLoading(false);
        }, 2000);
        setClearLoaderTimeOut(clearLoaderTime);

        if (toggleLeftArrow === false) {
            let activeShoot = client_job_list?.clients?.filter(job => ((job?.in_process === 1) || (job?.in_process === 2) || (job?.in_process === 3)));
            if (activeShoot) {
                setFilterList(activeShoot?.map((element) => {
                    return ({
                        ...element,
                        id: element?.id?.toString(),
                    })
                }));
            }
        } else {
            setFilterList(client_job_list?.clients?.map((element) => {
                return ({
                    ...element,
                    id: element?.id?.toString(),
                })
            }));
        }
    }

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
            let previous_job_card = client_job_list?.clients?.filter(job => (job?.in_process === 5));
            if (previous_job_card) {
                setFilterList(previous_job_card?.map((element) => {
                    return ({
                        ...element,
                        id: element?.id?.toString(),
                    })
                }));
            }
        } else {
            setFilterList(client_job_list?.clients?.map((element) => {
                return ({
                    ...element,
                    id: element?.id?.toString(),
                })
            }));
        }
    }

    useEffect(() => {
        let userData = JSON.parse(getLocalStorageItem("userData"));
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

        return () => { mountedRef.current = false }
    }, []);

    useEffect(() => {
        $(document).ready(function () {
            $(".toggle-svg").click(function () {
                $(".toggle-menu-one").slideToggle();
            });
        });

        return () => { mountedRef.current = false }
    }, []);

    //get team member
    useEffect(() => {
        let user_profile_id = userData?.id || user_data?.id;
        dispatch(getTeamMember({
            user_profile_id,
            callback: (data) => {
                setTeamMemberTags(data?.user);
            }
        }));

        return () => { mountedRef.current = false }
    }, [deleteTeamEmail]);

    useEffect(() => {
        let client_profile_id = userData?.client_id || user_data?.client_id;
        setLoading(true);
        if (search?.length === 0) {
            dispatch(getClientDetail({ client_profile_id }));
            let client_job = {
                client_id: userData?.client_id
            }
            dispatch(getClientJob({
                client_job, callback: async (data) => {

                    setLoading(false);
                    if (data?.clients) {
                        setPhotographerJobList(data?.clients.map((element) => {
                            return ({
                                ...element,
                                id: element?.id?.toString(),
                            })
                        }));
                        setFilterList(data?.clients.map((element) => {
                            return ({
                                ...element,
                                id: element?.id?.toString(),
                            })
                        }));
                    }
                }
            }));
        }

        return () => { mountedRef.current = false }
    }, [job_id]);

    useEffect(() => {
        if (search) {
            let filter = photographerJobList?.filter(elemet => {
                return ((elemet?.id?.indexOf(search) > -1) || (elemet?.category_short_form?.toLowerCase().indexOf(search) > -1) || (elemet?.project_location?.toLowerCase().indexOf(search) > -1) || (elemet?.date_of_shoot?.indexOf(search) > -1) || (elemet?.date_of_delivery?.indexOf(search) > -1))
            });
            setFilterList(filter);
        }

        return () => { mountedRef.current = false }
    }, [search]);

    useEffect(() => {
        let activeShoot = client_job_list?.clients?.filter(job => ((job?.in_process === 1) || (job?.in_process === 2) || (job?.in_process === 3)));
        let count1 = (activeShoot !== undefined && activeShoot.length > 0) ? activeShoot.length : 0
        setActiveCount(count1);

        let previous_job_card = client_job_list?.clients?.filter(job => (job?.in_process === 5));
        let count2 = (previous_job_card !== undefined && previous_job_card?.length > 0) ? previous_job_card?.length : 0
        setPreviousJobCardCount(count2);

        return () => { mountedRef.current = false }
    }, [JSON.stringify(client_job_list)]);

    const deleteTeam = (e, team) => {
        e.preventDefault();
        setIsDeleteTeamOpen(true);
        setTeamID(team?.id);
    }

    const deleteTeamMemberOfClient = () => {
        setIsDeleteTeamOpen(true);
        setTeamLoader(true);
        let team_member_id = teamID;
        dispatch(deleteTeamMember({
            team_member_id,
            callback: (data) => {
                localStorage.setItem("userData", JSON.stringify(data?.data?.user));
                setTeamLoader(false);
                setIsDeleteTeamOpen(false);
                setDeleteTeamEmail(deleteTeamEmail + 1);
            }
        }));
    }

    const onSubmitReason = (e) => {
        e.preventDefault();
        setLoading(true);
        const { errors, isValid } = validateReason(form);

        if (isValid) {
            window.scrollTo(0, 0);
            setPublishOpen(false);
            let reject_photographer_job = {
                job_id: parseInt(job_id),
                photographer_status: "2",
                in_process: 4,
                type_id: 4,
                reason: form?.reason
            }
            dispatch(rejectPhotographerJob({
                reject_photographer_job, callback: async (data) => {
                    if (data) {
                        setLoading(false);
                        setJob_id(data?.data[0]?.id);
                        setPhotographerJobList(data?.data?.map((element) => {
                            return ({
                                ...element,
                                id: element?.id?.toString(),
                            })
                        }));
                        setFilterList(data?.data?.map((element) => {
                            return ({
                                ...element,
                                id: element?.id?.toString(),
                            })
                        }));
                    }
                }
            }));
        } else {
            setError(errors);
        }

    }

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
            {isDeleteTeamOpen && (
                <div
                    className={`modal fade ${isDeleteTeamOpen ? "show d-block bg-blur" : "d-none"
                        }`}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content p-3">
                            <div className="modal-header bg-red border-bottom-0">
                                <h5 className="modal-title"></h5>
                                <i
                                    className="fa fa-close cursor-pointer"
                                    onClick={() => setIsDeleteTeamOpen(false)}
                                />
                            </div>
                            <div className="modal-body">
                                <div className="row justify-content-center">
                                    <div className="col-11 text-center">
                                        {teamLoader ? <span className="spinner-border text-dark mb-3 spinner-color" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </span> : ""}
                                        <h5>Are you sure to delete?</h5>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-11 text-center">
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer d-flex justify-content-center">
                                <Button
                                    text="NO"
                                    className="model-button-width"
                                    onClick={() => setIsDeleteTeamOpen(false)}
                                />
                                <Button
                                    text="yes"
                                    className="model-button-width text-uppercase"
                                    onClick={(e) => deleteTeamMemberOfClient(e)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isPublishOpen && (
                <div
                    className={`modal fade ${isPublishOpen ? "show d-block bg-blur" : "d-none"
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
                                <div className="row justify-content-center">
                                    <div className="col-11 text-center">
                                        <span className="reason-popup">{t("REJECTED")}</span>
                                        <h5>{t("REASON_FOR_REJECTION")}?</h5>
                                    </div>
                                </div>
                                <div className="row justify-content-center">
                                    <div className="col-11 text-center">
                                        <Textarea
                                            name="reason"
                                            value={form?.reason}
                                            onChange={(e) => { changeHandler(e) }}
                                            error={error?.reason}
                                            label={t("ENTER_REASON")}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer d-flex justify-content-center">
                                <Button
                                    text={t("SAVE")}
                                    className="model-button-width text-uppercase"
                                    onClick={(e) => onSubmitReason(e)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <section className="dashboard-main-one dashboard-job client-dashboard">
                <Header isJob={true} langSelector={false} logoutFlag={uploadImageLoader} orderCount={orderCount} client={true} />
                <div className="content dashboard-background">
                    <div className="cards-section dashboard-sec">
                        <div className="row m-0">
                            <div className="col-md-12 col-lg-3 p-0 col-xxl-3 left-card">
                                <div className="justify-content-center w-100 h-100">
                                    <div className="card border-0 bg-lightwhite p-4 mb-0 font-cabin border-14px w-100 text-center position-relative h-100">
                                        <div className="dropdonw position-relative drop-bulltets text-end">
                                            <a className="" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                                <svg className="toggle-svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12Z" fill="#FF7330"></path>
                                                    <path d="M10 6C10 7.10457 10.8954 8 12 8C13.1046 8 14 7.10457 14 6C14 4.89543 13.1046 4 12 4C10.8954 4 10 4.89543 10 6Z" fill="#FF7330"></path>
                                                    <path d="M10 18C10 19.1046 10.8954 20 12 20C13.1046 20 14 19.1046 14 18C14 16.8954 13.1046 16 12 16C10.8954 16 10 16.8954 10 18Z" fill="#FF7330"></path>
                                                </svg>
                                            </a>
                                            <div className="toggle-menu-one">
                                                <ul>
                                                    <li className="cursor-pointer" onClick={(e) => { edit_profile(e) }}>{t("EDIT")}</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="mb-2 pro-img">{userData?.image ? <img src={`${process.env.REACT_APP_AWS_DSP_AWS_URL}profile_${userData?.id}/${userData?.image}`} alt="profile" /> : (userData?.first_name && userData?.last_name) ? <span>{userProfileDashBoardData?.first_name?.split("")[0]?.toUpperCase()}{userProfileDashBoardData?.last_name?.split("")[0]?.toUpperCase()}</span> : <img src={profile_pic} alt="profile" />}</div>
                                        <h5 className="font-cabin font-24 m-0">{`${userProfileDashBoardData?.first_name || user_data?.first_name}${' '}${userProfileDashBoardData?.last_name || user_data?.last_name}`}</h5>
                                        <span className="font-cabin font-16 text-gray">{(userData?.parent_id === null || userData?.parent_id === undefined) ? userData?.is_not_part_of_company === 0 ? userData?.clients?.company_name : "" : userData?.is_not_part_of_company === 0 ? userData?.company_name : ""}</span>
                                        <span className="font-cabin font-16 text-gray">{(userData?.parent_id === null || userData?.parent_id === undefined) ? userData?.clients?.position : userData?.position}</span>
                                        <p className="cname"></p>
                                        {userCategoryList?.length > 0 ? <span className="horizon-line-2"></span> : ""}
                                        <div className="contact-info">
                                            <div className="contact-info-one contact">
                                                <h6>{t("CONTACT_NUMBER")}</h6>
                                                {
                                                    userProfileDashBoardData?.mobile ? <a href={`tel:${userProfileDashBoardData?.mobile}`}>{`${userProfileDashBoardData?.mobile}`}</a> :
                                                       "-"
                                                }
                                            </div>
                                            <div className="contact-info-one email">
                                                <h6>{t("EMAIL")}</h6>
                                                {
                                                    userProfileDashBoardData?.email ? <a href={`mailto:${userProfileDashBoardData?.email}`}>{`${userProfileDashBoardData?.email}`}</a> :
                                                        ""
                                                }
                                            </div>
                                            {
                                                userProfileDashBoardData?.work_email ? <div className="contact-info-one link">
                                                    <h6>Showreel</h6>
                                                    {userProfileDashBoardData?.work_email ? <a target="_blank" className="" href={show_reel_link}>{`${userProfileDashBoardData?.work_email}`}</a> : "-"}

                                                </div> : ""
                                            }
                                        </div>
                                        {(userData?.parent_id === null || userData?.parent_id === undefined) ? <span className="horizon-line-2 mb-30"></span> : ""}
                                        {(userData?.parent_id === null || userData?.parent_id === undefined) ? <div className="team-name mb-30">
                                            <h3 className="team-title">Team Member</h3>
                                            <div className="name-lable">
                                                <ul className="name-btn">
                                                    {teamMemberTags?.map((team, index) => {
                                                        return (
                                                            <li key={index}><a>{(team?.first_name === null || team?.last_name === null) ? team?.email : team?.first_name + " " + team?.last_name}<span onClick={(e) => { deleteTeam(e, team) }} className="cursor-pointer"><img src={iconclose} alt="close-icon" /></span></a></li>
                                                        )
                                                    })}
                                                </ul>
                                            </div>
                                        </div> : ""}
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
                                                        <a href="tel:+34 683 16 53 70">+34 683 16 53 70</a>
                                                    </li>
                                                    <li>
                                                        <div className="flag">
                                                            <img src={flagchil} alt="chil" />
                                                            <p>{t("CHILI")}</p>
                                                        </div>
                                                        <a href="tel:+56 9 2199 5961">+56 9 2199 5961</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 col-lg-9 from-table-calender  col-xx-9">
                                <div className="hello-block col-12  bg-lightwhite border-14px place-order d-flex flex-wrap align-items-center justify-content-center">
                                    <div className="col-sm-6 pe-2">
                                        <h2>{t("HELLO")}, {`${userProfileDashBoardData?.first_name || user_data?.first_name}`}</h2>
                                        <p>{t("CLIENT_DASHBOARD_TITLE")}</p>
                                    </div>
                                    <div className="col-sm-6 text-end count-one">
                                        <a onClick={() => history.push("/place-an-order")} className="order-btn orange-btn">{t("PLACE_AN_ORDER")}</a>
                                    </div>
                                </div>
                                <div className="job-card d-flex d-flex flex-wrap justify-content-between">
                                    <div onClick={(e) => {
                                        active_shoots(e);
                                        setToggleLeftArrow(!toggleLeftArrow);
                                        setToggleRightArrow(false);
                                    }} className="job green-border  bg-lightwhite border-14px d-flex justify-content-between align-items-center cursor-pointer">
                                        <div className="job-number">
                                            <h1>{activeCount}</h1>
                                            <p>{t("CRON_JOB_CARDS")}</p>
                                        </div>
                                        <div className="job-arrow">
                                            <a className={`${toggleLeftArrow ? "arrow-down" : ""}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="15" viewBox="0 0 24 15" fill="none">
                                                <path d="M22.5737 1.0625L12.4972 12.9375L1.301 1.0625" stroke="#353535" strokeWidth="2" />
                                            </svg></a>
                                        </div>
                                    </div>
                                    <div onClick={(e) => {
                                        previous_job_cards(e);
                                        setToggleRightArrow(!toggleRightArrow);
                                        setToggleLeftArrow(false);
                                    }} className="job orange-border  bg-lightwhite border-14px p-5 d-flex justify-content-between align-items-center cursor-pointer">
                                        <div className="job-number">
                                            <h1>{previousJobCardCount}</h1>
                                            <p>{t("PREVIOUS_JOB_CARD")}</p>
                                        </div>
                                        <div className="job-arrow">
                                            <a className={`${toggleRightArrow ? "arrow-d" : ""}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="15" viewBox="0 0 24 15" fill="none">
                                                <path d="M22.5737 1.0625L12.4972 12.9375L1.301 1.0625" stroke="#353535" strokeWidth="2" />
                                            </svg></a>
                                        </div>
                                    </div>
                                </div>
                                {photographerJobList?.length > 0 ? <div className="job-card-list">
                                    <section className="form-section">
                                        <div>
                                            <form className="search_all h-50px">
                                                <div className="dropdown h-50px">
                                                    <div className="input-group h-100 position-relative">
                                                        <button onClick={(e) => { reset_filter(e) }} className="label-all h-100 font-cabin input-group-text bg-lightwhite border-0 border-end-1" type="button" id="basic-addon1" data-bs-toggle="dropdown" aria-expanded="false">{t("ALL")}
                                                            <svg className="ml-2" width="8" height="4" viewBox="0 0 8 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M4.21053 4L8 0H0.421053L4.21053 4Z" fill="#353535"></path>
                                                            </svg>
                                                        </button>
                                                        <input onChange={(e) => { setSearch(e.target.value) }} type="text" className="bg-lightwhite rounded-end h-100 form-control border-0 border-left" placeholder="Search something" aria-label="Username" aria-describedby="basic-addon1" />
                                                        <img src={iconsearch} className="position-absolute" />
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </section>
                                    <div className="card card-table border-0 bg-lightwhite border-14px p-0">
                                        <div className="row m-0">
                                            <div className="table-responsive job_cards_table">
                                                <table className="table-width m-0 p-0">
                                                    <tbody className="position-relative">
                                                        <tr className="border-0">
                                                            <th width="189px" className="font-cabin font-10 text-gray">{t("JOBS_CARDS")}</th>
                                                            <th width="187px" className="font-cabin font-10 text-gray">{t("CATEGORY")}</th>
                                                            <th onClick={(e) => { sortBy_shooting_date(e) }} width="187px" className={`font-cabin font-10 text-gray cursor-pointer ${toggleSortArrow ? "arrow-down-two" : ""}`}> {t("SHOOTING_DATE")} <span><svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M3.43558 11.4939C3.16282 11.1822 3.1944 10.7083 3.50613 10.4356L11.5061 3.43557C11.7889 3.18814 12.2111 3.18814 12.4939 3.43557L20.4939 10.4356C20.8056 10.7083 20.8372 11.1822 20.5644 11.4939C20.2917 11.8056 19.8179 11.8372 19.5061 11.5644L12.75 5.65283L12.75 20C12.75 20.4142 12.4142 20.75 12 20.75C11.5858 20.75 11.25 20.4142 11.25 20L11.25 5.65283L4.49389 11.5644C4.18216 11.8372 3.70834 11.8056 3.43558 11.4939Z" fill="#91908E" />
                                                            </svg></span> </th>
                                                            <th width="210px" className="font-cabin font-10 text-gray">{t("SHOOT_ADDRESS")}</th>

                                                            <th width="126px" className="font-cabin font-10 text-gray">{t("SUBMISSION_DUE_DATE")}</th>
                                                            <th width="200px" className="font-cabin font-10 text-gray text-center">{t("ACTION")}</th>
                                                        </tr>
                                                        {loading ? <tr className="spin-parent"><td className="spin-child"><span className="spinner-border text-dark" role="status">
                                                            <span className="sr-only">Loading...</span>
                                                        </span></td></tr> : filterList?.length > 0 ? (
                                                            filterList?.map((photographerJob, index) => {
                                                                return (
                                                                    <tr key={index} className="table_row_card border-0">
                                                                        <td onClick={(e) => { jobDetail(e, photographerJob) }} className={`position-relative rounded-start first-column cursor-pointer ${photographerJob?.in_process === 1 ? "dark-green-left-border-production" : photographerJob?.in_process === 2 ? "light-green-left-border-post-production" : photographerJob?.in_process === 3 ? "orange-left-border-on-review" : photographerJob?.in_process === 4 ? "red-left-border-rejected" : photographerJob?.in_process === 5 ? "black-left-border-completed" : photographerJob?.in_process === 6 ? "purple-left-border-completed" : photographerJob?.in_process === 7 ? "orange-left-border-on-review" : "orange-left-border-on-review"} font-14 border-left-radius`}><span className="blue">{photographerJob?.in_process === 1 ? "Active Shoot" : photographerJob?.in_process === 2 ? "Post Production" : photographerJob?.in_process === 3 ? "In Review" : photographerJob?.in_process === 4 ? "Rejected" : photographerJob?.in_process === 5 ? "Completed" : photographerJob?.in_process === 6 ? "Re-upload requested" : photographerJob?.in_process === 7 ? "In Process Post Production Review" : "New"}</span>{`${photographerJob?.job_card_number ? photographerJob?.job_card_number : "-"}`}</td>
                                                                        <td onClick={(e) => { jobDetail(e, photographerJob) }} className="cursor-pointer"><span className="category-data">{photographerJob?.category_short_form ? photographerJob?.category_short_form : "-"}</span></td>
                                                                        <td onClick={(e) => { jobDetail(e, photographerJob) }} className="cursor-pointer"><span className={`date-table d-flex flex-column ${photographerJob?.in_process === 1 ? "dark-green" : photographerJob?.in_process === 2 ? "light-green" : photographerJob?.in_process === 3 ? "orange" : photographerJob?.in_process === 4 ? "red" : photographerJob?.in_process === 5 ? "black" : photographerJob?.in_process === 6 ? "purple" : photographerJob?.in_process === 7 ? "orange" : "orange"}`}><span className={`mb-1 ${photographerJob?.in_process === 1 ? "dark-green " : photographerJob?.in_process === 2 ? "light-green" : photographerJob?.in_process === 3 ? "orange" : photographerJob?.in_process === 4 ? "red" : photographerJob?.in_process === 5 ? "black" : photographerJob?.in_process === 6 ? "purple" : "orange"}`}>
                                                                            <Moment format="D MMM YYYY">
                                                                                {photographerJob?.date_of_shoot}
                                                                            </Moment>
                                                                        </span><span className="time-one ">{photographerJob?.time_of_shoot ? <Moment format="hh:mm A">
                                                                            {photographerJob?.date_of_shoot}
                                                                        </Moment> : "-"}</span></span></td>
                                                                        <td onClick={(e) => { jobDetail(e, photographerJob) }} className="cursor-pointer"><span className="company_address">{photographerJob?.project_location ? photographerJob?.project_location : "-"} </span></td>

                                                                        <td onClick={(e) => { jobDetail(e, photographerJob) }} className="cursor-pointer text-center"><span className="product-brief">{photographerJob?.date_of_delivery ? photographerJob?.date_of_delivery : "-"}</span></td>
                                                                        <td className="border-right-radius"><span className="product-brief">
                                                                            <div className={`btn-wrap-block`}>
                                                                                <a onClick={(e) => { jobDetail(e, photographerJob) }} className="primary cursor-pointer">{t("VIEW")}</a> </div></span></td>
                                                                    </tr>
                                                                )
                                                            })
                                                        ) : (
                                                            <tr className="job-dashboard-table-raw">
                                                                <td colSpan="6">{t("NO_JOB_FOUND")}</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div> : <div className="visual-section">
                                    <div className="visual-section-inner">
                                        <img src={visualimg} alt="img" />
                                        <a>order your first visual now</a>
                                    </div>
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </section>
        </>
    );
};

export default JobDashboard;