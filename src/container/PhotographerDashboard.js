import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import $ from "jquery";
import { Player, ControlBar } from "video-react";
import swal from "sweetalert";
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "@uppy/progress-bar/dist/style.css";
import { Dashboard, useUppy } from "@uppy/react";

import { Footer, Button } from "../component/CommonComponent";
import { getLocalStorageItem, url } from "../utils/helper";
import { PageSize } from "../utils/constants";
import {
  userProfile,
  imagesType,
  isImageUploaded,
  deleteRawImage,
  downloadInitialMedia,
} from "../redux/action";
import SliderModal from "./../container/JobModule/SliderModal";
import Pagination from "../component/CommonComponent/Pagination/Pagination";
import hand_emoji from "../assets/images/hand-emoji.png";
import download_icon from "../assets/images/download_icon.png";
import Header from "../component/layout/Header";

window.Buffer = window.Buffer || require("buffer").Buffer;

const PhotographerDashboard = () => {
  const { t } = useTranslation();

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

  const [imageLinkOpen, setImageLinkOpen] = useState(false);
  const [imageLinkMessage, setImageLinkMessage] = useState("");
  const [userCategoryList, setUserCategoryList] = useState([]);
  const [uploadImageLoader, setUploadImageLoader] = useState(false);
  const [downloadLoader, setDownloadLoader] = useState(false);
  const [imageArray, setImageArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PageSize);
  const [totalCount, setTotalCount] = useState(0);
  const [userProfileDashBoardData, setUserProfileDashBoard] =
    useState(userData);
  const [onClickButtonToggle, setOnClickButtonToggle] = useState(false);
  const [customMobileNumber, setCustomMobileNumber] = useState("");
  const [isPublishOpen, setPublishOpen] = useState(false);
  const [fileFlag, setFileFlag] = useState(false);
  const [uppyAnchorFlag, setUppyAnchorFlag] = useState(false);
  const [uppyExtention, setUppyExtention] = useState([]);

  const [apiCallOnce, setApiCallOnce] = useState(true);
  const [imageLoader, setImageLoader] = useState(false);

  const [count, setCount] = useState(0);

  const [currPage, setCurrPage] = useState(1);
  const [prevPage, setPrevPage] = useState(0);
  const [isOpenSliderModal, setIsOpenSliderModal] = useState(false);
  const [lastList, setLastList] = useState(true);

  const history = useHistory();
  const dispatch = useDispatch();

  const user_data = useSelector((state) => state?.Login?.userData);

  const user_images = useSelector((state) => state?.ImagesType?.imagesArray);
  const userProfileData = useSelector(
    (state) => state?.UserProfile?.userProfile
  );

  let user_profile_id =
    user_id || userProfileDashBoardData?.id || userData?.id || user_data?.id;
  let show_reel = userProfileDashBoardData?.work_email?.split("/")[0];
  let show_reel_link = `${
    show_reel === "https:" || show_reel === "http:"
      ? userProfileDashBoardData?.work_email
      : `https://${userProfileDashBoardData?.work_email}`
  }`;

  const onScrollRef = useRef();

  var arrayObj = [];

  useEffect(() => {
    if (lastList && prevPage !== currPage) {
      onHandleFetchMoreImages();
    }
  }, [currPage, lastList, prevPage, imageArray]);

  useEffect(async () => {
    const mobilenumber = userProfileDashBoardData?.mobile;
    const mobilenumber_modified =
      userProfileDashBoardData?.mobile?.split("")[0];

    if (mobilenumber_modified === "+") {
      setCustomMobileNumber(mobilenumber);
    } else {
      let number = "+" + mobilenumber;
      setCustomMobileNumber(number);
    }

  }, [userProfileDashBoardData?.is_uploaded, count]);

  useEffect(async () => {
    dispatch(
      userProfile({
        user_profile_id,
        callback: async (data) => {
          if (data) {
            setUserProfileDashBoard(data);
          }
        },
      })
    );

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
  }, [userProfileDashBoardData?.is_uploaded]);

  useEffect(() => {
    let categoryList = [];
    userProfileData?.categories?.map((data) => {
      data?.category_name?.map((element) => {
        categoryList?.push(element?.name);
      });
    });
    setUserCategoryList(categoryList);
  }, [userProfileData]);

  useEffect(() => {
    if (uppyExtention?.length > 0) {
      uppyExtention?.map((extention) => {
        if (fileExtensionVideoValidation?.includes(extention)) {
          setFileFlag(true);
        }
      });
    }
  }, [uppyExtention]);

  const photographerInit = () => {
    setUppyAnchorFlag(false);
  };

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
                setOnClickButtonToggle(true);
                setUploadImageLoader(true);
                var inobj = obj[prop];
                inobj.id = obj["id"];
                arrayObj?.push(inobj);
              }
            } else {
              console.log(obj);
            }
          }
        }

        let modifiedArray = arrayObj?.map((ele) => {
          return {
            ...ele,
            relativePath: "",
            lastModified: ele?.lastModified,
            lastModifiedDate: ele?.lastModifiedDate,
            name: ele?.name,
            size: ele?.size,
            type: ele?.type,
            id: ele?.id,
            webkitRelativePath: ele?.webkitRelativePath,
          };
        });
        uppyApi(modifiedArray);
      },
      onBeforeFileAdded: (files) => {
        if (files) {
          setUppyExtention((prevCompanies) => {
            return [...prevCompanies, files?.extension?.toLowerCase()];
          });
        }
      },
      meta: {
        user_id: userData?.id,
      },
    });
  });

  const uppyApi = () => {
    uppy
      .use(Tus, {
        // endpoint: 'https://tusd.tusdemo.net/files/',
        // endpoint: `https://medas.acquaintsoft.com/api/photographer-upload`,
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
            console.error(file.error);
          });
        }
        return false;
      });
  };

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
    }
  });

  const AvatarPicker = () => {
    return (
      <div className={`${fileFlag ? "custom-cancel " : ""} bottom-btn`}>
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
            setPublishOpen(true);
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

  const defaultApiCall = () => {
    console.log("saaaaaaaaaaaaaa")
    let getImageListPayload = {
      user_profile_id: user_profile_id,
      page: currPage,
    };
    dispatch(
      imagesType({
        getImageListPayload,
        callback: async (data) => {
          if (data) {
            setImageLoader(false);

            setOnClickButtonToggle(false);
            setUploadImageLoader(false);
            setTotalCount(data?.length);
            setLastList(data.has_more);
            setPrevPage(currPage);
            const arrayMap = data?.data?.map((ele) => ele?.image_name);

            setImageArray([...imageArray, ...arrayMap]);
          }
        },
      })
    );
  };

  /* manage infinite scroll */
  const onHandleInfiniteScroll = () => {
    if (onScrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = onScrollRef.current;
      console.log({
        scrollTop: scrollTop,
        scrollHeight: scrollHeight,
        clientHeight: clientHeight,
      });
      if (scrollTop + clientHeight + 2 > scrollHeight && lastList) {
        setCurrPage(currPage + 1);
      }
    }
  };

  /* fetch more images */
  const onHandleFetchMoreImages = () => {
    setImageLoader(true);
    let getImageListPayload = {
      user_profile_id: user_profile_id,
      page: currPage,
    };
    dispatch(
      imagesType({
        getImageListPayload,
        callback: async (data) => {
          if (data) {
            setImageLoader(false);

            setOnClickButtonToggle(false);
            setUploadImageLoader(false);
            setTotalCount(data?.length);
            setLastList(data.has_more);
            setPrevPage(currPage);
            const arrayMap = data?.data?.map((ele) => ele?.image_name);

            setImageArray([...imageArray, ...arrayMap]);
          }
        },
      })
    );
  };

  /* open slider modal */
  const onHandleOpenSliderModal = () => {
    setIsOpenSliderModal(true);
  };

  const onHandleClose = () => {
    setIsOpenSliderModal(false);
  };

  console.log("count", count);
  const afterApiResponseOfUppy = () => {
    setPublishOpen(false);
    setFileFlag(false);
    setUppyExtention([]);
    uppy.cancelAll();
    let imageUploaded = {
      user_id: user_profile_id,
      is_uploaded: 1,
    };
    dispatch(
      isImageUploaded({
        imageUploaded,
        callback: async (data) => {
          if (data) {
            defaultApiCall();
            setUploadImageLoader(false);
            // window.location.reload();
            setUserProfileDashBoard(data);
            localStorage.setItem("userData", JSON.stringify(data));
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

  const successPage = () => {
    return (
      <>
        <div className="wrapperAlert">
          <div className="contentAlert">
            <div className="topHalf">
              <p>
                <svg viewBox="0 0 512 512" width="100" title="check-circle">
                  <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" />
                </svg>
              </p>
              <h1>Download successfull</h1>

              <ul className="bg-bubbles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </div>

            <div className="bottomHalf">
              <p>Thank you! Your file is now downloading.</p>

              <button onClick={() => history.push("/editor-dashboard")}>
                back to dashboard
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  const errorPage = () => {
    return (
      <>
        <div className="wrapperAlert">
          <div className="contentAlert">
            <div className="topHalf">
              <p>
                <svg
                  fill="#000000"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 50 50"
                  width="100"
                >
                  <path d="M25,2C12.319,2,2,12.319,2,25s10.319,23,23,23s23-10.319,23-23S37.681,2,25,2z M33.71,32.29c0.39,0.39,0.39,1.03,0,1.42    C33.51,33.9,33.26,34,33,34s-0.51-0.1-0.71-0.29L25,26.42l-7.29,7.29C17.51,33.9,17.26,34,17,34s-0.51-0.1-0.71-0.29    c-0.39-0.39-0.39-1.03,0-1.42L23.58,25l-7.29-7.29c-0.39-0.39-0.39-1.03,0-1.42c0.39-0.39,1.03-0.39,1.42,0L25,23.58l7.29-7.29  c0.39-0.39,1.03-0.39,1.42,0c0.39,0.39,0.39,1.03,0,1.42L26.42,25L33.71,32.29z"></path>
                </svg>
              </p>
              <h1>Download failed</h1>

              <ul className="bg-bubbles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </div>

            <div className="bottomHalf">
              <p>Sorry! This download is not found.</p>

              <button id="alertMO">back to dashboard</button>
            </div>
          </div>
        </div>
      </>
    );
  };
  console.log("imageArray", imageArray);
  const downloadImages = async (e) => {
    e.preventDefault();
    setDownloadLoader(true);
    setOnClickButtonToggle(true);
    // var count = 0;
    // var zipFilename = "zipWidu.zip";
    // var zip = new JSZip();

    // for (let i = 0; i < imageArray?.length; i++) {
    //   // let filename = `${"watermark_"}${imageArray[i]}`;
    //   let filename = `${imageArray[i]}`;

    //   var url = null;
    //   if (fileExtensionVideo?.includes(imageArray[i]?.split(".")[1])) {
    //     url = `${process.env.REACT_APP_AWS_DSP_AWS_URL}${user_profile_id}/RAW/${imageArray[i]}`;
    //   } else {
    //     url = `${process.env.REACT_APP_AWS_DSP_AWS_URL}${user_profile_id}/${filename}`;
    //   }

    //   let JSZipUtilsData = await JSZipUtils?.getBinaryContent(url);

    //   if (JSZipUtilsData) {
    //     zip.file(`${"watermark_"}${count}${imageArray[i]}`, JSZipUtilsData, {
    //       binary: true,
    //     });
    //     count++;

    //     if (count === imageArray?.length) {
    //       setOnClickButtonToggle(false);
    //       await zip.generateAsync({ type: "blob" }).then(function (content) {
    //         setDownloadLoader(false);

    //         saveAs(content, zipFilename);
    //       });
    //     }
    //   }
    // }

    let imageUploaded = user_profile_id;
    dispatch(
      downloadInitialMedia({
        imageUploaded,
        callback: async (data) => {
          if (data) {
            setImageLinkOpen(true);
            if (data?.key === 0) {
              setImageLinkMessage(data?.message);
              successPage();
            } else {
              setImageLinkMessage(data?.message);
              errorPage();
            }
            setOnClickButtonToggle(false);
            setDownloadLoader(false);
          }
        },
      })
    );
  };

  const renderDownLoadButton = () => {
    return (
      <>
        <div
          disabled={onClickButtonToggle}
          onClick={(e) => downloadImages(e)}
          className={`${
            onClickButtonToggle ? "disable-btn-one" : ""
          } download-btn download-btn-height`}
        >
          <a data-watermark="watermark.com">
            <img src={download_icon} />
            Download JPG
          </a>
          {downloadLoader ? (
            <div className="spinner-border text-dark" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            ""
          )}
        </div>
      </>
    );
  };

  const handlePerPage = (e) => {
    const perPageRecords = e.target.value;
    setPageSize(perPageRecords);
    // setCurrentPage(1);
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    let currentData = user_images?.slice(firstPageIndex, lastPageIndex);
    let arrayMap = currentData?.map((ele) => ele?.image_name?.split(".")[0]);
    let removeDuplicateImageName = [...new Set(arrayMap)];
    let uniqueImageName = removeDuplicateImageName?.map(
      (unique) => unique + "." + "jpg"
    );
    setImageArray(uniqueImageName);
  };

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
    const firstPageIndex = (pageNumber - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    let currentData = user_images?.slice(firstPageIndex, lastPageIndex);
    let arrayMap = currentData?.map((ele) => ele?.image_name?.split(".")[0]);
    let removeDuplicateImageName = [...new Set(arrayMap)];
    let uniqueImageName = removeDuplicateImageName?.map(
      (unique) => unique + "." + "jpg"
    );
    setImageArray(uniqueImageName);
  };

  const scrollUp = (e) => {
    window.scrollTo(0, 0);
  };

  $(document).ready(function () {
    var ctx = document.createElement("canvas").getContext("2d");
    var img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
      ctx.fillText("COPYRIGHT", 10, 30);
    };

    // uppy event trigger
    $(".uppy-DashboardContent-addMore").on("click", function (event) {
      event.stopPropagation();
      event.stopImmediatePropagation();
      setFileFlag(false);
    });

    $(".uppy-DashboardContent-back").on("click", function (event) {
      event.stopPropagation();
      event.stopImmediatePropagation();
      setFileFlag(true);
    });

    $("a.uppy-Dashboard-poweredBy").prop("href", "https://medas-digital.com");
  });

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

      {isPublishOpen && (
        <div
          className={`modal fade ${
            isPublishOpen ? "show d-block bg-blur" : "d-none"
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
                  onClick={(e) => afterApiResponseOfUppy()}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <section className="dashboard-main-one position-relative file-set">
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
          isPhotographer={true}
          langSelector={true}
        />
        <div className="content dashboard-background">
          <div className="cards-section dashboard-sec intro-card intro-card-one">
            <div className="row m-0">
              <div className="col-md-12 col-lg-3 p-0 intro-card-left">
                <div className="row m-0">
                  <div className="col-md-12 p-0 ">
                    <div className="justify-content-center w-100 h-100">
                      <div className="card border-0 bg-lightwhite p-4 mb-0 font-Circular border-14px w-100 text-center position-relative h-100">
                        <div className="mb-2">
                          <img src={hand_emoji} alt="profile" />
                        </div>
                        <h4>
                          {t("HI")} {`${userProfileDashBoardData?.first_name}`},{" "}
                          {t("DASHBOARD_GREETING")}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col-md-12 p-0">
                    <div className="justify-content-center w-100 h-100">
                      <div className="card border-0 bg-lightwhite p-4 mb-0 font-Circular border-14px w-100 text-center position-relative h-100">
                        <div className="dropdonw position-relative drop-bulltets text-end">
                          {/* <a
                            className=""
                            role="button"
                            id="dropdownMenuLink"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <svg
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
                          </a> */}
                          <ul
                            className="dropdown-menu m-0 p-0"
                            aria-labelledby="dropdownMenuL    ink"
                          >
                            <li>
                              <a className="dropdown-item">Profile</a>
                            </li>
                          </ul>
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
                        <h5 className="font-Circular font-24 m-0">{`${
                          userProfileDashBoardData?.first_name
                        }${" "}${userProfileDashBoardData?.last_name}`}</h5>
                        <span className="font-Circular font-16 text-gray mb-2">
                          {userData?.position ? userData?.position : "-"}
                        </span>
                        <ul className="d-flex p-0 mx-0 mb-30 flex-wrap justify-content-center lists-tags">
                          {userCategoryList?.length > 0 &&
                            userCategoryList?.map((categoryTypes, index) => {
                              return (
                                <li
                                  key={index}
                                  className="list-style-none mt-5px mx-5px"
                                >
                                  <span className="pro_development mb-2 font-Circular-bold w-auto letter-spacing-65 text-uppercase text-black font-11 mb-2">
                                    {categoryTypes}
                                  </span>
                                </li>
                              );
                            })}
                        </ul>
                        <span className="horizon-line-2"></span>
                        <div className="contact-info">
                          <div className="contact-info-one contact">
                            <h6>{t("CONTACT_NUMBER")}</h6>
                            {customMobileNumber ? (
                              <a
                                href={`tel:${customMobileNumber}`}
                              >{`${customMobileNumber}`}</a>
                            ) : (
                              "-"
                            )}
                          </div>
                          <div className="contact-info-one email">
                            <h6>{t("EMAIL")}</h6>
                            {userProfileDashBoardData?.email ? (
                              <a
                                href={`mailto:${userProfileDashBoardData?.email}`}
                              >{`${userProfileDashBoardData?.email}`}</a>
                            ) : (
                              ""
                            )}
                          </div>
                          <div className="contact-info-one link">
                            <h6>{t("SHOWREEL_LINK")}</h6>
                            {userProfileDashBoardData?.work_email ? (
                              <a
                                target="_blank"
                                className="active"
                                href={show_reel_link}
                              >{`${userProfileDashBoardData?.work_email}`}</a>
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12 col-lg-9 intro-card-right">
                <div className="row m-0">
                  <div className="col-md-12 col-lg-7 col-xxl-7 pb-6 upcoming-shoots">
                    <div className="justify-content-center w-100 h-100">
                      <div className="card border-0 bg-lightwhite p-4 mb-0 font-Circular border-14px w-100 text-center position-relative h-100">
                        <h3 className="mb-3">{t("WHAT_NEXT")}</h3>
                        {userProfileDashBoardData?.is_uploaded === 1 ||
                        user_data?.is_uploaded === 1 ? (
                          <p>{t("THANK_YOU_FOR_SUBMITTING_YOUR_TEST_RUN")}</p>
                        ) : userProfileDashBoardData?.is_approved === 1 ||
                          user_data?.is_approved === 1 ? (
                          <p>{t("WHAT_NEXT_DESCRIPTION_APPROVED")}</p>
                        ) : userProfileDashBoardData?.is_approved === 0 ||
                          user_data?.is_approved === 0 ? (
                          <p>{t("WHAT_NEXT_DESCRIPTION_NOT_APPROVED")}</p>
                        ) : (
                          ""
                        )}
                        <div
                          className={`drag-drop-box text-center signup-btn-container position-relative ${
                            userProfileDashBoardData?.is_uploaded === 1
                              ? "spinner-one"
                              : "drag-one"
                          }`}
                        >
                          {(userProfileDashBoardData?.is_approved === 1 ||
                            user_data?.is_approved === 1) &&
                          (userProfileDashBoardData?.is_uploaded === 0 ||
                            user_data?.is_uploaded === 0)
                            ? AvatarPicker()
                            : ""}

                          {uploadImageLoader ? (
                            <div
                              className="spinner-border text-dark"
                              role="status"
                            >
                              <span className="sr-only">Loading...</span>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 col-lg-5 col-xxl-5 calender">
                    <div className="text-center">
                      <h3 className="fs-3">{t("HAVE_QUESTION")}</h3>
                      <div className="contact-info text-center contact-faq">
                        <div className="contact-info-one contact">
                          <h6>{t("VIEW_OUR")}</h6>
                          <a
                            className="active"
                            href="https://widu.co/preguntas-frecuentes/"
                            target="_blank"
                          >
                            FAQs
                          </a>
                        </div>
                        <div className="contact-info-one email">
                          <h6>{t("EMAIL")}</h6>
                          <a
                            className="active"
                            href="mailto:fotografos@widu.co"
                          >
                            fotografos@widu.co
                          </a>
                        </div>
                        <div className="contact-info-one link">
                          <h6>{t("CONTACT_NUMBER")}</h6>
                          <a className="active" href="tel:+34683165370">
                            +34 683 16 53 70 (Global)
                          </a>
                          <a className="active" href="tel:+56921995961">
                            +56 9 2199 5961 (Chile)
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 col-lg-12 col-xxl-12 upload-media">
                    {imageArray?.length > 0 ? (
                      <div className="upload-media-inner upload-media-inner-height">
                        <h3 className="fs-3 upload-media-title">
                          {t("UPLOAD_MEDIA")}
                        </h3>
                        <div
                          onScroll={onHandleInfiniteScroll}
                          ref={onScrollRef}
                          className={`upload-media-cards cst_height_cards upload-media-cards-height`}
                        >
                          <div
                            className={`gallery-one upload-media-cards-one  portfolioContainer ${
                              imageArray?.length === 0 ? "if_spinner" : ""
                            }`}
                          >
                            {imageArray?.map((image, index) => {
                              if (
                                fileExtensionVideo?.includes(
                                  image?.split(".")?.slice(-1)[0]
                                )
                              ) {
                                return (
                                  <div
                                    key={index}
                                    className={`${
                                      uppyAnchorFlag ? "d-none" : ""
                                    } media-one media-video`}
                                  >
                                    <Player>
                                      <source
                                        src={`${process.env.REACT_APP_AWS_DSP_AWS_URL}${user_profile_id}/RAW/${image}`}
                                      />
                                      <ControlBar autoHide={false} />
                                    </Player>
                                  </div>
                                );
                              } else {
                                return (
                                  <div
                                    onClick={(e) => {
                                      scrollUp(e);
                                      onHandleOpenSliderModal();
                                    }}
                                    key={index}
                                    className={` media-one media-video`}
                                  >
                                    <div className="photography">
                                    
                                        <img
                                          id="images"
                                          src={`${process.env.REACT_APP_AWS_DSP_AWS_URL}${user_profile_id}/thumbnail/${image}`}
                                        />
                                  
                                    </div>
                                  </div>
                                );
                              }
                            })}

                            {imageLoader && (
                              <div className="spinner-wrapper text-center justify-content-center h-100 d-flex w-100 align-items-center">
                                <div
                                  className="spinner-border text-dark"
                                  role="status"
                                >
                                  <span className="sr-only">Loading...</span>
                                </div>{" "}
                              </div>
                            )}
                          </div>
                        </div>
                        {renderDownLoadButton()}
                      </div>
                    ) : (
                      ""
                    )}
                    {totalCount ? (
                      <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={totalCount}
                        pageSize={pageSize}
                        onPageChange={(page) => handlePagination(page)}
                        handlePerPage={handlePerPage}
                      />
                    ) : (
                      <span />
                    )}
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
          sliderData={imageArray
          }
          isOpenModal={isOpenSliderModal}
          onHandleClose={onHandleClose}
          imageUrl={`${process.env.REACT_APP_AWS_DSP_AWS_URL}${user_profile_id}/`
          }
        />
      )}
    </>
  );
};

export default PhotographerDashboard;
