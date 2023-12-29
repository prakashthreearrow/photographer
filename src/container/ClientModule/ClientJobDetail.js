import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import $ from "jquery";
import { toast } from "react-toastify";
import Moment from 'react-moment';
import { Footer, Textarea, Button } from "../../component/CommonComponent";
import { ErrorToast } from "../../utils/helper";
import { getLocalStorageItem } from "../../utils/helper";
import { imagesType, acceptPhotographerJob, getJobDetail, rejectPhotographerJob } from "../../redux/action";
import leftArrowIcon from "../../assets/images/leftArrowIcon.svg";
import Header from "../../component/layout/Header";
import Map from "../JobModule/Map";
import validateReason from "../../validation/JobModule/rejectReason";
window.Buffer = window.Buffer || require("buffer").Buffer;

const JobDetail = () => {
    const { t } = useTranslation();
    const { job_detail_id } = useParams();
    var fileExtensionVideo = ["MP4", "mp4", "MPEG", "mpeg", "MOV", "mov"];

    let userData = JSON.parse(getLocalStorageItem("userData"));
    let placeAnOrderArray = JSON.parse(getLocalStorageItem("placeAnOrder"));
    let placeAnOrderArrayCount = JSON.parse(getLocalStorageItem("editOrder"));
    var orderCount = 0;
    if(placeAnOrderArrayCount?.editing?.length > 0){
        orderCount = 1;
    }else{
        orderCount = 0;
    }
    if(placeAnOrderArray?.length > 0){
        orderCount = orderCount + placeAnOrderArray?.length;
    }
    let user_id = JSON.parse(getLocalStorageItem("userId"));

    const [form, setForm] = useState({
        reason: ""
    });

    const [uploadImageLoader, setUploadImageLoader] = useState(false);
    const [count, setCount] = useState(0);
    const [imageArrayCount, setImageArrayCount] = useState([]);
    const [imageArray, setImageArray] = useState([]);
    const [userProfileDashBoardData, setUserProfileDashBoard] = useState(userData);
    const [jobDetail, setJobDetail] = useState(null);
    const [job_id, setJob_id] = useState(null);
    const [isPublishOpen, setPublishOpen] = useState(false);
    const [error, setError] = useState({});
    const [statusProgress, setStatusProgress] = useState([]);

    const history = useHistory();
    const dispatch = useDispatch();

    const user_data = useSelector((state) => state?.Login?.userData);

    const job_detail = useSelector((state) => state?.GetJobDetail?.jobDetail);

    let user_profile_id = user_id || userProfileDashBoardData?.id || userData?.id || user_data?.id

    useEffect(() =>{
        if(jobDetail?.in_process === 1){
            setStatusProgress([1])
        }else if(jobDetail?.in_process === 3 || jobDetail?.in_process === 6){
            setStatusProgress([1, 2])
        }else if(jobDetail?.in_process === 2 || jobDetail?.in_process === 7){
            setStatusProgress([1, 2, 3,])
        }else if(jobDetail?.in_process === 5){
            setStatusProgress([1, 2, 3, 4])
        }

    },[jobDetail, jobDetail?.in_process])

    useEffect(() => {
        let job_id = parseInt(job_detail_id);
        dispatch(getJobDetail({
            job_id, callback: async (data) => {
                if (data) {
                    if (data?.code === 200) {
                        if (data?.data[0]?.client_user_id !== user_profile_id) {
                          toast.error(<ErrorToast msg="Job does not exist." />);
                          history.push({
                            pathname: "/dashboard",
                          });
                        } else {
                          setJobDetail(data?.data[0]);
                        }
                      } else if (data?.code === 400) {
                        toast.error(<ErrorToast msg="Job does not exist." />);
                        history.push({
                          pathname: "/dashboard",
                        });
                      }
                    let getImageListPayload = {
                        user_profile_id: user_profile_id,
                        job_id: parseInt(data?.id)
                    }
                    dispatch(imagesType({
                        getImageListPayload, callback: async (result) => {
                            if (result) {
                                let arrayMap = result?.map((ele) => ele?.image_name);
                                let removeDuplicateImageName = [...new Set(arrayMap)];
                                setImageArray(removeDuplicateImageName);
                            }
                        }
                    }));
                }
            }
        }));
    }, [count])

    useEffect(() => {
        if ((count > 0) && (count === imageArrayCount?.length)) {
            let accept_photographer_job = {
                job_id: parseInt(job_detail_id),
                photographer_status: "1",
                in_process: 3,
                type_id: 3,
                reason: ""
            }
            dispatch(acceptPhotographerJob({
                accept_photographer_job, callback: async (data) => {
                    if (data) {
                        setJobDetail(data?.data[0]);
                    }
                }
            }));
            setUploadImageLoader(false);
        }

    }, [count]);

    useEffect(() => {
        if (getLocalStorageItem("token") && getLocalStorageItem("userData")) {
            if (userData?.roles[0]?.id === 5) {
                if (userData?.is_profile_completed === 1) {
                    history.push(`/dashboard`);
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
                    history.push(`/client-job-detail/${job_detail_id}`);
                } else {
                    history.push("/sign-up-client");
                }
            }else if (userData?.roles[0]?.id === 6) {
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
            setCount(0); // This worked for me
          };
    }, [jobDetail?.id]);
   
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

    const onSubmitReason = (e) => {
        e.preventDefault();
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
                        setJob_id(data?.data[0]?.id);
                        setJobDetail(data?.data?.find(job => job?.id === jobDetail?.id));
                    }
                }
            }));
        } else {
            setError(errors);
        }
    }

    $(document).ready(function () {
        var ctx = document.createElement("canvas").getContext("2d");
        var img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
            ctx.fillText("COPYRIGHT", 10, 30);
        };
    });

    return (
        <>
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
            <section className="dashboard-main-one position-relative file-set job-detail dashboard-job">
                {uploadImageLoader ? <div className="file-upload">
                    <div className="file-upload-inner">
                        <p>{t("PLEASE_DO_NOT_RELOAD")}</p>
                    </div>
                </div> : ""}
                <Header logoutFlag={uploadImageLoader} isJob={true} langSelector={false} orderCount={orderCount} client={true}/>
                <div className="content dashboard-background">
                    <img onClick={() => history.push("/dashboard")} src={leftArrowIcon} className="sm:ps-5 arrow arrow-left cursor-pointer" alt="logo" />
                    <div className="cards-section dashboard-sec intro-card">
                        <div className="row m-0">
                            <div className="col-md-12 intro-card-right">
                                <div className="row m-0">
                                    <div className="col-md-12 col-lg-12 col-xxl-12 upload-media">
                                        <div className="upload-media-inner d-flex flex-wrap justify-content-between">
                                            <div className="job-detail-left">
                                                <h3 className="fs-3 upload-media-title">{false ? `${t("PHOTO_FROM_PRODUCTION")} (${imageArray?.length})` : "Track Your Order Here"}</h3>

                                                {false ? <div className={`upload-media-cards ${imageArray?.length > 16 ? "img-scroll" : " "}`}>
                                                    <div className={`${imageArray?.length > 0 ? 'upload-media-cards-one' : "upload-media-body-text-center"}`}>
                                                        {imageArray?.length > 0 ? imageArray?.map((image, index) => {
                                                            if (fileExtensionVideo?.includes(image?.split(".")[1])) {
                                                                return (<div key={index} className="media-one">
                                                                    <video src={`${process.env.REACT_APP_AWS_DSP_AWS_URL}job_${jobDetail?.id}/RAW/${image}`} controls >
                                                                    </video>
                                                                </div>)
                                                            } else {
                                                                return (<div key={index} className="media-one">
                                                                    <img id="images" src={`${process.env.REACT_APP_AWS_DSP_AWS_URL}job_${jobDetail?.id}/${image}`} alt="images" />

                                                                </div>)
                                                            }

                                                        }) : <><div><p>{t("UPLOAD_MEDIA_BODY_DESC_1")}</p><p>{t("UPLOAD_MEDIA_BODY_DESC_2")}</p><p>{t("UPLOAD_MEDIA_BODY_DESC_3")}</p></div></>}
                                                    </div>
                                                </div> : <div className="job-progress">
                                                    <ul className="steps">
                                                        <li className={`${statusProgress?.includes(1) ? "step--complete" : "step--incomplete"} step`}>
                                                            <span className="step__icon"></span>
                                                            <span className="step__label">In Process Production</span>
                                                        </li>
                                                        <li className={`${statusProgress?.includes(1) && statusProgress?.includes(2) ? "step--complete" : "step--incomplete"} step step--inactive`}>
                                                            <span className="step__icon"></span>
                                                            <span className="step__label">In Process Review</span>
                                                        </li>
                                                        <li className={`${(statusProgress?.includes(1) && statusProgress?.includes(2)) && statusProgress?.includes(3) ? "step--complete" : "step--incomplete"} step step--inactive`}>
                                                            <span className="step__icon"></span>
                                                            <span className="step__label">In Process Post Production</span>
                                                        </li>
                                                        <li className={`${(statusProgress?.includes(1) && statusProgress?.includes(2)) && (statusProgress?.includes(3) && statusProgress?.includes(4)) ? "step--complete" : "step--incomplete"} step step--inactive`}>
                                                            <span className="step__icon"></span>
                                                            <span className="step__label">Completed</span>
                                                        </li>
                                                    </ul>

                                                </div>}
                                            </div>
                                            <div className={`job-detail-right bg-lightwhite border-14px ${jobDetail?.in_process === 1 ? "dark-green-left-border-production" : jobDetail?.in_process === 2 ? "light-green-left-border-post-production" : jobDetail?.in_process === 3 ? "orange-left-border-on-review" : jobDetail?.in_process === 4 ? "red-left-border-rejected" : jobDetail?.in_process === 5 ? "black-left-border-completed" : (jobDetail?.in_process === 6 || jobDetail?.in_process === "6") ? "purple-left-border-completed" : jobDetail?.in_process === 7 ? "orange-left-border-on-review" : "orange-left-border-on-review"}`}>
                                                <div className="photo-head">
                                                    <h3>
                                                        <span>{jobDetail?.in_process === 1 ? "Active Shoot" : jobDetail?.in_process === 2 ? "Post Production" : jobDetail?.in_process === 3 ? "In Review" : jobDetail?.in_process === 4 ? "Rejected" : jobDetail?.in_process === 5 ? "Completed" : (jobDetail?.in_process === 6 || jobDetail?.in_process === "6") ? "Re-upload requested" : jobDetail?.in_process === 7 ? "In Process Post Production Review" : "New"}</span>
                                                        {jobDetail?.job_card_number} 
                                                    </h3>
                                                </div>
                                                <div className="photo-btn">
                                                    <a className="gray-btn">{jobDetail?.category_name}</a>
                                                    <div className="job-profile d-flex flex-wrap  align-items-center">
                                                        {jobDetail?.producer_profile_image ? <img src={`${process.env.REACT_APP_AWS_DSP_AWS_URL}profile_${jobDetail?.producer_id}/${jobDetail?.producer_profile_image}`} alt="profile" /> : <span>{jobDetail?.producer_name?.split("")[0]}</span>}
                                                        <div>
                                                            <h3 className="post-name">{jobDetail?.producer_name}</h3>
                                                            <p className="post">{t("PRODUCER")}</p>
                                                        </div>
                                                    </div>
                                                    <div className="mb-3 contact-producer d-flex flex-wrap justify-content-between align-items-center">
                                                        <a className="gray-btn" href={`mailto:${jobDetail?.producer_contact}`}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                            <path d="M1.16699 3.49967C1.16699 2.85534 1.68933 2.33301 2.33366 2.33301H11.667C12.3113 2.33301 12.8337 2.85534 12.8337 3.49967V10.4997C12.8337 11.144 12.3113 11.6663 11.667 11.6663H2.33366C1.68933 11.6663 1.16699 11.144 1.16699 10.4997V3.49967ZM3.2195 3.49967L7.00033 6.80789L10.7811 3.49967H3.2195ZM11.667 4.27479L7.38445 8.02201C7.16452 8.21445 6.83613 8.21445 6.6162 8.02201L2.33366 4.27479V10.4997H11.667V4.27479Z" fill="#353535" />
                                                        </svg>{t("CONTACT_PRODUCER")}</a>
                                                        <a className="orange-btn" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="18" viewBox="0 0 22 18" fill="none">
                                                            <path d="M18.463 2.57573C17.7758 1.82597 16.5346 1.77977 15.7073 2.60711L7.6073 10.7071C7.39783 10.9166 7.39783 11.1834 7.6073 11.3929C7.81678 11.6024 8.08361 11.6024 8.29309 11.3929L14.9931 4.6929C15.3836 4.30238 16.0168 4.30238 16.4073 4.6929C16.7978 5.08342 16.7978 5.71659 16.4073 6.10711L9.7073 12.8071C8.71678 13.7976 7.18361 13.7976 6.19309 12.8071C5.20256 11.8166 5.20256 10.2834 6.19309 9.2929L14.2931 1.1929C15.8606 -0.374632 18.408 -0.425638 19.9225 1.20821C21.4748 2.77662 21.5205 5.31157 19.8931 6.82133L10.4073 16.3071C8.21678 18.4976 4.78361 18.4976 2.59309 16.3071C0.402564 14.1166 0.402564 10.6834 2.59309 8.4929L10.6931 0.3929C11.0836 0.00237539 11.7168 0.00237539 12.1073 0.3929C12.4978 0.783424 12.4978 1.41659 12.1073 1.80711L4.0073 9.90711C2.59783 11.3166 2.59783 13.4834 4.0073 14.8929C5.41678 16.3024 7.58361 16.3024 8.99309 14.8929L18.4931 5.3929C18.5033 5.38266 18.5138 5.37264 18.5245 5.36285C19.2742 4.67557 19.3204 3.43446 18.4931 2.60711C18.4828 2.59687 18.4728 2.58641 18.463 2.57573Z" fill="#FF7330" />
                                                        </svg>STYLE BOOK</a>
                                                    </div>
                                                    <div className="job-right-body">
                                                        <p className="post">{t("SHOOTING_DATE")}</p>
                                                        <h3 className="post-name"> <Moment format="D MMM YYYY">{jobDetail?.date_of_shoot}</Moment><span className="mx-3"><Moment format="hh:mm A">{jobDetail?.date_of_shoot}</Moment></span></h3>
                                                        <p className="post">{t("CLIENT")}</p>
                                                        <h3 className="post-name">{jobDetail?.client_name}</h3>
                                                        <p className="pcname">{jobDetail?.name_of_project}</p>
                                                        <p className="post">{t("SHOOT_ADDRESS")}</p>
                                                        <h3 className="post-name">{jobDetail?.project_location}</h3>
                                                        <Map latitude={job_detail?.project_location_lat} longitude={job_detail?.project_location_long} address={jobDetail?.project_location} />                               
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5"><Footer /></div>
                </div>
            </section>
        </>
    );
};

export default JobDetail;