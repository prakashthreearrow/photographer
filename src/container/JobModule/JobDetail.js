import React, { useCallback, useEffect, useRef, useState } from "react";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../../node_modules/bootstrap/dist/js/bootstrap.min.js";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import $ from "jquery";
import { Player, ControlBar } from "video-react";
import swal from "sweetalert";
import { toast } from "react-toastify";
import Tus from "@uppy/tus";
import Uppy from "@uppy/core";
import { Dashboard, useUppy } from "@uppy/react";
import { Footer, Textarea, Button } from "../../component/CommonComponent";
import {
  getLocalStorageItem,
  SuccessToast,
  ErrorToast,
  url,
} from "../../utils/helper";
import {
  imagesType,
  acceptPhotographerJob,
  getJobDetail,
  rejectPhotographerJob,
  requestReUpload,
  deleteRawImage,
  getJobDetailPreset,
  acceptRaiseOrderJob,
  getPhotographerProductionAdditionalMedia,
} from "../../redux/action";
import leftArrowIcon from "../../assets/images/leftArrowIcon.svg";
import Header from "../../component/layout/Header";
import searchMap from "../../assets/images/search-map.png";
import Map from "./Map";
import dropImg from "../../assets/images/drop-img.png";
import validateReason from "../../validation/JobModule/rejectReason";
import SliderModal from "./SliderModal";
window.Buffer = window.Buffer || require("buffer").Buffer;

const JobDetail = () => {
  const { t } = useTranslation();
  const { job_detail_id } = useParams();

  var fileExtensionVideo = ["MP4", "mp4", "MPEG", "mpeg", "MOV", "mov"];
  var fileExtensionVideoValidation = [
    "mp4",
    "mpeg",
    "mov",
    "webm",
    "mkv",
    "flv",
    "vob",
    "ogv",
    "ogg",
    "drc",
    "gif",
    "gifv",
    "mng",
    "avi",
    "mov",
    "qt",
    "wmv",
    "yuv",
    "rm",
    "rmvb",
    "viv",
    "asf",
    "amv",
    "m4p",
    "m4v",
    "mpg",
    "mp2",
    "mpe",
    "mpv",
    "m2v",
    "m4v",
    "svi",
    "3gp",
    "3g2",
    "mxf",
    "roq",
    "nsv",
    "f4v",
    "f4p",
    "f4a",
    "f4b",
    "cr2",
    "arw",
    "nef",
    "cdr",
    "cr3",
    "dng",
    "raf",
  ];
  let userData = JSON.parse(getLocalStorageItem("userData"));
  let user_id = JSON.parse(getLocalStorageItem("userId"));
  let size = new Array(4, 3, 3, 1);

  const [form, setForm] = useState({
    reason: "",
  });

  const [tabViews, setTabViews] = useState([
    { title: "customer_details", isActive: false, isActiveGreen: false },
    { title: "project_details", isActive: false, isActiveGreen: false },
    { title: "production_brief", isActive: false, isActiveGreen: false },
    { title: "production_media", isActive: false, isActiveGreen: false },
    {
      title: "billing_details",
      isActive: false,
      isActiveGreen: false,
      isActiveBody: false,
    },
  ]);

  const [uploadImageLoader, setUploadImageLoader] = useState(false);
  const [mediaLoaderFlag, setMediaLoaderFlag] = useState(true);

  const [jobDetailCount, setJobDetailCount] = useState(0);
  const [imageArray, setImageArray] = useState([]);
  const [imageArrayTemporary, setImageArrayTemporary] = useState([]);
  const [imageProductionAdditionalArray, setImageProductionAdditionalArray] =
    useState([]);
  const [userProfileDashBoardData, setUserProfileDashBoard] =
    useState(userData);
  const [jobDetail, setJobDetail] = useState(null);
  const [job_id, setJob_id] = useState(null);
  const [isPublishOpen, setPublishOpen] = useState(false);
  const [isUppyOpen, setIsUppyOpen] = useState(false);
  const [error, setError] = useState({});
  const [imageLinkOpen, setImageLinkOpen] = useState(false);
  const [imageLinkMessage, setImageLinkMessage] = useState("");
  const [fileFlag, setFileFlag] = useState(false);
  const [uppyExtention, setUppyExtention] = useState([]);
  const [uppyAnchorProductionBriefFlag, setUppyAnchorProductionBriefFlag] =
    useState(false);
  const [uppyAnchorProductionMediaFlag, setUppyAnchorProductionMediaFlag] =
    useState(false);
    const [uppyAnchorProductionMediaFlagTemporary, setUppyAnchorProductionMediaFlagTemporary] =
    useState(false);
  const [afterReloadActiveTab, setAfterReloadActiveTab] = useState(false);
  const [invoiceButtonDisableFlag, setInvoiceButtonDisableFlag] =
    useState(false);
  const [imageArrayCallOnce, setImageArrayCallOnce] = useState(true);
  const [totalImagesAdditionalProduction, setTotalImagesAdditionalProduction] =
    useState(0);
  const [totalImages, setTotalImage] = useState(0);
  const [currPage, setCurrPage] = useState(1);
  const [prevPage, setPrevPage] = useState(0);
  const [lastList, setLastList] = useState(true);
  const [isOpenSliderModal, setIsOpenSliderModal] = useState(false);

  const [scrollTab, setScrollTab] = useState("1");

  const onScrollRef = useRef();

  const history = useHistory();
  const dispatch = useDispatch();

  const user_data = useSelector((state) => state?.Login?.userData);

  const job_detail = useSelector((state) => state?.GetJobDetail?.jobDetail);
  const job_detail_preset = useSelector(
    (state) => state?.GetJobDetailPreset?.jobDetailPreset
  );

  let user_profile_id =
    user_id || userProfileDashBoardData?.id || userData?.id || user_data?.id;
  let show_reel = userProfileDashBoardData?.work_email?.split("/")[0];
  let show_reel_link = `${
    show_reel === "https:" || show_reel === "http:"
      ? userProfileDashBoardData?.work_email
      : `https://${userProfileDashBoardData?.work_email}`
  }`;

  useEffect(async () => {
    if (job_detail_id) {
      let job_id = parseInt(job_detail_id);
      dispatch(
        getJobDetailPreset({
          job_id,
        })
      );
      defaultApiCall();
    }
  }, [jobDetail?.in_process, jobDetail?.photographer_accept]);

  useEffect(() => {
    if (getLocalStorageItem("token") && getLocalStorageItem("userData")) {
      if (userData?.roles[0]?.id === 5) {
        if (userData?.is_profile_completed === 1) {
          history.push(`/job-detail/${job_detail_id}`);
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
          }
        }
      } else if (userData?.roles[0]?.id === 7) {
        if (userData?.is_profile_completed === 1) {
          history.push("/dashboard");
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
  }, [job_detail?.id]);

  useEffect(() => {
    if (uppyExtention?.length > 0) {
      uppyExtention?.map((extention) => {
        if (fileExtensionVideoValidation?.includes(extention)) {
          setFileFlag(true);
        }
      });
    }
  }, [uppyExtention]);

  const uppy = useUppy(() => {
    return new Uppy({
      showRemoveButtonAfterComplete: true,
      showProgressDetails: true,
      restrictions: {
        allowedFileTypes: [
          ".CR2",
          ".cr2",
          ".ARW",
          ".arw",
          ".NEF",
          ".nef",
          ".CDR",
          ".cdr",
          ".cr3",
          ".CR3",
          ".dng",
          ".DNG",
          ".raf",
          ".RAF",
          ".MP4",
          ".mp4",
          ".MPEG",
          ".mpeg",
          ".MOV",
          ".mov",
        ],
      },
      onBeforeUpload: (files) => {
        for (var key in files) {
          var obj = files[key];
          for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
              if (prop === "data") {
                setUploadImageLoader(true);
                var inobj = obj[prop];
                inobj.id = obj["id"];
                // arrayObj?.push(inobj);
              }
            } else {
         
            }
          }
        }
        uppyApi();
      },
      onBeforeFileAdded: (files) => {
        if (files) {
          setUppyExtention((prevCompanies) => {
            return [...prevCompanies, files?.extension?.toLowerCase()];
          });
        }
      },
      meta: {
        user_id: user_profile_id,
        job_id: parseInt(job_detail_id),
      },
    });
  });

  const uppyApi = () => {
    uppy
      .use(Tus, {
        // endpoint: `https://medas.acquaintsoft.com/api/photographer-upload`,
        // endpoint: 'https://tusd.tusdemo.net/files/',
        endpoint: `${url}photographer-upload`,
        headers: {
          authorization: `Bearer ${getLocalStorageItem("token")}`,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
        },
        removeFingerprintOnSuccess: true,
      })
      .on("complete", async (result) => {
        if (result.failed.length > 0) {
          result.failed.forEach((file) => {
            console.error("file.error", file.error);
          });
        }
        return false;
      });
  };

  //delete individual file
  uppy.on("file-removed", (file, reason) => {
    const items = uppy.getFiles();
    if (items?.length === 0) {
      setUppyExtention([]);
      setFileFlag(false);
    }

    if (reason === "removed-by-user") {
      let imageUploaded = {
        user_id: user_profile_id,
        image_name: file?.name,
      };
      dispatch(
        deleteRawImage({
          imageUploaded,
        })
      );
      // sendDeleteRequestForFile(file)
    }
  });

  const tabSwitch = (e, tab) => {
    e.preventDefault();
    setCurrPage(1);
    setTotalImage(0);
    setPrevPage(0);
    setLastList(true);

    setImageArray([]);
    setImageProductionAdditionalArray([]);
    const filterTabList = tabViews.map((el) =>
      el.title === tab ? { ...el, isActive: true } : { ...el, isActive: false }
    );
    setTabViews(filterTabList);
  };

  const defaultApiCall = () => {
 
    const job_id = parseInt(job_detail_id);
    dispatch(
      getJobDetail({
        job_id,
        callback: async (data) => {
          if (data) {
            setUploadImageLoader(false);

            if (data?.code === 200) {
              if (data?.data[0]?.photographer_id !== user_profile_id) {
                toast.error(<ErrorToast msg="Job does not exist." />);
                history.push({
                  pathname: "/dashboard",
                });
              } else {
                setJobDetail(data?.data[0]);

                if (
                  data?.data[0]?.in_process === 2 ||
                  data?.data[0]?.in_process === 5 ||
                  data?.data[0]?.in_process === 7
                ) {
                  const filterTabList = tabViews.map((el) =>
                    el.title === "billing_details"
                      ? {
                          ...el,
                          isActiveGreen: true,
                          isActiveBody: true,
                          isActive: true,
                        }
                      : {
                          ...el,
                          isActive: false,
                          isActiveGreen: false,
                        }
                  );
                  setTabViews(filterTabList);
                } else if (data?.data[0]?.in_process === 0) {
                  const filterTabList = tabViews.map((el) =>
                    el.title === "project_details"
                      ? { ...el, isActiveGreen: true, isActive: true }
                      : {
                          ...el,
                          isActive: false,
                          isActiveGreen: false,
                        }
                  );
                  setTabViews(filterTabList);
                } else if (data?.data[0]?.in_process === 1) {
                  const filterTabList = tabViews.map((el) =>
                    el.title === "production_brief"
                      ? { ...el, isActiveGreen: true, isActive: true }
                      : {
                          ...el,
                          isActive: false,
                          isActiveGreen: false,
                        }
                  );
                  setTabViews(filterTabList);
                } else if (
                  data?.data[0]?.in_process === 3 ||
                  data?.data[0]?.in_process === 6
                ) {
                  const filterTabList = tabViews.map((el) =>
                    el.title === "production_media"
                      ? { ...el, isActiveGreen: true, isActive: true }
                      : {
                          ...el,
                          isActive: false,
                          isActiveGreen: false,
                        }
                  );
                  setTabViews(filterTabList);
                }
              }
            } else if (data?.code === 400) {
              toast.error(<ErrorToast msg="Job does not exist." />);
              history.push({
                pathname: "/dashboard",
              });
            }
          }
        },
      })
    );

    if(imageArrayCallOnce){
      setUppyAnchorProductionMediaFlagTemporary(true);
      setImageArrayCallOnce(false)
      let getImageListPayload = {
        user_profile_id: user_profile_id,
        job_id: parseInt(job_detail_id),
        page: currPage,
      };
      dispatch(
        imagesType({
          getImageListPayload,
          callback: async (result) => {
            if (result) {
              setUppyAnchorProductionMediaFlagTemporary(false);
              setLastList(result.has_more);
              setPrevPage(currPage);
              const arrayMap = result?.data?.map((ele) => ele?.image_name);
              setTotalImage(result?.total);
              setImageArray([...imageArray, ...arrayMap]);
              setImageArrayTemporary([...imageArray, ...arrayMap])
              // setImageArray(removeDuplicateImageName);
            }
          },
        })
      );
    }
    
  };

  const AvatarPicker = () => {
    return (
      <div className={`${fileFlag ? "custom-cancel" : ""}`}>
        {fileFlag ? (
          <button
            onClick={(e) => {
              handleCancel(e);
            }}
            className="absolute"
            type="button"
          >
            Cancel
          </button>
        ) : (
          ""
        )}
        <Dashboard
          doneButtonHandler={() => {
            setIsUppyOpen(true);
          }}
          showRemoveButtonAfterComplete={true}
          hideCancelButton={true}
          uppy={uppy}
          locale={{
            strings: {
              showRemoveButtonAfterComplete: false,
              showProgressDetails: false,
              dropHint: `${t("DROP_HINT")}`,
              poweredBy: `${t("POWERED_BY")}`,
              // Text to show on the droppable area.
              browseFiles: `${t("BROWSE_FILE")}`,
              browseFolders: `${t("BROWSE_FOLDER")}`,
              // `%{browse}` is replaced with a link that opens the system file selection dialog.
              dropPasteFiles:
                "%{browseFolders}" +
                ` ${t("DRAG_AND_DROP_TITLE")} ` +
                "%{browse}" +
                ` ${t("FILE_ACCEPTED_MESSAGE")}`,
              // Used as the label for the link that opens the system file selection dialog.
              browse: "browse",
            },
          }}
          fixed
          hideAfterFinish
        />
      </div>
    );
  };

  const afterApiResponseOfUppy = (e) => {
    setIsUppyOpen(false);
    setFileFlag(false);
    setUppyExtention([]);
    uppy.cancelAll();
    let accept_photographer_job = {
      job_id: parseInt(jobDetail?.id),
      photographer_status: "1",
      in_process: 3,
      type_id: 3,
      reason: "",
    };
    dispatch(
      acceptPhotographerJob({
        accept_photographer_job,
        callback: async (data) => {
          if (data) {
            setMediaLoaderFlag(true);
            setJobDetailCount(jobDetailCount + 1);
            setJobDetail(data?.data[0]);

            if (
              data?.data[0]?.in_process === 2 ||
              data?.data[0]?.in_process === 5 ||
              data?.data[0]?.in_process === 7
            ) {
              const filterTabList = tabViews.map((el) =>
                el.title === "billing_details"
                  ? {
                      ...el,
                      isActiveGreen: true,
                      isActiveBody: true,
                      isActive: true,
                    }
                  : { ...el, isActive: false, isActiveGreen: false }
              );
              setTabViews(filterTabList);
            } else if (
              data?.data[0]?.in_process === 0 &&
              imageArray?.length === 0
            ) {
              const filterTabList = tabViews.map((el) =>
                el.title === "project_details"
                  ? { ...el, isActiveGreen: true, isActive: true }
                  : { ...el, isActive: true, isActiveGreen: false }
              );
              setTabViews(filterTabList);
            } else if (
              imageArray?.length === 0 &&
              data?.data[0]?.in_process === 1
            ) {
              const filterTabList = tabViews.map((el) =>
                el.title === "production_brief"
                  ? { ...el, isActiveGreen: true, isActive: true }
                  : { ...el, isActive: true, isActiveGreen: false }
              );
              setTabViews(filterTabList);
            } else if (
              (imageArray?.length > 0 && data?.data[0]?.in_process === 3) ||
              (imageArray?.length > 0 && data?.data[0]?.in_process === 6) ||
              imageArray?.length > 0
            ) {
              const filterTabList = tabViews.map((el) =>
                el.title === "production_media"
                  ? { ...el, isActiveGreen: true, isActive: true }
                  : { ...el, isActive: true, isActiveGreen: false }
              );
              setTabViews(filterTabList);
            }

            setUppyAnchorProductionMediaFlag(true);
            let getImageListPayload = {
              user_profile_id: user_profile_id,
              job_id: parseInt(job_detail_id),
              page: currPage,
            };
            dispatch(
              imagesType({
                getImageListPayload,
                callback: async (result) => {
                  if (result) {
                    setUppyAnchorProductionMediaFlag(false);
                    setLastList(result.has_more);
                    setPrevPage(currPage);
                    const arrayMap = result?.data?.map(
                      (ele) => ele?.image_name
                    );
                    setTotalImage(result?.total);
                    setImageArray([...imageArray, ...arrayMap]);
                    setImageArrayTemporary([...imageArray, ...arrayMap]);
                    // setImageArray(removeDuplicateImageName);
                  }
                },
              })
            );
          }
        },
      })
    );
  };

  const handleCancel = (e) => {
    // e.preventDefault();
    setUppyExtention([]);
    swal({
      title: "Are you sure you want to cancel?",
      icon: "warning",
      buttons: ["No, cancel it!", "Yes, delete it!"],
    }).then((willDelete) => {
      if (willDelete) {
        uppy.cancelAll();
        setFileFlag(false);
        swal({
          title: "Deleted!",
          text: "Your files has been deleted.",
          icon: "success",
        });
      }
    });
  };
 
  const re_upload_request = (e, download) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    let reUploadRequest;
    if (!download) {
      reUploadRequest = {
        user_id: userData?.id,
        job_id: parseInt(jobDetail?.id),
        in_process: 6,
        type_id: 6,
        lang: userData?.lang,
      };
    } else {
      reUploadRequest = {
        photographer_id: userData?.id,
        job_id: parseInt(job_detail_id),
      };
    }
    dispatch(
      requestReUpload({
        reUploadRequest,
        callback: async (data, request1) => {
          //console.log()
          if (request1) {
            setImageLinkOpen(true);
            setImageLinkMessage(data?.message);
          } else {
            if (data) {
              toast.success(
                <SuccessToast msg="Request has been sent for re-upload" />
              );
              setJobDetail(data);

              if (
                data?.in_process === 2 ||
                data?.in_process === 5 ||
                data?.in_process === 7
              ) {
                const filterTabList = tabViews.map((el) =>
                  el.title === "billing_details"
                    ? {
                        ...el,
                        isActiveGreen: true,
                        isActiveBody: true,
                        isActive: true,
                      }
                    : { ...el, isActive: false, isActiveGreen: false }
                );
                setTabViews(filterTabList);
              } else if (data?.in_process === 0 && imageArray?.length === 0) {
                const filterTabList = tabViews.map((el) =>
                  el.title === "project_details"
                    ? { ...el, isActiveGreen: true, isActive: true }
                    : { ...el, isActive: false, isActiveGreen: false }
                );
                setTabViews(filterTabList);
              } else if (imageArray?.length === 0 && data?.in_process === 1) {
                const filterTabList = tabViews.map((el) =>
                  el.title === "production_brief"
                    ? { ...el, isActiveGreen: true, isActive: true }
                    : { ...el, isActive: false, isActiveGreen: false }
                );
                setTabViews(filterTabList);
              } else if (
                (imageArray?.length > 0 && data?.in_process === 3) ||
                (imageArray?.length > 0 && data?.in_process === 6) ||
                imageArray?.length > 0
              ) {
                const filterTabList = tabViews.map((el) =>
                  el.title === "production_media"
                    ? { ...el, isActiveGreen: true, isActive: true }
                    : { ...el, isActive: false, isActiveGreen: false }
                );
                setTabViews(filterTabList);
              }
            }
          }
        },
      })
    );
  };

  const raiseInvoice = (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    setInvoiceButtonDisableFlag(true);
    let raiseInvoicePayload = {
      job_id: parseInt(job_detail_id),
      is_request: 1,
    };
    dispatch(
      acceptRaiseOrderJob({
        raiseInvoicePayload,
        callback: async (data) => {
          if (data) {
            setInvoiceButtonDisableFlag(false);
            setJobDetail(data);
            if (
              data?.in_process === 2 ||
              data?.in_process === 5 ||
              data?.in_process === 7
            ) {
              const filterTabList = tabViews.map((el) =>
                el.title === "billing_details"
                  ? {
                      ...el,
                      isActiveGreen: true,
                      isActiveBody: true,
                      isActive: true,
                    }
                  : { ...el, isActive: false, isActiveGreen: false }
              );
              setTabViews(filterTabList);
            } else if (data?.in_process === 0 && imageArray?.length === 0) {
              const filterTabList = tabViews.map((el) =>
                el.title === "project_details"
                  ? { ...el, isActiveGreen: true, isActive: true }
                  : { ...el, isActive: false, isActiveGreen: false }
              );
              setTabViews(filterTabList);
            } else if (imageArray?.length === 0 && data?.in_process === 1) {
              const filterTabList = tabViews.map((el) =>
                el.title === "production_brief"
                  ? { ...el, isActiveGreen: true, isActive: true }
                  : { ...el, isActive: false, isActiveGreen: false }
              );
              setTabViews(filterTabList);
            } else if (
              (imageArray?.length > 0 && data?.in_process === 3) ||
              (imageArray?.length > 0 && data?.in_process === 6) ||
              imageArray?.length > 0
            ) {
              const filterTabList = tabViews.map((el) =>
                el.title === "production_media"
                  ? { ...el, isActiveGreen: true, isActive: true }
                  : { ...el, isActive: false, isActiveGreen: false }
              );
              setTabViews(filterTabList);
            }
          }
        },
      })
    );
  };

  const accept = async (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    setJob_id(0);

    let accept_photographer_job = {
      job_id: parseInt(jobDetail?.id),
      photographer_status: "1",
      in_process: 1,
      type_id: 1,
      reason: "",
    };
    dispatch(
      acceptPhotographerJob({
        accept_photographer_job,
        callback: async (data) => {
          if (data) {
            setJob_id(data?.data[0]?.id);
            let result = data?.data?.find((job) => job?.id === jobDetail?.id);
            if (
              result?.in_process === 2 ||
              result?.in_process === 5 ||
              result?.in_process === 7
            ) {
              const filterTabList = tabViews.map((el) =>
                el.title === "billing_details"
                  ? {
                      ...el,
                      isActiveGreen: true,
                      isActiveBody: true,
                      isActive: true,
                    }
                  : { ...el, isActive: false, isActiveGreen: false }
              );
              setTabViews(filterTabList);
            } else if (result?.in_process === 0 && imageArray?.length === 0) {
              const filterTabList = tabViews.map((el) =>
                el.title === "project_details"
                  ? { ...el, isActiveGreen: true, isActive: true }
                  : { ...el, isActive: false, isActiveGreen: false }
              );
              setTabViews(filterTabList);
            } else if (imageArray?.length === 0 && result?.in_process === 1) {
              const filterTabList = tabViews.map((el) =>
                el.title === "production_brief"
                  ? { ...el, isActiveGreen: true, isActive: true }
                  : { ...el, isActive: false, isActiveGreen: false }
              );
              setTabViews(filterTabList);
            } else if (
              (imageArray?.length > 0 && result?.in_process === 3) ||
              (imageArray?.length > 0 && result?.in_process === 6) ||
              imageArray?.length > 0
            ) {
              const filterTabList = tabViews.map((el) =>
                el.title === "production_media"
                  ? { ...el, isActiveGreen: true, isActive: true }
                  : { ...el, isActive: false, isActiveGreen: false }
              );
              setTabViews(filterTabList);
            }

            setJobDetail(result);
          }
        },
      })
    );
  };

  const reject = (e, job) => {
    e.preventDefault();
    setJob_id(0);
    setPublishOpen(true);
    setJob_id(jobDetail?.id);
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

  const onSubmitReason = async (e) => {
    e.preventDefault();
    const { errors, isValid } = validateReason(form);

    if (isValid) {
      setPublishOpen(false);
      let reject_photographer_job = {
        job_id: parseInt(job_id),
        photographer_status: "2",
        in_process: 4,
        type_id: 4,
        reason: form?.reason,
      };
      dispatch(
        rejectPhotographerJob({
          reject_photographer_job,
          callback: async (data) => {
            if (data) {
              setJob_id(data?.data[0]?.id);
              let result = data?.data?.find((job) => job?.id === jobDetail?.id);

              if (
                result?.in_process === 2 ||
                result?.in_process === 5 ||
                result?.in_process === 7
              ) {
                const filterTabList = tabViews.map((el) =>
                  el.title === "billing_details"
                    ? {
                        ...el,
                        isActiveGreen: true,
                        isActiveBody: true,
                        isActive: true,
                      }
                    : { ...el, isActive: false, isActiveGreen: false }
                );
                setTabViews(filterTabList);
              } else if (result?.in_process === 0 && imageArray?.length === 0) {
                const filterTabList = tabViews.map((el) =>
                  el.title === "project_details"
                    ? { ...el, isActiveGreen: true, isActive: true }
                    : { ...el, isActive: false, isActiveGreen: false }
                );
                setTabViews(filterTabList);
              } else if (imageArray?.length === 0 && result?.in_process === 1) {
                const filterTabList = tabViews.map((el) =>
                  el.title === "production_brief"
                    ? { ...el, isActiveGreen: true, isActive: true }
                    : { ...el, isActive: false, isActiveGreen: false }
                );
                setTabViews(filterTabList);
              } else if (
                (imageArray?.length > 0 && result?.in_process === 3) ||
                (imageArray?.length > 0 && result?.in_process === 6) ||
                imageArray?.length > 0
              ) {
                const filterTabList = tabViews.map((el) =>
                  el.title === "production_media"
                    ? { ...el, isActiveGreen: true, isActive: true }
                    : { ...el, isActive: false, isActiveGreen: false }
                );
                setTabViews(filterTabList);
              }

              setJobDetail(result);
            }
          },
        })
      );
    } else {
      setError(errors);
    }
  };

  const scrollUp = (e) => {
    e.preventDefault();
    // e.stopPropagation();
  };

  const handleImage = (image, extenstion) => {
    if (extenstion === "pdf") {
      return (
        <a target="_blank" title="Pdf Caption">
          <svg
            width="20"
            height="25"
            viewBox="0 0 20 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.9419 11.4948C11.8301 11.2422 11.5504 11.1159 11.0749 11.1159C10.7953 11.1159 10.4598 11.1476 10.0683 11.2422C9.509 10.579 8.94974 9.60004 8.53017 8.65268C8.92166 6.72636 8.67008 6.34746 8.5861 6.22114C8.50211 6.09484 8.36239 6 8.19461 6C8.13869 6 8.0547 6 7.99877 6.03168C7.83099 6.09483 7.69108 6.25283 7.60729 6.44229C7.38358 6.97899 7.66321 7.958 7.97072 8.68416C7.71914 9.85261 7.27171 11.2422 6.82412 12.379C5.67751 12.979 5.06234 13.5474 5.00639 14.1158C4.97833 14.3053 5.03444 14.6211 5.34194 14.8737C5.42593 14.9368 5.53778 15 5.62158 15C5.87334 15 6.15296 14.7789 6.46048 14.2736C6.68418 13.9262 6.93595 13.4209 7.18751 12.8211C7.99853 12.4105 9.00525 12.0632 9.87217 11.8421C10.3476 12.3473 10.767 12.6317 11.1585 12.6317C11.4381 12.6317 11.6618 12.5053 11.8296 12.221C11.9978 11.937 12.0537 11.6843 11.9418 11.4949L11.9419 11.4948ZM5.64981 14.4002C5.5099 14.2738 5.5099 14.179 5.5099 14.179C5.53796 13.9896 5.78954 13.6421 6.43278 13.2317C5.95749 14.2421 5.70575 14.4002 5.64979 14.4002L5.64981 14.4002ZM8.05484 6.6631C8.08289 6.59995 8.11076 6.59995 8.13882 6.56827H8.16688C8.2228 6.63142 8.27873 6.94719 8.16688 7.67359C8.05484 7.26299 7.97086 6.8526 8.05484 6.66315L8.05484 6.6631ZM7.49557 12.063C7.80326 11.242 8.08291 10.3262 8.30659 9.47348C8.64215 10.1682 9.0617 10.8314 9.45319 11.3683C8.83783 11.5261 8.13863 11.7787 7.49557 12.063V12.063ZM11.4106 11.8736C11.3266 12.0316 11.2148 12.0316 11.1589 12.0316C10.9911 12.0316 10.7674 11.9053 10.5437 11.7158C10.7395 11.6841 10.9352 11.6841 11.0751 11.6841C11.3547 11.6841 11.4666 11.7158 11.4946 11.7473C11.4666 11.7787 11.4666 11.8104 11.4106 11.8736L11.4106 11.8736Z"
              fill="#FF7330"
            />
            <path
              d="M12.6338 0.669724C12.1874 0.223341 11.5624 0 10.9375 0H4.24113C1.91966 0 0 1.91959 0 4.24113V20.7589C0 23.0803 1.91959 25 4.24113 25H14.9552C17.2767 25 19.1963 23.0804 19.1963 20.7589L19.1961 7.90241C19.1961 7.23269 18.9282 6.56326 18.437 6.11688L12.6338 0.669724ZM17.8566 20.7588C17.8566 22.3658 16.562 23.6605 14.9549 23.6605H4.24083C2.63386 23.6605 1.33915 22.3659 1.33915 20.7588V4.24109C1.33915 2.63412 2.63379 1.33941 4.24083 1.33941H10.982V5.35716C10.982 6.69631 12.0981 7.81245 13.4373 7.81245H17.8569V7.90173L17.8566 20.7588Z"
              fill="#353535"
            />
            <path
              d="M5.02577 21.5393H4.46777V17.5133H5.01377V17.9633C5.09777 17.8113 5.22377 17.6873 5.39177 17.5913C5.55977 17.4953 5.75577 17.4473 5.97977 17.4473C6.39577 17.4473 6.71977 17.5893 6.95177 17.8733C7.18777 18.1573 7.30577 18.5173 7.30577 18.9533C7.30577 19.3933 7.18377 19.7573 6.93977 20.0453C6.69977 20.3333 6.37377 20.4773 5.96177 20.4773C5.74977 20.4773 5.56177 20.4333 5.39777 20.3453C5.23377 20.2573 5.10977 20.1453 5.02577 20.0093V21.5393ZM6.72977 18.9533C6.72977 18.6613 6.65177 18.4213 6.49577 18.2333C6.34377 18.0413 6.13777 17.9453 5.87777 17.9453C5.62177 17.9453 5.41377 18.0413 5.25377 18.2333C5.09777 18.4213 5.01977 18.6613 5.01977 18.9533C5.01977 19.2533 5.09777 19.4993 5.25377 19.6913C5.41377 19.8793 5.62177 19.9733 5.87777 19.9733C6.13377 19.9733 6.33977 19.8793 6.49577 19.6913C6.65177 19.4993 6.72977 19.2533 6.72977 18.9533Z"
              fill="#353535"
            />
            <path
              d="M8.36041 18.9473C8.36041 19.2513 8.43441 19.4993 8.58241 19.6913C8.73441 19.8833 8.94241 19.9793 9.20641 19.9793C9.45841 19.9793 9.66041 19.8813 9.81241 19.6853C9.96441 19.4893 10.0404 19.2393 10.0404 18.9353C10.0404 18.6353 9.96641 18.3933 9.81841 18.2093C9.67041 18.0253 9.46841 17.9333 9.21241 17.9333C8.95641 17.9333 8.75041 18.0273 8.59441 18.2153C8.43841 18.4033 8.36041 18.6473 8.36041 18.9473ZM10.0464 20.0093V19.9613C9.97041 20.1093 9.85441 20.2333 9.69841 20.3333C9.54641 20.4293 9.36441 20.4773 9.15241 20.4773C8.74041 20.4773 8.40841 20.3333 8.15641 20.0453C7.90841 19.7533 7.78441 19.3873 7.78441 18.9473C7.78441 18.5273 7.91241 18.1713 8.16841 17.8793C8.42441 17.5833 8.75241 17.4353 9.15241 17.4353C9.38841 17.4353 9.58041 17.4833 9.72841 17.5793C9.87641 17.6713 9.97841 17.7853 10.0344 17.9213V16.0553H10.5924V19.8653C10.5924 20.0613 10.6024 20.2393 10.6224 20.3993H10.0764C10.0564 20.2873 10.0464 20.1573 10.0464 20.0093Z"
              fill="#353535"
            />
            <path
              d="M13.0038 18.0233H12.3078V20.3993H11.7258V18.0233H11.1918V17.5133H11.7258V17.0273C11.7258 16.7193 11.8158 16.4773 11.9958 16.3013C12.1758 16.1253 12.4018 16.0373 12.6738 16.0373C12.8458 16.0373 12.9578 16.0573 13.0098 16.0973V16.6013C12.9498 16.5773 12.8678 16.5653 12.7638 16.5653C12.6398 16.5653 12.5318 16.6033 12.4398 16.6793C12.3518 16.7513 12.3078 16.8773 12.3078 17.0573V17.5133H13.0038V18.0233Z"
              fill="#353535"
            />
          </svg>
        </a>
      );
    } else if (extenstion === "xlsx" || extenstion === "xls") {
      return (
        <a target="_blank" title="Excel Caption">
          <svg
            width="20"
            height="25"
            viewBox="0 0 20 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.6338 0.669724C12.1874 0.223341 11.5624 0 10.9375 0H4.24113C1.91966 0 0 1.91959 0 4.24113V20.7589C0 23.0803 1.91959 25 4.24113 25H14.9552C17.2767 25 19.1963 23.0804 19.1963 20.7589L19.1961 7.90241C19.1961 7.23269 18.9282 6.56326 18.437 6.11688L12.6338 0.669724ZM17.8566 20.7588C17.8566 22.3658 16.562 23.6605 14.9549 23.6605H4.24083C2.63386 23.6605 1.33915 22.3659 1.33915 20.7588V4.24109C1.33915 2.63412 2.63379 1.33941 4.24083 1.33941H10.982V5.35716C10.982 6.69631 12.0981 7.81245 13.4373 7.81245H17.8569V7.90173L17.8566 20.7588Z"
              fill="#353535"
            />
            <path
              d="M4.06738 20.3993L5.14138 18.9293L4.10338 17.5133H4.78738L5.49538 18.5273L6.19138 17.5133H6.85738L5.83138 18.9293C5.89138 19.0053 6.06938 19.2513 6.36538 19.6673C6.66138 20.0793 6.83738 20.3233 6.89338 20.3993H6.21538L5.47138 19.3373L4.73938 20.3993H4.06738Z"
              fill="#353535"
            />
            <path
              d="M7.99865 20.3993H7.43465V16.0553H7.99865V20.3993Z"
              fill="#353535"
            />
            <path
              d="M8.68809 19.6493L9.19809 19.4693C9.21809 19.6253 9.28609 19.7553 9.40209 19.8593C9.51809 19.9593 9.67409 20.0093 9.87009 20.0093C10.0221 20.0093 10.1421 19.9733 10.2301 19.9013C10.3181 19.8253 10.3621 19.7333 10.3621 19.6253C10.3621 19.4333 10.2381 19.3093 9.99009 19.2533L9.49809 19.1453C9.27409 19.0973 9.09809 19.0013 8.97009 18.8573C8.84209 18.7133 8.77809 18.5393 8.77809 18.3353C8.77809 18.0873 8.87809 17.8733 9.07809 17.6933C9.28209 17.5133 9.52409 17.4233 9.80409 17.4233C9.98809 17.4233 10.1521 17.4513 10.2961 17.5073C10.4401 17.5593 10.5521 17.6293 10.6321 17.7173C10.7121 17.8053 10.7721 17.8873 10.8121 17.9633C10.8521 18.0393 10.8821 18.1173 10.9021 18.1973L10.4041 18.3833C10.3961 18.3353 10.3821 18.2893 10.3621 18.2453C10.3421 18.1973 10.3101 18.1453 10.2661 18.0893C10.2261 18.0333 10.1661 17.9893 10.0861 17.9573C10.0061 17.9213 9.91209 17.9033 9.80409 17.9033C9.66409 17.9033 9.54809 17.9413 9.45609 18.0173C9.36809 18.0933 9.32409 18.1833 9.32409 18.2873C9.32409 18.4713 9.43409 18.5873 9.65409 18.6353L10.1221 18.7373C10.3781 18.7933 10.5741 18.8973 10.7101 19.0493C10.8501 19.1973 10.9201 19.3793 10.9201 19.5953C10.9201 19.8233 10.8261 20.0293 10.6381 20.2133C10.4541 20.3973 10.1961 20.4893 9.86409 20.4893C9.50809 20.4893 9.23009 20.4013 9.03009 20.2253C8.83009 20.0453 8.71609 19.8533 8.68809 19.6493Z"
              fill="#353535"
            />
            <path
              d="M11.2217 20.3993L12.2957 18.9293L11.2577 17.5133H11.9417L12.6497 18.5273L13.3457 17.5133H14.0117L12.9857 18.9293C13.0457 19.0053 13.2237 19.2513 13.5197 19.6673C13.8157 20.0793 13.9917 20.3233 14.0477 20.3993H13.3697L12.6257 19.3373L11.8937 20.3993H11.2217Z"
              fill="#353535"
            />
            <path
              d="M8.3457 13C7.04362 13 5.74154 13 4.43945 13C3.85352 13 3.85352 13.8464 4.43945 13.8464C5.74154 13.8464 7.04362 13.8464 8.3457 13.8464C8.93164 13.8464 8.93164 13 8.3457 13Z"
              fill="#FF7330"
            />
            <path
              d="M8.3457 11C7.04362 11 5.74154 11 4.43945 11C3.85352 11 3.85352 11.8464 4.43945 11.8464C5.74154 11.8464 7.04362 11.8464 8.3457 11.8464C8.93164 11.8464 8.93164 11 8.3457 11Z"
              fill="#FF7330"
            />
            <path
              d="M8.3457 9C7.04362 9 5.74154 9 4.43945 9C3.85352 9 3.85352 9.84635 4.43945 9.84635C5.74154 9.84635 7.04362 9.84635 8.3457 9.84635C8.93164 9.84635 8.93164 9 8.3457 9Z"
              fill="#FF7330"
            />
            <path
              d="M13.3457 13C12.0436 13 11.7415 13 10.4395 13C9.85352 13 9.85352 13.8464 10.4395 13.8464C11.7415 13.8464 12.0436 13.8464 13.3457 13.8464C13.9316 13.8464 13.9316 13 13.3457 13Z"
              fill="#FF7330"
            />
            <path
              d="M13.3457 11C12.0436 11 11.7415 11 10.4395 11C9.85352 11 9.85352 11.8464 10.4395 11.8464C11.7415 11.8464 12.0436 11.8464 13.3457 11.8464C13.9316 11.8464 13.9316 11 13.3457 11Z"
              fill="#FF7330"
            />
            <path
              d="M13.3457 9C12.0436 9 11.7415 9 10.4395 9C9.85352 9 9.85352 9.84635 10.4395 9.84635C11.7415 9.84635 12.0436 9.84635 13.3457 9.84635C13.9316 9.84635 13.9316 9 13.3457 9Z"
              fill="#FF7330"
            />
          </svg>
        </a>
      );
    } else if (extenstion === "cdr" || extenstion === "CDR") {
      return (
        <a target="_blank" title="CDR Caption">
          <svg
            width="20"
            height="25"
            viewBox="0 0 20 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.6338 0.669724C12.1873 0.223341 11.5624 0 10.9375 0H4.24113C1.91967 0 0 1.91959 0 4.24113V20.7589C0 23.0803 1.91959 25 4.24113 25H14.9552C17.2767 25 19.1964 23.0804 19.1964 20.7589L19.1961 7.90242C19.1961 7.23269 18.9283 6.56326 18.437 6.11688L12.6338 0.669724ZM17.8566 20.7589C17.8566 22.3658 16.562 23.6605 14.9549 23.6605H4.24083C2.63386 23.6605 1.33915 22.3659 1.33915 20.7589V4.24109C1.33915 2.63412 2.63379 1.33941 4.24083 1.33941H10.982V5.35716C10.982 6.69631 12.0981 7.81242 13.4373 7.81242H17.8569V7.90174L17.8566 20.7589Z"
              fill="#353535"
            />
            <path
              d="M8.7743 8.49342C8.23543 9.50418 8.05771 11.4065 8.39271 12.9416L8.76559 14.6487H8.33733L7.21293 12.7027C6.26326 11.0597 7.1226 9.06426 8.7743 8.49335V8.49342Z"
              fill="#FF7330"
            />
            <path
              d="M10.5101 12.8165L10.1081 14.6489H9.36238L8.96033 12.8165C8.58746 11.1065 8.91367 9.18395 9.44102 8.52849C9.51086 8.44115 9.62162 8.33334 9.73518 8.33334C9.74685 8.33334 9.75844 8.33334 9.77306 8.3363C10.4138 8.45456 10.9484 10.8324 10.5101 12.8164V12.8165Z"
              fill="#FF7330"
            />
            <path
              d="M12.2587 12.7028L11.1343 14.6487H10.7061L11.0789 12.9417C11.4471 11.2707 11.1942 9.4134 10.7061 8.49628C12.3585 9.06893 13.2057 11.0636 12.2587 12.7029V12.7028Z"
              fill="#FF7330"
            />
            <path
              d="M10.3222 16.6667H9.13262C8.81088 16.6667 8.55005 16.4058 8.55005 16.0841V15.2316H10.9047V16.0841C10.9047 16.4058 10.644 16.6667 10.3222 16.6667Z"
              fill="#FF7330"
            />
            <path
              d="M7.07128 18.7333C6.82481 18.7333 6.61471 18.8222 6.44098 19C6.27128 19.1778 6.18643 19.4283 6.18643 19.7515C6.18643 20.0707 6.27128 20.3212 6.44098 20.503C6.61471 20.6849 6.82683 20.7758 7.07734 20.7758C7.31977 20.7758 7.5036 20.7152 7.62883 20.5939C7.75815 20.4727 7.84505 20.3333 7.88944 20.1758L8.39247 20.3939C8.31171 20.6364 8.15815 20.8485 7.93186 21.0303C7.70967 21.2121 7.42481 21.303 7.07734 21.303C6.6531 21.303 6.30158 21.1555 6.0228 20.8606C5.74401 20.5657 5.60461 20.196 5.60461 19.7515C5.60461 19.299 5.74401 18.9293 6.0228 18.6424C6.30158 18.3515 6.65108 18.2061 7.07128 18.2061C7.42683 18.2061 7.71368 18.297 7.93186 18.4788C8.15414 18.6606 8.29959 18.8788 8.36823 19.1333L7.85308 19.3515C7.80868 19.1818 7.72383 19.0364 7.59853 18.9152C7.4733 18.7939 7.29754 18.7333 7.07128 18.7333ZM9.37065 19.7455C9.37065 20.0525 9.44535 20.303 9.59489 20.497C9.74838 20.6909 9.95853 20.7879 10.2252 20.7879C10.4797 20.7879 10.6838 20.6889 10.8373 20.4909C10.9908 20.293 11.0676 20.0404 11.0676 19.7333C11.0676 19.4303 10.9928 19.1858 10.8434 19C10.6938 18.8142 10.4898 18.7212 10.2313 18.7212C9.97262 18.7212 9.76459 18.8161 9.60702 19.0061C9.44944 19.196 9.37065 19.4424 9.37065 19.7455ZM11.0737 20.8182V20.7697C10.9969 20.9192 10.8797 21.0445 10.7222 21.1455C10.5686 21.2424 10.3847 21.2909 10.1707 21.2909C9.75444 21.2909 9.41914 21.1455 9.16459 20.8546C8.91406 20.5596 8.78883 20.1899 8.78883 19.7455C8.78883 19.3212 8.91808 18.9616 9.17671 18.6667C9.43527 18.3677 9.76656 18.2182 10.1707 18.2182C10.409 18.2182 10.6029 18.2667 10.7525 18.3636C10.9019 18.4566 11.005 18.5717 11.0616 18.7091V16.8242H11.6252V20.6727C11.6252 20.8707 11.6353 21.0505 11.6555 21.2121H11.104C11.0838 21.099 11.0737 20.9677 11.0737 20.8182ZM14.2124 18.2667V18.8727C14.1275 18.8606 14.0447 18.8546 13.9639 18.8546C13.4306 18.8546 13.1639 19.1536 13.1639 19.7515V21.2121H12.5942V18.297H13.1518V18.8061C13.3295 18.4343 13.6204 18.2485 14.0245 18.2485C14.0891 18.2485 14.1518 18.2546 14.2124 18.2667Z"
              fill="#353535"
            />
          </svg>
        </a>
      );
    } else if (extenstion === "CR2" || extenstion === "cr2") {
      return (
        <a target="_blank" title="CR2 Caption">
          <svg
            width="20"
            height="25"
            viewBox="0 0 20 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.6338 0.669724C12.1874 0.223341 11.5624 0 10.9375 0H4.24113C1.91966 0 0 1.91959 0 4.24113V20.7589C0 23.0803 1.91959 25 4.24113 25H14.9552C17.2767 25 19.1963 23.0804 19.1963 20.7589L19.1961 7.90241C19.1961 7.23269 18.9282 6.56326 18.437 6.11688L12.6338 0.669724ZM17.8566 20.7588C17.8566 22.3658 16.562 23.6605 14.9549 23.6605H4.24083C2.63386 23.6605 1.33915 22.3659 1.33915 20.7588V4.24109C1.33915 2.63412 2.63379 1.33941 4.24083 1.33941H10.982V5.35716C10.982 6.69631 12.0981 7.81245 13.4373 7.81245H17.8569V7.90173L17.8566 20.7588Z"
              fill="#353535"
            />
            <path
              d="M12.8832 12.2626C12.9045 12.0915 12.9156 11.9173 12.9156 11.7404C12.9156 10.6128 12.4686 9.58947 11.7424 8.83759L9.34644 10.2206L12.8832 12.2626Z"
              fill="#FF7330"
            />
            <path
              d="M11.2417 8.39561C10.5435 7.87215 9.67659 7.56186 8.73701 7.56186C8.39125 7.56186 8.05547 7.6041 7.73413 7.6832V10.4204L11.2417 8.39561Z"
              fill="#FF7330"
            />
            <path
              d="M7.10101 7.89426C5.96479 8.37812 5.08695 9.35088 4.7312 10.5484L7.10101 11.9165V7.89426Z"
              fill="#FF7330"
            />
            <path
              d="M4.59322 11.1997C4.57033 11.3768 4.55835 11.5571 4.55835 11.7402C4.55835 12.8443 4.98661 13.848 5.68596 14.595L8.08019 13.2129L4.59322 11.1997Z"
              fill="#FF7330"
            />
            <path
              d="M6.17749 15.0427C6.88451 15.5917 7.77265 15.9187 8.73747 15.9187C9.06618 15.9187 9.38597 15.8806 9.69289 15.8089V13.013L6.17749 15.0427Z"
              fill="#FF7330"
            />
            <path
              d="M10.3254 15.6058C11.4899 15.1269 12.39 14.137 12.7475 12.9156L10.3254 11.5173V15.6058Z"
              fill="#FF7330"
            />
            <path
              d="M6.52834 17.9453C6.28434 17.9453 6.07634 18.0333 5.90434 18.2093C5.73634 18.3853 5.65234 18.6333 5.65234 18.9533C5.65234 19.2693 5.73634 19.5173 5.90434 19.6973C6.07634 19.8773 6.28634 19.9673 6.53434 19.9673C6.77434 19.9673 6.95634 19.9073 7.08034 19.7873C7.20834 19.6673 7.29434 19.5293 7.33834 19.3733L7.83634 19.5893C7.75634 19.8293 7.60434 20.0393 7.38034 20.2193C7.16034 20.3993 6.87834 20.4893 6.53434 20.4893C6.11434 20.4893 5.76634 20.3433 5.49034 20.0513C5.21434 19.7593 5.07634 19.3933 5.07634 18.9533C5.07634 18.5053 5.21434 18.1393 5.49034 17.8553C5.76634 17.5673 6.11234 17.4233 6.52834 17.4233C6.88034 17.4233 7.16434 17.5133 7.38034 17.6933C7.60034 17.8733 7.74434 18.0893 7.81234 18.3413L7.30234 18.5573C7.25834 18.3893 7.17434 18.2453 7.05034 18.1253C6.92634 18.0053 6.75234 17.9453 6.52834 17.9453ZM10.1 17.4833V18.0833C10.016 18.0713 9.93398 18.0653 9.85399 18.0653C9.32598 18.0653 9.06198 18.3613 9.06198 18.9533V20.3993H8.49798V17.5133H9.04998V18.0173C9.22598 17.6493 9.51398 17.4653 9.91398 17.4653C9.97798 17.4653 10.04 17.4713 10.1 17.4833ZM11.0671 17.9093L10.4791 17.8373C10.4751 17.8013 10.4731 17.7493 10.4731 17.6813C10.4731 17.3333 10.5951 17.0373 10.8391 16.7933C11.0831 16.5453 11.4091 16.4213 11.8171 16.4213C12.2211 16.4213 12.5411 16.5373 12.7771 16.7693C13.0131 16.9973 13.1311 17.2793 13.1311 17.6153C13.1311 18.1073 12.8871 18.5073 12.3991 18.8153L11.6311 19.3073C11.3551 19.4833 11.1971 19.6653 11.1571 19.8533H13.1551V20.3993H10.4311C10.4391 20.0713 10.5131 19.7833 10.6531 19.5353C10.7971 19.2873 11.0311 19.0593 11.3551 18.8513L12.0031 18.4313C12.3591 18.2033 12.5371 17.9333 12.5371 17.6213C12.5371 17.4293 12.4731 17.2673 12.3451 17.1353C12.2171 17.0033 12.0371 16.9373 11.8051 16.9373C11.5611 16.9373 11.3751 17.0113 11.2471 17.1593C11.1191 17.3073 11.0551 17.4993 11.0551 17.7353C11.0551 17.7713 11.0591 17.8293 11.0671 17.9093Z"
              fill="#353535"
            />
          </svg>
        </a>
      );
    } else if (extenstion === "cr3" || extenstion === "CR3") {
      return (
        <a target="_blank" title="CR3 Caption">
          <svg
            width="20"
            height="25"
            viewBox="0 0 20 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.6338 0.669724C12.1874 0.223341 11.5624 0 10.9375 0H4.24113C1.91966 0 0 1.91959 0 4.24113V20.7589C0 23.0803 1.91959 25 4.24113 25H14.9552C17.2767 25 19.1963 23.0804 19.1963 20.7589L19.1961 7.90241C19.1961 7.23269 18.9282 6.56326 18.437 6.11688L12.6338 0.669724ZM17.8566 20.7588C17.8566 22.3658 16.562 23.6605 14.9549 23.6605H4.24083C2.63386 23.6605 1.33915 22.3659 1.33915 20.7588V4.24109C1.33915 2.63412 2.63379 1.33941 4.24083 1.33941H10.982V5.35716C10.982 6.69631 12.0981 7.81245 13.4373 7.81245H17.8569V7.90173L17.8566 20.7588Z"
              fill="#353535"
            />
            <path
              d="M12.8832 12.2626C12.9045 12.0915 12.9156 11.9173 12.9156 11.7404C12.9156 10.6128 12.4686 9.58947 11.7424 8.83759L9.34644 10.2206L12.8832 12.2626Z"
              fill="#FF7330"
            />
            <path
              d="M11.2417 8.39561C10.5435 7.87215 9.67659 7.56186 8.73701 7.56186C8.39125 7.56186 8.05547 7.6041 7.73413 7.6832V10.4204L11.2417 8.39561Z"
              fill="#FF7330"
            />
            <path
              d="M7.10101 7.89426C5.96479 8.37812 5.08695 9.35088 4.7312 10.5484L7.10101 11.9165V7.89426Z"
              fill="#FF7330"
            />
            <path
              d="M4.59322 11.1997C4.57033 11.3768 4.55835 11.5571 4.55835 11.7402C4.55835 12.8443 4.98661 13.848 5.68596 14.595L8.08019 13.2129L4.59322 11.1997Z"
              fill="#FF7330"
            />
            <path
              d="M6.17749 15.0427C6.88451 15.5917 7.77265 15.9187 8.73747 15.9187C9.06618 15.9187 9.38597 15.8806 9.69289 15.8089V13.013L6.17749 15.0427Z"
              fill="#FF7330"
            />
            <path
              d="M10.3254 15.6058C11.4899 15.1269 12.39 14.137 12.7475 12.9156L10.3254 11.5173V15.6058Z"
              fill="#FF7330"
            />
            <path
              d="M6.45803 17.9453C6.21403 17.9453 6.00603 18.0333 5.83403 18.2093C5.66603 18.3853 5.58203 18.6333 5.58203 18.9533C5.58203 19.2693 5.66603 19.5173 5.83403 19.6973C6.00603 19.8773 6.21603 19.9673 6.46403 19.9673C6.70403 19.9673 6.88603 19.9073 7.01003 19.7873C7.13803 19.6673 7.22403 19.5293 7.26803 19.3733L7.76603 19.5893C7.68603 19.8293 7.53403 20.0393 7.31003 20.2193C7.09003 20.3993 6.80803 20.4893 6.46403 20.4893C6.04403 20.4893 5.69603 20.3433 5.42003 20.0513C5.14403 19.7593 5.00603 19.3933 5.00603 18.9533C5.00603 18.5053 5.14403 18.1393 5.42003 17.8553C5.69603 17.5673 6.04203 17.4233 6.45803 17.4233C6.81003 17.4233 7.09403 17.5133 7.31003 17.6933C7.53003 17.8733 7.67403 18.0893 7.74203 18.3413L7.23203 18.5573C7.18803 18.3893 7.10403 18.2453 6.98003 18.1253C6.85603 18.0053 6.68203 17.9453 6.45803 17.9453ZM10.0297 17.4833V18.0833C9.94567 18.0713 9.86367 18.0653 9.78367 18.0653C9.25567 18.0653 8.99167 18.3613 8.99167 18.9533V20.3993H8.42767V17.5133H8.97967V18.0173C9.15567 17.6493 9.44367 17.4653 9.84367 17.4653C9.90767 17.4653 9.96967 17.4713 10.0297 17.4833ZM11.5008 18.5933L11.2128 18.1073L12.3588 17.0513H10.4988V16.5113H13.1388V17.0393L12.0288 18.0653C12.3448 18.0653 12.6228 18.1693 12.8628 18.3773C13.1068 18.5853 13.2288 18.8753 13.2288 19.2473C13.2288 19.5913 13.1028 19.8853 12.8508 20.1293C12.5988 20.3733 12.2548 20.4953 11.8188 20.4953C11.3908 20.4953 11.0468 20.3773 10.7868 20.1413C10.5308 19.9013 10.3928 19.6113 10.3728 19.2713L10.9488 19.1393C10.9608 19.3913 11.0468 19.5953 11.2068 19.7513C11.3708 19.9033 11.5728 19.9793 11.8128 19.9793C12.0688 19.9793 12.2688 19.9113 12.4128 19.7753C12.5608 19.6353 12.6348 19.4633 12.6348 19.2593C12.6348 19.0233 12.5568 18.8433 12.4008 18.7193C12.2448 18.5953 12.0588 18.5333 11.8428 18.5333C11.7268 18.5333 11.6128 18.5533 11.5008 18.5933Z"
              fill="#353535"
            />
          </svg>
        </a>
      );
    } else if (extenstion === "ARW" || extenstion === "arw") {
      return (
        <a target="_blank" title="ARW Caption">
          <svg
            width="20"
            height="25"
            viewBox="0 0 20 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 16H18V21C18 22.6569 16.6569 24 15 24H4C2.34315 24 1 22.6569 1 21V16Z"
              fill="#FF7330"
            />
            <path
              d="M12.6338 0.669724C12.1874 0.223341 11.5624 0 10.9375 0H4.24113C1.91966 0 0 1.91959 0 4.24113V20.7589C0 23.0803 1.91959 25 4.24113 25H14.9552C17.2767 25 19.1963 23.0804 19.1963 20.7589L19.1961 7.90241C19.1961 7.23269 18.9282 6.56326 18.437 6.11688L12.6338 0.669724ZM17.8566 20.7588C17.8566 22.3658 16.562 23.6605 14.9549 23.6605H4.24083C2.63386 23.6605 1.33915 22.3659 1.33915 20.7588V4.24109C1.33915 2.63412 2.63379 1.33941 4.24083 1.33941H10.982V5.35716C10.982 6.69631 12.0981 7.81245 13.4373 7.81245H17.8569V7.90173L17.8566 20.7588Z"
              fill="#353535"
            />
            <path
              d="M10.3286 9.13822C10.3474 8.98758 10.3572 8.83424 10.3572 8.67847C10.3572 7.68578 9.96367 6.78493 9.32432 6.12302L7.21509 7.34058L10.3286 9.13822Z"
              fill="#FF7330"
            />
            <path
              d="M8.88373 5.73393C8.26914 5.2731 7.50593 4.99994 6.67878 4.99994C6.37439 4.99994 6.07879 5.03712 5.7959 5.10676V7.51644L8.88373 5.73393Z"
              fill="#FF7330"
            />
            <path
              d="M5.23835 5.29257C4.23808 5.71854 3.46528 6.5749 3.1521 7.6291L5.23835 8.83355V5.29257Z"
              fill="#FF7330"
            />
            <path
              d="M3.0307 8.20251C3.01055 8.35843 3 8.51718 3 8.67836C3 9.65035 3.37702 10.5339 3.99269 11.1915L6.10043 9.97479L3.0307 8.20251Z"
              fill="#FF7330"
            />
            <path
              d="M4.42529 11.5857C5.04771 12.069 5.82958 12.3568 6.67895 12.3568C6.96833 12.3568 7.24986 12.3233 7.52005 12.2602V9.7988L4.42529 11.5857Z"
              fill="#FF7330"
            />
            <path
              d="M8.0769 12.0814C9.10203 11.6597 9.89445 10.7884 10.2091 9.71308L8.0769 8.48212V12.0814Z"
              fill="#FF7330"
            />
            <path
              d="M5.21992 20.226C5.21992 19.978 5.29992 19.78 5.45992 19.632C5.61992 19.48 5.83192 19.386 6.09592 19.35L6.87592 19.236C7.02392 19.216 7.09792 19.144 7.09792 19.02C7.09792 18.868 7.04592 18.744 6.94192 18.648C6.83792 18.552 6.68192 18.504 6.47392 18.504C6.28192 18.504 6.12992 18.558 6.01792 18.666C5.90592 18.77 5.83992 18.91 5.81992 19.086L5.27992 18.96C5.30792 18.684 5.43392 18.46 5.65792 18.288C5.88192 18.112 6.14992 18.024 6.46192 18.024C6.86992 18.024 7.17192 18.124 7.36792 18.324C7.56392 18.52 7.66192 18.772 7.66192 19.08V20.526C7.66192 20.698 7.67392 20.856 7.69792 21H7.14592C7.12592 20.88 7.11592 20.75 7.11592 20.61C7.03592 20.738 6.91792 20.85 6.76192 20.946C6.60992 21.042 6.41792 21.09 6.18592 21.09C5.90192 21.09 5.66992 21.006 5.48992 20.838C5.30992 20.666 5.21992 20.462 5.21992 20.226ZM6.26392 20.616C6.51592 20.616 6.71792 20.548 6.86992 20.412C7.02192 20.276 7.09792 20.06 7.09792 19.764V19.632L6.21592 19.764C6.08792 19.784 5.98592 19.83 5.90992 19.902C5.83392 19.974 5.79592 20.072 5.79592 20.196C5.79592 20.308 5.83792 20.406 5.92192 20.49C6.00992 20.574 6.12392 20.616 6.26392 20.616ZM10.1425 18.084V18.684C10.0585 18.672 9.97655 18.666 9.89655 18.666C9.36855 18.666 9.10455 18.962 9.10455 19.554V21H8.54055V18.114H9.09255V18.618C9.26855 18.25 9.55655 18.066 9.95655 18.066C10.0205 18.066 10.0825 18.072 10.1425 18.084ZM12.4283 18.114H13.0103L13.7603 20.286L14.3963 18.114H14.9903L14.0543 21H13.4723L12.7043 18.804L11.9543 21H11.3603L10.4123 18.114H11.0303L11.6783 20.286L12.4283 18.114Z"
              fill="#353535"
            />
          </svg>
        </a>
      );
    } else if (extenstion === "NEF" || extenstion === "nef") {
      return (
        <a target="_blank" title="NEF Caption">
          <svg
            width="20"
            height="25"
            viewBox="0 0 20 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.6338 0.669724C12.1874 0.223341 11.5624 0 10.9375 0H4.24113C1.91966 0 0 1.91959 0 4.24113V20.7589C0 23.0803 1.91959 25 4.24113 25H14.9552C17.2767 25 19.1963 23.0804 19.1963 20.7589L19.1961 7.90241C19.1961 7.23269 18.9282 6.56326 18.437 6.11688L12.6338 0.669724ZM17.8566 20.7588C17.8566 22.3658 16.562 23.6605 14.9549 23.6605H4.24083C2.63386 23.6605 1.33915 22.3659 1.33915 20.7588V4.24109C1.33915 2.63412 2.63379 1.33941 4.24083 1.33941H10.982V5.35716C10.982 6.69631 12.0981 7.81245 13.4373 7.81245H17.8569V7.90173L17.8566 20.7588Z"
              fill="#353535"
            />
            <path d="M0 13.6748H19.1949V19.7525H0V13.6748Z" fill="#FF7330" />
            <path
              d="M7.50204 18.8799H6.63204L4.70004 15.8619V18.8799H3.87204V14.6259H4.90404L6.67404 17.4399V14.6259H7.50204V18.8799ZM11.1357 18.8799H8.47165V14.6259H11.1357V15.4059H9.29965V16.3779H10.9617V17.1159H9.29965V18.0999H11.1357V18.8799ZM12.7978 18.8799H11.9638V14.6259H14.6518V15.4119H12.7918V16.4619H14.4478V17.2239H12.7978V18.8799Z"
              fill="#353535"
            />
          </svg>
        </a>
      );
    } else if (extenstion === "dng" || extenstion === "DNG") {
      return (
        <a target="_blank" title="DNG Caption">
          <svg
            width="20"
            height="25"
            viewBox="0 0 20 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.6302 0.651042C12.1745 0.195312 11.5885 0 10.9375 0H4.23177C1.88802 0 0 1.95312 0 4.23177V20.7682C0 23.112 1.88802 25 4.23177 25H14.974C17.3177 25 19.2057 23.112 19.2057 20.7682V7.8776C19.2057 7.22656 18.9453 6.51042 18.4245 6.11979L12.6302 0.651042ZM17.8385 20.7682C17.8385 22.3958 16.5365 23.6979 14.9089 23.6979H4.23177C2.60417 23.6979 1.30208 22.3958 1.30208 20.7682V4.23177C1.30208 2.60417 2.60417 1.30208 4.23177 1.30208H11.0026V5.33854C11.0026 6.70573 12.1094 7.8125 13.4766 7.8125H17.9036V7.8776L17.8385 20.7682Z"
              fill="#353535"
            />
            <path
              d="M6.31502 17.6432C6.64054 17.7734 6.83586 18.0339 7.03117 18.2943C7.22648 18.5547 7.29158 18.9453 7.29158 19.2708C7.29158 19.6615 7.22648 19.987 7.03117 20.2474C6.83586 20.5078 6.64054 20.7682 6.31502 20.8984C5.9895 21.0287 5.66398 21.1589 5.27336 21.1589H3.84106V17.3177H5.27336C5.66398 17.3828 6.05461 17.4479 6.31502 17.6432ZM6.05461 20.1172C6.24992 19.9219 6.38013 19.6615 6.38013 19.2708C6.38013 18.8802 6.24992 18.6198 6.05461 18.4245C5.85929 18.2292 5.59888 18.099 5.20825 18.099H4.75252V20.3125H5.20825C5.59888 20.3776 5.85929 20.3125 6.05461 20.1172Z"
              fill="#353535"
            />
            <path
              d="M11.1979 21.224H10.2865L8.72396 18.8802V21.224H7.8125V17.3828H8.72396L10.2865 19.7266V17.3828H11.1979V21.224V21.224Z"
              fill="#353535"
            />
            <path
              d="M14.4531 18.6198C14.388 18.4896 14.2578 18.4245 14.1276 18.3594C13.9974 18.2292 13.8672 18.2292 13.6719 18.2292C13.3464 18.2292 13.151 18.3594 12.9557 18.5547C12.7604 18.75 12.6953 19.0104 12.6953 19.3359C12.6953 19.6615 12.7604 19.987 12.9557 20.1823C13.151 20.3776 13.4115 20.5078 13.737 20.5078C13.9974 20.5078 14.1276 20.4427 14.3229 20.3125C14.4531 20.1823 14.5833 20.0521 14.6484 19.7917H13.4766V19.0755H15.4948V19.9219C15.4297 20.1823 15.2995 20.3776 15.1693 20.5729C14.974 20.7682 14.7786 20.9636 14.5182 21.0287C14.2578 21.1589 13.9974 21.224 13.6719 21.224C13.2812 21.224 12.9557 21.1589 12.6953 20.9636C12.3698 20.7682 12.1745 20.5729 11.9792 20.2474C11.7839 19.9219 11.7188 19.5964 11.7188 19.2708C11.7188 18.8802 11.7839 18.5547 11.9792 18.2943C12.1745 17.9688 12.3698 17.7734 12.6953 17.5781C13.0208 17.3828 13.3464 17.3177 13.6719 17.3177C14.1276 17.3177 14.5182 17.4479 14.8437 17.6432C15.1693 17.8386 15.3646 18.1641 15.4948 18.5547H14.4531V18.6198V18.6198Z"
              fill="#353535"
            />
            <path
              d="M13.8672 9.76563C10.5469 9.89584 7.22656 9.96094 3.90625 9.89584C3.32031 9.89584 3.32031 10.7422 3.90625 10.7422C7.22656 10.7422 10.5469 10.7422 13.8672 10.612C14.4531 10.612 14.4531 9.70052 13.8672 9.76563Z"
              fill="#FF7330"
            />
            <path
              d="M11.5886 11.5234C9.04956 11.3932 6.5105 11.3281 3.97144 11.3932C3.3855 11.3932 3.3855 12.2396 3.97144 12.2396C6.5105 12.2396 9.04956 12.3047 11.5886 12.3698C12.1095 12.4349 12.1095 11.5885 11.5886 11.5234Z"
              fill="#FF7330"
            />
            <path
              d="M15.1042 13.151C11.3932 13.151 7.61719 13.0859 3.90625 13.0859C3.32031 13.0859 3.32031 13.9323 3.90625 13.9323C7.61719 13.9323 11.3932 13.9974 15.1042 13.9974C15.6901 13.9974 15.6901 13.151 15.1042 13.151Z"
              fill="#FF7330"
            />
            <path
              d="M7.8125 14.6484C6.51042 14.6484 5.20833 14.6484 3.90625 14.6484C3.32031 14.6484 3.32031 15.4948 3.90625 15.4948C5.20833 15.4948 6.51042 15.4948 7.8125 15.4948C8.39844 15.4948 8.39844 14.6484 7.8125 14.6484Z"
              fill="#FF7330"
            />
          </svg>
        </a>
      );
    } else if (extenstion === "raf" || extenstion === "RAF") {
      return (
        <a target="_blank" title="RAF Caption">
          <svg
            width="20"
            height="25"
            viewBox="0 0 20 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.6338 0.669724C12.1874 0.223341 11.5624 0 10.9375 0H4.24113C1.91966 0 0 1.91959 0 4.24113V20.7589C0 23.0803 1.91959 25 4.24113 25H14.9552C17.2767 25 19.1963 23.0804 19.1963 20.7589L19.1961 7.90241C19.1961 7.23269 18.9282 6.56326 18.437 6.11688L12.6338 0.669724ZM17.8566 20.7588C17.8566 22.3658 16.562 23.6605 14.9549 23.6605H4.24083C2.63386 23.6605 1.33915 22.3659 1.33915 20.7588V4.24109C1.33915 2.63412 2.63379 1.33941 4.24083 1.33941H10.982V5.35716C10.982 6.69631 12.0981 7.81245 13.4373 7.81245H17.8569V7.90173L17.8566 20.7588Z"
              fill="#353535"
            />
            <path
              d="M12.6338 0.669724C12.1874 0.223341 11.5624 0 10.9375 0H4.24113C1.91966 0 0 1.91959 0 4.24113V20.7589C0 23.0803 1.91959 25 4.24113 25H14.9552C17.2767 25 19.1963 23.0804 19.1963 20.7589L19.1961 7.90241C19.1961 7.23269 18.9282 6.56326 18.437 6.11688L12.6338 0.669724ZM17.8566 20.7588C17.8566 22.3658 16.562 23.6605 14.9549 23.6605H4.24083C2.63386 23.6605 1.33915 22.3659 1.33915 20.7588V4.24109C1.33915 2.63412 2.63379 1.33941 4.24083 1.33941H10.982V5.35716C10.982 6.69631 12.0981 7.81245 13.4373 7.81245H17.8569V7.90173L17.8566 20.7588Z"
              fill="#353535"
            />
            <path
              d="M13.4081 12.6368C13.4081 13.3399 12.8381 13.9099 12.1349 13.9099C11.4318 13.9099 10.8618 13.3399 10.8618 12.6368C10.8618 11.9336 11.4318 11.3636 12.1349 11.3636C12.8381 11.3636 13.4081 11.9336 13.4081 12.6368Z"
              fill="#FF7330"
            />
            <path
              d="M4.76516 21.5484H14.7756C15.144 21.5458 15.4841 21.3496 15.6705 21.0318C15.8806 20.6778 15.893 20.2405 15.7031 19.8752L13.488 15.6922C13.374 15.4612 13.1775 15.2811 12.9373 15.1877C12.6973 15.0943 12.4308 15.0943 12.1907 15.1877C11.9505 15.2811 11.754 15.4611 11.6402 15.6922L11.1782 16.5617L9.30844 13.0297V13.0295C9.19444 12.7985 8.99811 12.6184 8.75795 12.525C8.51777 12.4316 8.25127 12.4316 8.01111 12.525C7.77094 12.6184 7.57461 12.7984 7.46062 13.0295L3.83775 19.8755C3.64792 20.2409 3.66026 20.6782 3.87039 21.0322C4.05682 21.35 4.39685 21.5462 4.7653 21.5488L4.76516 21.5484Z"
              fill="#FF7330"
            />
            <path
              d="M4.44239 4.59914V5.19914C4.35839 5.18714 4.27639 5.18114 4.19639 5.18114C3.66839 5.18114 3.40439 5.47714 3.40439 6.06914V7.51514H2.84039V4.62914H3.39239V5.13314C3.56839 4.76514 3.85639 4.58114 4.25639 4.58114C4.32039 4.58114 4.38239 4.58714 4.44239 4.59914ZM4.86351 6.74114C4.86351 6.49314 4.94351 6.29514 5.10351 6.14714C5.26351 5.99514 5.47551 5.90114 5.73951 5.86514L6.51951 5.75114C6.66751 5.73114 6.74151 5.65914 6.74151 5.53514C6.74151 5.38314 6.68951 5.25914 6.58551 5.16314C6.48151 5.06714 6.32551 5.01914 6.11751 5.01914C5.92551 5.01914 5.77351 5.07314 5.66151 5.18114C5.54951 5.28514 5.48351 5.42514 5.46351 5.60114L4.92351 5.47514C4.95151 5.19914 5.07751 4.97514 5.30151 4.80314C5.52551 4.62714 5.79351 4.53914 6.10551 4.53914C6.51351 4.53914 6.81551 4.63914 7.01151 4.83914C7.20751 5.03514 7.30551 5.28714 7.30551 5.59514V7.04114C7.30551 7.21314 7.31751 7.37114 7.34151 7.51514H6.78951C6.76951 7.39514 6.75951 7.26514 6.75951 7.12514C6.67951 7.25314 6.56151 7.36514 6.40551 7.46114C6.25351 7.55714 6.06151 7.60514 5.82951 7.60514C5.54551 7.60514 5.31351 7.52114 5.13351 7.35314C4.95351 7.18114 4.86351 6.97714 4.86351 6.74114ZM5.90751 7.13114C6.15951 7.13114 6.36151 7.06314 6.51351 6.92714C6.66551 6.79114 6.74151 6.57514 6.74151 6.27914V6.14714L5.85951 6.27914C5.73151 6.29914 5.62951 6.34514 5.55351 6.41714C5.47751 6.48914 5.43951 6.58714 5.43951 6.71114C5.43951 6.82314 5.48151 6.92114 5.56551 7.00514C5.65351 7.08914 5.76751 7.13114 5.90751 7.13114ZM9.63614 5.13914H8.94014V7.51514H8.35814V5.13914H7.82414V4.62914H8.35814V4.14314C8.35814 3.83514 8.44814 3.59314 8.62814 3.41714C8.80814 3.24114 9.03414 3.15314 9.30614 3.15314C9.47814 3.15314 9.59014 3.17314 9.64214 3.21314V3.71714C9.58214 3.69314 9.50014 3.68114 9.39614 3.68114C9.27214 3.68114 9.16414 3.71914 9.07214 3.79514C8.98414 3.86714 8.94014 3.99314 8.94014 4.17314V4.62914H9.63614V5.13914Z"
              fill="#353535"
            />
          </svg>
        </a>
      );
    } else if (extenstion === "xmp" || extenstion === "XMP") {
      return (
        <a target="_blank" title="RAF Caption">
          <svg
            width="20"
            height="25"
            viewBox="0 0 20 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.6338 0.669724C12.1874 0.223341 11.5624 0 10.9375 0H4.24113C1.91966 0 0 1.91959 0 4.24113V20.7589C0 23.0803 1.91959 25 4.24113 25H14.9552C17.2767 25 19.1963 23.0804 19.1963 20.7589L19.1961 7.90241C19.1961 7.23269 18.9282 6.56326 18.437 6.11688L12.6338 0.669724ZM17.8566 20.7588C17.8566 22.3658 16.562 23.6605 14.9549 23.6605H4.24083C2.63386 23.6605 1.33915 22.3659 1.33915 20.7588V4.24109C1.33915 2.63412 2.63379 1.33941 4.24083 1.33941H10.982V5.35716C10.982 6.69631 12.0981 7.81245 13.4373 7.81245H17.8569V7.90173L17.8566 20.7588Z"
              fill="#353535"
            />
            <path
              d="M4.23584 20.3993L5.30984 18.9293L4.27184 17.5133H4.95584L5.66384 18.5273L6.35984 17.5133H7.02584L5.99984 18.9293C6.05984 19.0053 6.23784 19.2513 6.53384 19.6673C6.82984 20.0793 7.00584 20.3233 7.06184 20.3993H6.38384L5.63984 19.3373L4.90784 20.3993H4.23584Z"
              fill="#353535"
            />
            <path
              d="M8.16111 20.3993H7.60311V17.5133H8.14311V17.8973C8.23111 17.7453 8.35511 17.6293 8.51511 17.5493C8.67511 17.4693 8.84311 17.4293 9.01911 17.4293C9.20711 17.4293 9.37911 17.4753 9.53511 17.5673C9.69111 17.6593 9.80711 17.7953 9.88311 17.9753C10.0831 17.6113 10.4051 17.4293 10.8491 17.4293C11.1251 17.4293 11.3591 17.5233 11.5511 17.7113C11.7471 17.8993 11.8451 18.1713 11.8451 18.5273V20.3993H11.2871V18.5873C11.2871 18.3873 11.2351 18.2273 11.1311 18.1073C11.0311 17.9873 10.8791 17.9273 10.6751 17.9273C10.4791 17.9273 10.3191 17.9973 10.1951 18.1373C10.0711 18.2733 10.0091 18.4453 10.0091 18.6533V20.3993H9.44511V18.5873C9.44511 18.3873 9.39311 18.2273 9.28911 18.1073C9.18911 17.9873 9.03711 17.9273 8.83311 17.9273C8.63311 17.9273 8.47111 17.9953 8.34711 18.1313C8.22311 18.2673 8.16111 18.4433 8.16111 18.6593V20.3993Z"
              fill="#353535"
            />
            <path
              d="M13.3056 21.5393H12.7476V17.5133H13.2936V17.9633C13.3776 17.8113 13.5036 17.6873 13.6716 17.5913C13.8396 17.4953 14.0356 17.4473 14.2596 17.4473C14.6756 17.4473 14.9996 17.5893 15.2316 17.8733C15.4676 18.1573 15.5856 18.5173 15.5856 18.9533C15.5856 19.3933 15.4636 19.7573 15.2196 20.0453C14.9796 20.3333 14.6536 20.4773 14.2416 20.4773C14.0296 20.4773 13.8416 20.4333 13.6776 20.3453C13.5136 20.2573 13.3896 20.1453 13.3056 20.0093V21.5393ZM15.0096 18.9533C15.0096 18.6613 14.9316 18.4213 14.7756 18.2333C14.6236 18.0413 14.4176 17.9453 14.1576 17.9453C13.9016 17.9453 13.6936 18.0413 13.5336 18.2333C13.3776 18.4213 13.2996 18.6613 13.2996 18.9533C13.2996 19.2533 13.3776 19.4993 13.5336 19.6913C13.6936 19.8793 13.9016 19.9733 14.1576 19.9733C14.4136 19.9733 14.6196 19.8793 14.7756 19.6913C14.9316 19.4993 15.0096 19.2533 15.0096 18.9533Z"
              fill="#353535"
            />
            <path
              d="M8.3457 8C7.04362 8 5.74154 8 4.43945 8C3.85352 8 3.85352 8.84635 4.43945 8.84635C5.74154 8.84635 7.04362 8.84635 8.3457 8.84635C8.93164 8.84635 8.93164 8 8.3457 8Z"
              fill="#FF7330"
            />
            <path
              d="M8.3457 6C7.04362 6 5.74154 6 4.43945 6C3.85352 6 3.85352 6.84635 4.43945 6.84635C5.74154 6.84635 7.04362 6.84635 8.3457 6.84635C8.93164 6.84635 8.93164 6 8.3457 6Z"
              fill="#FF7330"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10 10.5H5C4.72386 10.5 4.5 10.7239 4.5 11V14C4.5 14.2761 4.72386 14.5 5 14.5H10C10.2761 14.5 10.5 14.2761 10.5 14V11C10.5 10.7239 10.2761 10.5 10 10.5ZM5 10C4.44772 10 4 10.4477 4 11V14C4 14.5523 4.44772 15 5 15H10C10.5523 15 11 14.5523 11 14V11C11 10.4477 10.5523 10 10 10H5Z"
              fill="#FF7330"
            />
          </svg>
        </a>
      );
    } else {
      return (
        <a
          onClick={(e) => {
            scrollUp(e);
          }}
          title="Image Caption"
        >
          <img
            id="images"
            src={`${process.env.REACT_APP_AWS_DSP_AWS_URL}job_${job_detail_id}/photographer_extra/thumbnail/${image}`}
          />
        </a>
      );
    }
  };

  useEffect(() => {
    if (lastList && prevPage !== currPage) {
      onHandleFetchMoreImages();
    }
  }, [currPage, lastList, prevPage]);

  /* manage infinite scroll */
  const onHandleInfiniteScroll = () => {
    if (onScrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = onScrollRef.current;
      if (scrollTop + clientHeight + 2 > scrollHeight && lastList) {
        setCurrPage(currPage + 1);
      }
    }
  };

  /* fetch more images */
  const onHandleFetchMoreImages = useCallback(() => {
    if (scrollTab == 1) {
      setUppyAnchorProductionMediaFlag(true);
      let getImageListPayload = {
        user_profile_id: user_profile_id,
        job_id: parseInt(job_detail_id),
        page: currPage,
      };
      dispatch(
        imagesType({
          getImageListPayload,
          callback: async (result) => {
            if (result) {
              setUppyAnchorProductionMediaFlag(false);
              setLastList(result.has_more);
              setPrevPage(currPage);
              const arrayMap = result?.data?.map((ele) => ele?.image_name);
              const removeDuplicate = [...imageArray, ...arrayMap];
              const removeDuplicateImageName = [...new Set(removeDuplicate)];
              setTotalImage(result?.total);
              setImageArray(removeDuplicateImageName);
              // setImageArray(removeDuplicateImageName);
            }
          },
        })
      );
    } else if (scrollTab == 2) {
      setUppyAnchorProductionBriefFlag(true);
      let getImageListProductionPayload = {
        job_id: parseInt(job_detail_id),
        page: currPage,
      };
      dispatch(
        getPhotographerProductionAdditionalMedia({
          getImageListProductionPayload,
          callback: async (result) => {
            if (result) {
              setUppyAnchorProductionBriefFlag(false);
              setLastList(result.has_more);
              setPrevPage(currPage);
              setTotalImagesAdditionalProduction(result?.total);

              const arrayMap = result?.data?.map(
                (ele) => ele?.extra_image_name
              );
              const removeDuplicate = [...imageProductionAdditionalArray, ...arrayMap];
              const removeDuplicateImageName = [...new Set(removeDuplicate)];
              setImageProductionAdditionalArray(removeDuplicateImageName);
            }
          },
        })
      );
    }
  }, [currPage, imageArray]);

  /* open slider modal */
  const onHandleOpenSliderModal = () => {
    setIsOpenSliderModal(true);
  };

  const onHandleClose = () => {
    setIsOpenSliderModal(false);
  };

  const handleClass = (extenstion) => {
    if (
      extenstion === "xlsx" ||
      "xls" ||
      "pdf" ||
      "CR2" ||
      "cr2" ||
      "ARW" ||
      "arw" ||
      "NEF" ||
      "nef" ||
      "CDR" ||
      "cdr" ||
      "cr3" ||
      "CR3" ||
      "dng" ||
      "DNG" ||
      "raf" ||
      "RAF"
    ) {
      //console.log("hello")
      return "photography media-svg-icon";
    } else {
      return "photography";
    }
  };
  // $(document).ready(function () {
  //   var ctx = document.createElement("canvas").getContext("2d");
  //   var img = new Image();
  //   img.onload = () => {
  //     ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
  //     ctx.fillText("COPYRIGHT", 10, 30);
  //   };

  //   $(".steps").on("click", ".step--active", function () {
  //     $(this).removeClass("step--incomplete").addClass("step--complete");
  //     $(this).removeClass("step--active").addClass("step--inactive");
  //     $(this).next().removeClass("step--inactive").addClass("step--active");
  //   });

  //   $(".steps").on("click", ".step--complete", function () {
  //     $(this).removeClass("step--complete").addClass("step--incomplete");
  //     $(this).removeClass("step--inactive").addClass("step--active");
  //     $(this)
  //       .nextAll()
  //       .removeClass("step--complete")
  //       .addClass("step--incomplete");
  //     $(this).nextAll().removeClass("step--active").addClass("step--inactive");
  //   });

  //   // uppy event trigger
  //   $(".uppy-DashboardContent-addMore").on("click", function (event) {
  //     event.stopPropagation();
  //     event.stopImmediatePropagation();
  //     setFileFlag(false);
  //   });

  //   $(".uppy-DashboardContent-back").on("click", function (event) {
  //     event.stopPropagation();
  //     event.stopImmediatePropagation();
  //     setFileFlag(true);
  //   });

  //   $("#contact-tab, #media-tab, #profile-tab").click(function () {
  //     setAfterReloadActiveTab(false);
  //   });

  //   $(document).ready(function () {
  //     $(".uppy-Dashboard-Item-name").on("change", function (e) {
  //       e.preventDefault();
  //     });
  //   });

  //   $("a.uppy-Dashboard-poweredBy").prop("href", "https://medas-digital.com");
  // });jobDetail?.photographer_accept

  return (
    <>
      {imageLinkOpen && (
        <div
          className={`modal fade awesome-modal ${
            imageLinkOpen ? "show d-block bg-blur" : "d-none"
          }`}
        >
          <div className="modal-dialog modal-confirm">
            <div className="modal-content">
              <div className="modal-header">
                <div className="icon-box">
                  <svg
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.9152 3.28288C13.1732 3.5122 13.1965 3.90724 12.9671 4.16523L6.30047 11.6652C6.18187 11.7987 6.01186 11.875 5.83334 11.875C5.65482 11.875 5.48481 11.7987 5.36621 11.6652L2.03288 7.91523C1.80355 7.65724 1.82679 7.2622 2.08478 7.03288C2.34277 6.80355 2.73781 6.82679 2.96714 7.08478L5.83334 10.3093L12.0329 3.33478C12.2622 3.07679 12.6572 3.05355 12.9152 3.28288Z"
                      fill="white"
                    ></path>
                  </svg>
                </div>
                <h4 className="modal-title w-100">{t("THANK_YOU")}</h4>
              </div>
              <div className="modal-body">
                <p className="text-center">{imageLinkMessage}</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-success btn-block text-uppercase"
                  onClick={(e) => setImageLinkOpen(false)}
                >
                  ok
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isUppyOpen && (
        <div
          className={`modal fade ${
            isUppyOpen ? "show d-block bg-blur" : "d-none"
          }`}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-3">
              <div className="modal-body">
                <div className="row justify-content-center">
                  <div className="col-11 text-center">
                    <h6>{t("AFTER_FILE_UPLOAD_MESSAGE")}</h6>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-11 text-center"></div>
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                <Button
                  text={t("OKAY")}
                  className="h-25 text-uppercase"
                  // onClick={(e) => setPublishOpen(false)}
                  onClick={(e) => afterApiResponseOfUppy(e)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
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
                <div className="row justify-content-center">
                  <div className="col-11 text-center">
                    <span className="reason-popup">{t("REJECTED")}</span>
                    <h5>{t("REASON_FOR_REJECTION")}?</h5>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-11 text-center">
                    {/* <Input
                                            type="textarea"
                                            className=""
                                            name="reason"
                                            value={form?.reason}
                                            onChange={(e) => { changeHandler(e) }}
                                            error={error?.reason}
                                            maxLength="100"
                                            label="reason"
                                        /> */}
                    <Textarea
                      name="reason"
                      value={form?.reason}
                      onChange={(e) => {
                        changeHandler(e);
                      }}
                      // placeholder="Enter reason"
                      error={error?.reason}
                      label={t("ENTER_REASON")}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer d-flex justify-content-center">
                {/* <Button
                                    text="NO"
                                    className="model-button-width"
                                    // onClick={() => setPublishOpen(false)}
                                /> */}
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
        {uploadImageLoader ? (
          <div className="file-upload">
            <div className="file-upload-inner">
              <p>{t("PLEASE_DO_NOT_RELOAD")}</p>
            </div>
          </div>
        ) : (
          ""
        )}
        <Header
          logoutFlag={uploadImageLoader}
          isJob={true}
          langSelector={true}
          calendar={true}
        />
        <div className="content dashboard-background">
          <img
            onClick={() => history.push("/dashboard")}
            src={leftArrowIcon}
            className="sm:ps-5 arrow arrow-left cursor-pointer"
            alt="logo"
          />
          <div className="cards-section dashboard-sec intro-card">
            <div className="row m-0">
              <div className="col-md-12 intro-card-right">
                <div className="row m-0">
                  <div className="col-md-12 col-lg-12 col-xxl-12 upload-media">
                    <div className="upload-media-inner d-flex flex-wrap justify-content-between">
                      {/* preset top start */}
                      <div
                        className={`d-flex prtab_heading  flex-wrap justify-content-sm-start position-relative`}
                      >
                        <div
                          className={`tags-top ${
                            jobDetail?.in_process === 1
                              ? "dark-green-left-border-production"
                              : jobDetail?.in_process === 2 &&
                                jobDetail?.is_raise_invoice_photogpraher === 1
                              ? "black-left-border-completed"
                              : jobDetail?.in_process === 3
                              ? "orange-left-border-on-review"
                              : jobDetail?.in_process === 4
                              ? "red-left-border-rejected"
                              : jobDetail?.in_process === 5 &&
                                jobDetail?.is_raise_invoice_photogpraher === 1
                              ? "black-left-border-completed"
                              : jobDetail?.in_process === 6 ||
                                jobDetail?.in_process === "6"
                              ? "purple-left-border-completed"
                              : jobDetail?.in_process === 7 &&
                                jobDetail?.is_raise_invoice_photogpraher === 1
                              ? "black-left-border-completed"
                              : jobDetail?.in_process === 7 &&
                                jobDetail?.is_raise_invoice_photogpraher === 0
                              ? "orange-left-border-on-review"
                              : jobDetail?.in_process === 5 &&
                                jobDetail?.is_raise_invoice_photogpraher === 0
                              ? "orange-left-border-on-review"
                              : jobDetail?.in_process === 2 &&
                                jobDetail?.is_raise_invoice_photogpraher === 0
                              ? "orange-left-border-on-review"
                              : "orange-left-border-on-review"
                          }`}
                        >
                          <div className="d-flex">
                            <span className="pr-tag">
                              {jobDetail?.in_process === 1
                                ? "Active Shoot"
                                : jobDetail?.in_process === 2 &&
                                  jobDetail?.is_raise_invoice_photogpraher === 1
                                ? "Completed"
                                : jobDetail?.in_process === 3
                                ? "In Review"
                                : jobDetail?.in_process === 4
                                ? "Rejected"
                                : jobDetail?.in_process === 5 &&
                                  jobDetail?.is_raise_invoice_photogpraher === 1
                                ? "Completed"
                                : jobDetail?.in_process === 6 ||
                                  jobDetail?.in_process === "6"
                                ? "Re-upload requested"
                                : jobDetail?.in_process === 7 &&
                                  jobDetail?.is_raise_invoice_photogpraher === 1
                                ? "Completed"
                                : jobDetail?.in_process === 7 &&
                                  jobDetail?.is_raise_invoice_photogpraher === 0
                                ? "In Review"
                                : jobDetail?.in_process === 5 &&
                                  jobDetail?.is_raise_invoice_photogpraher === 0
                                ? "In Review"
                                : jobDetail?.in_process === 2 &&
                                  jobDetail?.is_raise_invoice_photogpraher === 0
                                ? "In Review"
                                : "New"}
                            </span>
                          </div>
                          <h5>
                            {jobDetail?.job_card_number} ({totalImages}{" "}
                            {t("MEDIA")})
                          </h5>
                          <div className="card_detail_label">
                            <span className="category-data">
                              {jobDetail?.category_name || ""}
                            </span>
                          </div>
                        </div>
                        <div className="tags_heading">
                          <div className="d-flex align-items-start">
                            <div className="profile_name">
                              {jobDetail?.producer_profile_image ? (
                                <img
                                  src={`${process.env.REACT_APP_AWS_DSP_AWS_URL}profile_${jobDetail?.producer_id}/${jobDetail?.producer_profile_image}`}
                                  alt="profile"
                                />
                              ) : (
                                <span>
                                  {jobDetail?.producer_name?.split("")[0]}
                                </span>
                              )}
                            </div>
                            <div className="profile_detail ms-3">
                              <h2 className=""> {jobDetail?.producer_name}</h2>
                              <div className="d-flex mt-1">
                                <span className="text-gray font-22 text-capitalize">
                                  {t("PRODUCER")}
                                </span>
                                <a
                                  className="gray-btn ms-3"
                                  href={`mailto:${jobDetail?.producer_contact}`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 14 14"
                                    fill="none"
                                  >
                                    <path
                                      d="M1.16699 3.49967C1.16699 2.85534 1.68933 2.33301 2.33366 2.33301H11.667C12.3113 2.33301 12.8337 2.85534 12.8337 3.49967V10.4997C12.8337 11.144 12.3113 11.6663 11.667 11.6663H2.33366C1.68933 11.6663 1.16699 11.144 1.16699 10.4997V3.49967ZM3.2195 3.49967L7.00033 6.80789L10.7811 3.49967H3.2195ZM11.667 4.27479L7.38445 8.02201C7.16452 8.21445 6.83613 8.21445 6.6162 8.02201L2.33366 4.27479V10.4997H11.667V4.27479Z"
                                      fill="#353535"
                                    />
                                  </svg>
                                  {t("CONTACT_PRODUCER")}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`btn-wrap-block ${
                            job_detail?.photographer_accept === "1" ||
                            jobDetail?.in_process === "2"
                              ? "text-center"
                              : ""
                          } `}
                        >
                          {job_detail?.photographer_accept === "0" ||
                          job_detail?.photographer_accept === null ? (
                            <>
                              <a
                                onClick={(e) => {
                                  accept(e);
                                }}
                                className="primary cursor-pointer"
                              >
                                {t("ACCEPT")}
                              </a>
                              <a
                                onClick={(e) => {
                                  reject(e);
                                }}
                                className="secondary cursor-pointer"
                              >
                                {t("REJECT")}
                              </a>
                            </>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      {/* tab start */}
                      <div className="d-flex justify-content-center preset_tab ">
                        <nav>
                          <div
                            className="nav nav-tabs"
                            id="myTab"
                            role="tablist"
                          >
                            {/*CUSTOMER DETAILS*/}
                            <li
                              onClick={(e) => {
                                tabSwitch(e, "customer_details");
                              }}
                              className="nav-item"
                              role="presentation"
                            >
                              <a
                                className={`nav-link ${
                                  tabViews[0]?.isActive ? "active" : ""
                                }`}
                                id="home-tab"
                                type="button"
                                role="tab"
                              >
                                {t("CUSTOMER_DETAILS")}
                              </a>
                            </li>
                            {/*PROJECT DETAILS*/}
                            <li
                              onClick={(e) => {
                                tabSwitch(e, "project_details");
                              }}
                              className="nav-item"
                              role="presentation"
                            >
                              <a
                                className={`nav-link ${
                                  tabViews[1]?.isActiveGreen
                                    ? "active green-active"
                                    : tabViews[1]?.isActive
                                    ? "active"
                                    : ""
                                }`}
                                type="button"
                                role="tab"
                              >
                                {t("PROJECT_DETAILS")}
                              </a>
                            </li>
                            {/*PRODUCTION BRIEF WITH SUMMARY*/}
                            <li
                              onClick={(e) => {
                                tabSwitch(e, "production_brief");
                                setScrollTab("2");
                              }}
                              className="nav-item"
                              role="presentation"
                            >
                              <a
                                className={`nav-link ${
                                  tabViews[2]?.isActiveGreen
                                    ? "active green-active"
                                    : tabViews[2]?.isActive
                                    ? "active"
                                    : ""
                                }`}
                                type="button"
                                role="tab"
                              >
                                {t("PRODUCTION_BRIEF_WITH_SUMMARY")}
                              </a>
                            </li>
                            {/*PRODUCTION MEDIA*/}
                            <li
                              onClick={(e) => {
                                tabSwitch(e, "production_media");
                                setScrollTab("1");
                              }}
                              className="nav-item"
                              role="presentation"
                            >
                              <a
                                className={`nav-link ${
                                  tabViews[3]?.isActiveGreen
                                    ? "active green-active"
                                    : tabViews[3]?.isActive
                                    ? "active"
                                    : ""
                                }`}
                                type="button"
                                role="tab"
                              >
                                {t("PRODUCTION_MEDIA")}
                              </a>
                            </li>
                            {/*BILLING DETAILS*/}
                            {tabViews[4]?.isActiveBody ? (
                              <li
                                onClick={(e) => {
                                  tabSwitch(e, "billing_details");
                                }}
                                className={`nav-item`}
                                role="presentation"
                              >
                                <a
                                  className={`nav-link ${
                                    tabViews[4]?.isActiveGreen
                                      ? "active green-active"
                                      : tabViews[4]?.isActive
                                      ? "active"
                                      : ""
                                  }`}
                                  type="button"
                                  role="tab"
                                >
                                  {t("BILLING_DETAILS")}
                                </a>
                              </li>
                            ) : (
                              ""
                            )}
                            {/* {jobDetail?.in_process !== undefined && (jobDetail?.in_process === 2 || jobDetail?.in_process === 5 || jobDetail?.in_process === 7) ? <li className={`nav-item`} role="presentation">
                              <a className={`nav-link ${((jobDetail?.in_process === 2 || jobDetail?.in_process === 5 || jobDetail?.in_process === 7) && jobDetail?.in_process !== undefined) ? "active green-active" : ""}`} id="billing-info" data-bs-toggle="tab" data-bs-target="#billing-info-pane" type="button" role="tab" aria-controls="billing-info-pane" aria-selected="false">{t("BILLING_DETAILS")}</a>
                            </li> : ""} */}
                          </div>
                        </nav>
                        <div className="tab-content" id="myTabContent">
                          {/*CUSTOMER DETAILS*/}
                          <div
                            className={`tab-pane fade ${
                              tabViews[0]?.isActive ? "active show" : ""
                            }`}
                            id="home-tab-pane"
                            role="tabpanel"
                          >
                            {/*TITLE*/}
                            <h3 className="tab-title">
                              {t("CUSTOMER_DETAILS")}
                            </h3>
                            {/*CONTENT*/}
                            <div className="card-block">
                              {job_detail?.in_process === 0 ? (
                                <div className="upload-media-cards position-relative">
                                  <div className="accept-job-text">
                                    <h2>{t("PLEASE_ACCEPT_JOB_TEXT")}</h2>
                                  </div>{" "}
                                </div>
                              ) : (
                                <>
                                  <div className="d-flex card-middle-row">
                                    <div className="user-card-details d-flex">
                                      <div className="label-card">
                                        {t("NAME")}
                                      </div>
                                      <div className="card-data">
                                        {job_detail_preset?.customer_details
                                          ?.name || "-"}
                                      </div>
                                    </div>
                                    <div className="user-card-details d-flex">
                                      <div className="label-card">
                                        {t("COMPANY_NAME")}
                                      </div>
                                      <div className="card-data">
                                        {job_detail_preset?.customer_details
                                          ?.company_name || "-"}
                                      </div>
                                    </div>
                                    <div className="user-card-details d-flex">
                                      <div className="label-card">
                                        {t("EMAIL")}
                                      </div>
                                      <div className="card-data">
                                        {job_detail_preset?.customer_details
                                          ?.Email || "-"}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="d-flex card-middle-row">
                                    <div className="user-card-details d-flex">
                                      <div className="label-card">
                                        {t("COMPANY_LOCATION")}
                                      </div>
                                      <div className="card-data">
                                        {job_detail_preset?.customer_details
                                          ?.company_location || "-"}
                                      </div>
                                    </div>
                                    <div className="user-card-details d-flex">
                                      <div className="label-card">
                                        {t("AUTHORIZE_CONTACT")}
                                      </div>
                                      <div className="card-data">
                                        {job_detail_preset?.customer_details
                                          ?.authorize_contact || "-"}
                                      </div>
                                    </div>
                                    <div className="user-card-details d-flex">
                                      <div className="label-card">
                                        {t("VAT_NUMBER")}
                                      </div>
                                      <div className="card-data">
                                        {job_detail_preset?.customer_details
                                          ?.vat_number || "-"}
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          {/*PROJECT DETAILS*/}
                          <div
                            className={`tab-pane fade ${
                              tabViews[1]?.isActive
                                ? "active green-active show"
                                : ""
                            }`}
                            id="profile-tab-pane"
                            role="tabpanel"
                          >
                            <h3 className="tab-title">
                              {t("PROJECT_DETAILS")}
                            </h3>
                            <div className="card-block">
                              <div className="d-flex card-middle-row">
                                <div className="user-card-details d-flex">
                                  <div className="label-card">
                                    {t("SHOOTING_DATE")}
                                  </div>
                                  <div className="card-data">
                                    {job_detail_preset?.project_details
                                      ?.date_of_shoot || "-"}
                                  </div>
                                </div>
                                <div className="user-card-details d-flex">
                                  <div className="label-card">
                                    {t("JOB_CATEGORY")}
                                  </div>
                                  <div className="card-data">
                                    {job_detail_preset?.project_details
                                      ?.category_name || "-"}
                                  </div>
                                </div>
                                <div className="user-card-details d-flex">
                                  <div className="label-card">
                                    {t("NAME_OF_PROJECT")}
                                  </div>
                                  <div className="card-data">
                                    {job_detail_preset?.project_details
                                      ?.name_of_project || "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex card-middle-row">
                                <div className="user-card-details d-flex">
                                  <div className="label-card">
                                    {t("REFERENCE_CONTACT")}
                                  </div>
                                  <div className="card-data">
                                    {job_detail_preset?.customer_details
                                      ?.ref_contact || "-"}
                                  </div>
                                </div>
                                <div className="user-card-details d-flex">
                                  <div className="label-card">
                                    {t("REFERENCE_ADDRESS")}
                                  </div>
                                  <div className="card-data">
                                    {job_detail_preset?.customer_details
                                      ?.ref_address || "-"}
                                  </div>
                                </div>

                                <div className="user-card-details d-flex">
                                  <div className="label-card">
                                    {t("BILLING_ADDRESS")}
                                  </div>
                                  <div className="card-data">
                                    {job_detail_preset?.customer_details
                                      ?.billing_address || "-"}
                                  </div>
                                </div>
                              </div>

                              <div className="d-flex card-middle-row">
                                <div className="user-card-details d-flex">
                                  <div className="label-card">
                                    {t("PAYMENT_TYPE")}
                                  </div>
                                  <div className="card-data">
                                    {job_detail_preset?.customer_details
                                      ?.payment_type || "-"}
                                  </div>
                                </div>
                                <div className="user-card-details d-flex">
                                  <div className="label-card">
                                    {t("ADDITIONAL_INSTRUCTION")}
                                  </div>
                                  <div className="card-data">
                                    {job_detail_preset?.customer_details
                                      ?.additional_instruction || "-"}
                                  </div>
                                </div>
                                <div className="user-card-details d-flex">
                                  <div className="label-card"></div>
                                  <div className="card-data"></div>
                                </div>
                              </div>

                              <div className="d-flex card-middle-row">
                                <div className="user-card-details d-flex">
                                  <div className="label-card">
                                    {t("SHOOT_TYPE")}
                                  </div>
                                  <ul>
                                    {job_detail_preset?.project_details?.shoot_type?.map(
                                      (shootType, index) => {
                                        return (
                                          <li key={index} className="card-data">
                                            {shootType}
                                          </li>
                                        );
                                      }
                                    )}
                                  </ul>
                                </div>
                              </div>

                              <div className="d-flex">
                                <div className="user-card-details">
                                  <div className="label-card">
                                    {t("PROJECT_LOCATION")}
                                  </div>
                                  <div className="card-data">
                                    {job_detail_preset?.project_details
                                      ?.project_location || "-"}
                                  </div>
                                  <div id="map">
                                    {job_detail_preset?.project_details
                                      ?.project_location_lat &&
                                    job_detail_preset?.project_details
                                      ?.project_location_long ? (
                                      <Map
                                        latitude={
                                          job_detail_preset?.project_details
                                            ?.project_location_lat
                                        }
                                        longitude={
                                          job_detail_preset?.project_details
                                            ?.project_location_long
                                        }
                                        address={
                                          job_detail_preset?.project_details
                                            ?.project_location
                                        }
                                      />
                                    ) : (
                                      <img src={searchMap} alt="" />
                                    )}
                                  </div>
                                </div>
                                {/* <div className="user-card-details d-flex">
                                  <div className="label-card"></div>
                                  <div className="card-data"></div>
                                </div>
                                <div className="user-card-details d-flex">
                                  <div className="label-card"></div>
                                  <div className="card-data"></div>
                                </div> */}
                              </div>
                            </div>
                          </div>
                          {/*PRODUCTION BRIEF WITH SUMMARY*/}
                          <div
                            className={`tab-pane fade ${
                              tabViews[2]?.isActive
                                ? "active green-active show"
                                : ""
                            }`}
                            id="contact-tab-pane"
                            role="tabpanel"
                          >
                            {/*TITLE*/}
                            <h3 className="tab-title">
                              {t("PRODUCTION_BRIEF_WITH_SUMMARY")}
                            </h3>
                            {/*CONTENT*/}
                            <div className="card-block">
                              <div className="d-flex card-middle-row">
                                <div className="user-card-details d-flex">
                                  <div className="label-card">
                                    {t("APERTURE")}
                                  </div>
                                  <div className="card-data">
                                    {job_detail_preset
                                      ?.production_brif_with_summary
                                      ?.aperture || "-"}
                                  </div>
                                </div>
                                <div className="user-card-details d-flex">
                                  <div className="label-card">
                                    {t("BROADCASTING")}
                                  </div>
                                  <div className="card-data">
                                    {job_detail_preset
                                      ?.production_brif_with_summary
                                      ?.broadcasting || "-"}
                                  </div>
                                </div>
                                <div className="user-card-details d-flex">
                                  <div className="label-card">
                                    {t("CAMERA_MODE")}
                                  </div>
                                  <div className="card-data">
                                    {job_detail_preset
                                      ?.production_brif_with_summary
                                      ?.camera_mode || "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex card-middle-row">
                                <div className="user-card-details d-flex">
                                  <div className="label-card">
                                    {t("CAMERA_POSITION")}
                                  </div>
                                  <div className="card-data">
                                    {job_detail_preset
                                      ?.production_brif_with_summary
                                      ?.camera_position || "-"}
                                  </div>
                                </div>
                                <div className="user-card-details d-flex">
                                  <div className="label-card">
                                    {t("CAMERA_SENSOR")}
                                  </div>
                                  <div className="card-data">
                                    {job_detail_preset
                                      ?.production_brif_with_summary
                                      ?.camera_sensor || "-"}
                                  </div>
                                </div>
                                <div className="user-card-details d-flex">
                                  <div className="label-card">
                                    {t("DELIVERY")}
                                  </div>
                                  <div className="card-data">
                                    {job_detail_preset
                                      ?.production_brif_with_summary
                                      ?.delivery || "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex card-middle-row">
                                <div className="user-card-details d-flex">
                                  <div className="label-card">{t("EXTRA")}</div>
                                  <div className="card-data">
                                    {job_detail_preset
                                      ?.production_brif_with_summary?.extras ||
                                      "-"}
                                  </div>
                                </div>
                                <div className="user-card-details d-flex">
                                  <div className="label-card">{t("FILE")}</div>
                                  <div className="card-data">
                                    {job_detail_preset
                                      ?.production_brif_with_summary?.file ||
                                      "-"}
                                  </div>
                                </div>
                                <div className="user-card-details d-flex">
                                  <div className="label-card">ISO</div>
                                  <div className="card-data">
                                    {job_detail_preset
                                      ?.production_brif_with_summary?.iso ||
                                      "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex card-middle-row">
                                <div className="user-card-details d-flex">
                                  <div className="label-card">{t("LENS")}</div>
                                  <div className="card-data">
                                    {job_detail_preset
                                      ?.production_brif_with_summary?.lens ||
                                      "-"}
                                  </div>
                                </div>
                                <div className="user-card-details d-flex">
                                  <div className="label-card">{t("LIGHT")}</div>
                                  <div className="card-data">
                                    {job_detail_preset
                                      ?.production_brif_with_summary?.light ||
                                      "-"}
                                  </div>
                                </div>
                                <div className="user-card-details d-flex">
                                  <div className="label-card">
                                    {t("MEMORY_CARD")}
                                  </div>
                                  <div className="card-data">
                                    {job_detail_preset
                                      ?.production_brif_with_summary
                                      ?.memory_card || "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex card-middle-row">
                                <div className="user-card-details d-flex">
                                  <div className="label-card">
                                    {t("REMOTE_CONTROLLER")}
                                  </div>
                                  <div className="card-data">
                                    {job_detail_preset
                                      ?.production_brif_with_summary
                                      ?.remote_controller || "-"}
                                  </div>
                                </div>
                                <div className="user-card-details d-flex">
                                  <div className="label-card">
                                    {t("TRIPODS")}
                                  </div>
                                  <div className="card-data">
                                    {job_detail_preset
                                      ?.production_brif_with_summary?.tripod ||
                                      "-"}
                                  </div>
                                </div>
                                <div className="user-card-details d-flex">
                                  <div className="label-card">{t("VIEWS")}</div>
                                  <div className="card-data">
                                    {job_detail_preset
                                      ?.production_brif_with_summary?.views ||
                                      "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="d-flex card-middle-row">
                                <div className="user-card-details d-flex">
                                  <div className="label-card">
                                    {t("WHITE_BALANCE")}
                                  </div>
                                  <div className="card-data">
                                    {job_detail_preset
                                      ?.production_brif_with_summary
                                      ?.white_balance || "-"}
                                  </div>
                                </div>
                                <div className="user-card-details d-flex">
                                  <div className="label-card">
                                    {t("SETTING")}
                                  </div>
                                  <div className="card-data">
                                    {job_detail_preset
                                      ?.production_brif_with_summary?.setting ||
                                      "-"}
                                  </div>
                                </div>
                                <div className="user-card-details d-flex">
                                  <div className="label-card"></div>
                                  <div className="card-data"></div>
                                </div>
                              </div>
                              <div className="d-flex card-middle-row">
                                <div className="user-card-details d-flex">
                                  <div className="label-card">
                                    {t("ADDITIONAL_PRODUCTION_INFORMATION")}
                                  </div>
                                  <div className="card-data">
                                    {job_detail_preset?.comment_box || "-"}
                                  </div>
                                </div>
                                <div className="user-card-details d-flex">
                                  <div className="label-card"></div>
                                  <div className="card-data"></div>
                                </div>
                                <div className="user-card-details d-flex">
                                  <div className="label-card"></div>
                                  <div className="card-data"></div>
                                </div>
                              </div>
                            </div>

                            {imageProductionAdditionalArray?.length > 0 && (
                              <div
                                className="card-block"
                                style={{ marginTop: "40px" }}
                              >
                                <div className="job-detail-left position-relative media-gallery">
                                  <h3 className="fs-3 upload-media-title">
                                    {imageProductionAdditionalArray?.length > 0
                                      ? `${t(
                                          "ADDITIONAL_PRODUCTION_MEDIA"
                                        )} (${totalImagesAdditionalProduction})`
                                      : ""}
                                  </h3>

                                  <div
                                    onScroll={onHandleInfiniteScroll}
                                    ref={onScrollRef}
                                    className={`without-drop-flex ${
                                      totalImagesAdditionalProduction > 12 &&
                                      "img-scroll"
                                    } ${
                                      imageProductionAdditionalArray?.length > 0 &&
                                      "upload-media-cards"
                                    }
                                }`}
                                  >
                                    <div
                                      className={`${
                                        imageProductionAdditionalArray?.length >
                                        0
                                          ? "upload-media-cards-one portfolioContainer gallery-one"
                                          : "upload-media-body-text-center"
                                      }`}
                                    >
                                      {imageProductionAdditionalArray?.length >
                                      0 ? (
                                        imageProductionAdditionalArray?.map(
                                          (image, index) => {
                                            if (
                                              fileExtensionVideo?.includes(
                                                image?.split(".")?.slice(-1)[0]
                                              )
                                            ) {
                                              return (
                                                <div
                                                  key={index}
                                                  className={`media-one media-video`}
                                                >
                                                  <Player>
                                                    <source
                                                      src={`${process.env.REACT_APP_AWS_DSP_AWS_URL}job_${job_detail_id}/photographer_extra/${image}`}
                                                    />
                                                    <ControlBar
                                                      autoHide={false}
                                                    />
                                                  </Player>
                                                </div>
                                              );
                                            } else {
                                              return (
                                                <div
                                                  key={index}
                                                  className={`media-one media-image`}
                                                  onClick={() =>
                                                    onHandleOpenSliderModal()
                                                  }
                                                >
                                                  <div
                                                    className={handleClass(
                                                      image.split(".")[1]
                                                    )}
                                                  >
                                                    {handleImage(
                                                      image,
                                                      image.split(".")[1]
                                                    )}
                                                  </div>
                                                </div>
                                              );
                                            }
                                          }
                                        )
                                      ) : (
                                        <></>
                                      )}
                                    </div>
                                    <div
                                      className={`${
                                        imageProductionAdditionalArray?.length >
                                        0
                                          ? "upload-media-cards-one-btn add-product-cst"
                                          : "text-center position-relative drag-drop-box without-drop-flex-btn"
                                      }`}
                                    >
                                      <div className="without-drop-flex-btn-one">
                                        {imageProductionAdditionalArray?.length !==
                                        0 ? (
                                          <button
                                            onClick={(e) =>
                                              re_upload_request(e, "download")
                                            }
                                            type="submit"
                                            className={`signUp-btn btn-common mt-3 mb-3`}
                                          >
                                            Download
                                          </button>
                                        ) : (
                                          <></>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  {uppyAnchorProductionBriefFlag && (
                                    <div className="spinner-wrapper text-center">
                                      {" "}
                                      <span
                                        className="spinner-border text-dark-custom"
                                        role="status"
                                      >
                                        <span className="sr-only">
                                          Loading...
                                        </span>
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          {/*PRODUCTION MEDIA*/}
                          <div
                            className={`tab-pane fade ${
                              tabViews[3]?.isActive
                                ? "active green-active show"
                                : ""
                            }`}
                            id="media-tab-pane"
                            role="tabpanel"
                          >
                            {/*TITLE*/}
                            <h3 className="tab-title">
                              {t("PRODUCTION_MEDIA")}
                            </h3>
                            {/*CONTENT*/}
                            <div className="card-block">
                              <div className="job-detail-left position-relative">
                                {job_detail?.in_process === 0 ? (
                                  <div className="accept-job-text">
                                    <h2>{t("PLEASE_ACCEPT_JOB_TEXT")}</h2>
                                  </div>
                                ) : (
                                  ""
                                )}

                                <h3 className="fs-3 upload-media-title">
                                  {imageArray?.length > 0 &&
                                    `${t(
                                      "PHOTO_FROM_PRODUCTION"
                                    )} (${totalImages})`}
                                </h3>

                                <>
                                  <div
                                    className={`without-drop-flex ${
                                      totalImages > 12 &&
                                      "img-scroll"
                                    } ${
                                      imageArray?.length > 0 &&
                                      "upload-media-cards"
                                    }`}
                                    onScroll={onHandleInfiniteScroll}
                                    ref={onScrollRef}
                                  >
                                    <div
                                      className={`${
                                        imageArray?.length > 0
                                          ? "upload-media-cards-one portfolioContainer gallery-one"
                                          : ""
                                      } `}
                                    >
                                      {imageArray?.length > 0 &&
                                        imageArray?.map((image, index) => {
                                          if (
                                            fileExtensionVideo?.includes(
                                              image?.split(".")?.slice(-1)[0]
                                            )
                                          ) {
                                            return (
                                              <div
                                                key={index}
                                                className={`media-one media-video `}
                                              >
                                                <Player className="">
                                                  <source
                                                    src={`${process.env.REACT_APP_AWS_DSP_AWS_URL}job_${job_detail_id}/${image}`}
                                                  />
                                                  <ControlBar
                                                    autoHide={false}
                                                  />
                                                </Player>
                                              </div>
                                            );
                                          } else {
                                            return (
                                              <div
                                                key={index}
                                                onClick={() =>
                                                  onHandleOpenSliderModal()
                                                }
                                                className={`media-one media-image `}
                                              >
                                                <div>
                                                  <img
                                                    src={`${process.env.REACT_APP_AWS_DSP_AWS_URL}job_${job_detail_id}/thumbnail/${image}`}
                                                  />
                                                </div>
                                              </div>
                                            );
                                          }
                                        })}
                                    </div>
                                  </div>

                                  <div
                                    className={`${
                                      imageArray?.length > 0
                                        ? "upload-media-cards-one-btn"
                                        : "text-center position-relative drag-drop-box without-drop-flex-btn"
                                    }`}
                                  >
                                    <div className="without-drop-flex-btn-one">
                                      {!uppyAnchorProductionMediaFlagTemporary && jobDetail?.in_process != 4 ? (
                                        jobDetail?.photographer_accept == "1" &&
                                        imageArrayTemporary?.length == 0 ? (
                                          AvatarPicker()
                                        ) : jobDetail?.in_process == 3 ? (
                                          <button
                                            // disabled={onClickButtonToggleReload}
                                            onClick={(e) =>
                                              re_upload_request(e)
                                            }
                                            type="submit"
                                            className={`signUp-btn btn-common mt-3 mb-3`}
                                          >
                                            Re-upload Request
                                          </button>
                                        ) : (
                                          ""
                                        )
                                      ) : (
                                        ""
                                      )}
                                    </div>
                                  </div>
                                </>
                                {uppyAnchorProductionMediaFlag && (
                                  <div
                                    className={`${
                                      imageArray?.length > 0
                                        ? "spinner-wrapper-images"
                                        : "spinner-wrapper"
                                    }  text-center`}
                                  >
                                    {" "}
                                    <span
                                      className="spinner-border text-dark-custom"
                                      role="status"
                                    >
                                      <span className="sr-only">
                                        Loading...
                                      </span>
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {/*BILLING DETAILS*/}
                          <div
                            className={`tab-pane fade ${
                              tabViews[4]?.isActive
                                ? "active green-active show"
                                : ""
                            }`}
                            id="billing-info-pane"
                            role="tabpanel"
                          >
                            {/*TITLE*/}
                            <h3 className="tab-title">
                              {t("BILLING_DETAILS")}
                            </h3>
                            {/*CONTENT*/}
                            <div className="card-block">
                              <div
                                className={`d-flex card-middle-row justify-content-center ${
                                  jobDetail?.is_raise_invoice_photogpraher === 0
                                    ? "mt-5"
                                    : ""
                                }`}
                              >
                                {jobDetail?.is_raise_invoice_photogpraher ===
                                0 ? (
                                  <h6>{t("RAISE_INVOICE_PHRASE")}</h6>
                                ) : jobDetail?.is_raise_invoice_photogpraher ===
                                  1 ? (
                                  <h6>{t("INVOICE_SEND")}</h6>
                                ) : (
                                  ""
                                )}
                              </div>

                              <div className="text-center position-relative drag-drop-box without-drop-flex-btn">
                                {jobDetail?.is_raise_invoice_photogpraher ===
                                0 ? (
                                  <button
                                    disabled={invoiceButtonDisableFlag}
                                    onClick={(e) => raiseInvoice(e)}
                                    type="submit"
                                    className={`signUp-btn btn-common mt-3 mb-3 ${
                                      invoiceButtonDisableFlag
                                        ? "disable-btn-one"
                                        : ""
                                    }`}
                                  >
                                    {t("RAISE_INVOICE_BUTTON")}
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* end start */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <Footer />
          </div>
        </div>
      </section>
      {isOpenSliderModal && (
        <SliderModal
          sliderData={
            scrollTab == 1 ? imageArray : imageProductionAdditionalArray
          }
          isOpenModal={isOpenSliderModal}
          onHandleClose={onHandleClose}
          imageUrl={
            scrollTab == 1
              ? `${process.env.REACT_APP_AWS_DSP_AWS_URL}job_${job_detail_id}/`
              : `${process.env.REACT_APP_AWS_DSP_AWS_URL}job_${job_detail_id}/photographer_extra/`
          }
        />
      )}
    </>
  );
};

export default React.memo(JobDetail);
