import React, { useEffect, useState, useRef } from "react";
import "../../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../../../node_modules/bootstrap/dist/js/bootstrap.min.js";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Footer,
  Loader
} from "../../component/CommonComponent";
import Header from "../../component/layout/Header";
import {
  getLocalStorageItem,
  removeLocalStorageItem
} from "../../utils/helper";

import {
  getVideoEditing,
} from "../../redux/action";

window.Buffer = window.Buffer || require("buffer").Buffer;

const DownloadLink = () => {
  const mountedRef = useRef(true);
  const { t } = useTranslation();
  const { id } = useParams();

  let userData = JSON.parse(getLocalStorageItem("userData"));
  let user_id = JSON.parse(getLocalStorageItem("userId"));



  const [userProfileDashBoardData, setUserProfileDashBoard] =
    useState(userData);

  const [imageLinkOpen, setImageLinkOpen] = useState(false);
  const [imageLinkMessage, setImageLinkMessage] = useState("");
  const [uploadImageLoader, setUploadImageLoader] = useState(false);

  const history = useHistory();
  const dispatch = useDispatch();

  const user_data = useSelector((state) => state?.Login?.userData);
  const download_link = useSelector((state) => state?.GetVideoEditing?.videoEditing);

  let user_profile_id =
    user_id || userProfileDashBoardData?.id || userData?.id || user_data?.id;
  
  useEffect(() => {
    localStorage.setItem(
      "downloadLink",
      JSON.stringify(id)
    );
    if (getLocalStorageItem("token") && getLocalStorageItem("userData")) {
      history.push(`/download-link/${id}`);
    } else {
      history.push("/");
    }
  }, []);

  useEffect(async () => {
    if (user_profile_id && id) {
      let getImageListPayload = {
        user_id: user_profile_id,
        id: parseInt(id),
      };
      dispatch(
        getVideoEditing({
          getImageListPayload,
          callback: async (data) => {
            if (data) {
              if (data?.key === 0) {
                await downloadDataUrlFromJavascript(data?.link);
              }
            }
          },
        })
      );
    }
  }, [id]);


  async function downloadDataUrlFromJavascript(dataUrl) {
    // Construct the 'a' element
    var link = document.createElement("a");
    // link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    // Cleanup the DOM
    document.body.removeChild(link);
  }
  const redirect = (e) => {
    e.preventDefault();
    removeLocalStorageItem("downloadLink");
    if( userData.roles[0]?.id === 5){
      if (userData?.is_profile_completed === 1) {
        history.push("/dashboard");
      }else{
        history.push("/sign-up");
      }
    }else if(userData?.roles[0]?.id  === 6){
      if (userData?.is_profile_completed === 1) {
        history.push("/editor-dashboard");
      } else {
        history.push("/sign-up-editor");
      }
    }else if(userData?.roles[0]?.id === 7){
      if (userData?.parent_id !== null) {
        history.push("/sign-up-client3");
      } else {
        if (userData?.is_profile_completed === 1) {
          history.push("/client-dashboard");
        } else {
          history.push("/sign-up-client");
        }
      }
    }
   
  }

  const successPage = () => {
    return (
      <>
        <div className="wrapperAlert">

          <div className="contentAlert">

            <div className="topHalf">

              <p><svg viewBox="0 0 512 512" width="100" title="check-circle">
                <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" />
              </svg></p>
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

              <button onClick={(e) => redirect(e)}>back to dashboard</button>

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
                <svg fill="#000000" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="100"><path d="M25,2C12.319,2,2,12.319,2,25s10.319,23,23,23s23-10.319,23-23S37.681,2,25,2z M33.71,32.29c0.39,0.39,0.39,1.03,0,1.42    C33.51,33.9,33.26,34,33,34s-0.51-0.1-0.71-0.29L25,26.42l-7.29,7.29C17.51,33.9,17.26,34,17,34s-0.51-0.1-0.71-0.29    c-0.39-0.39-0.39-1.03,0-1.42L23.58,25l-7.29-7.29c-0.39-0.39-0.39-1.03,0-1.42c0.39-0.39,1.03-0.39,1.42,0L25,23.58l7.29-7.29  c0.39-0.39,1.03-0.39,1.42,0c0.39,0.39,0.39,1.03,0,1.42L26.42,25L33.71,32.29z"></path></svg>
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

              <button onClick={(e) => { redirect(e)}} id="alertMO">back to dashboard</button>

            </div>

          </div>

        </div>
      </>
    );
  };

  return (
    <>

      <section className="dashboard-main-one position-relative file-set job-detail dashboard-job">
        <Header
          logoutFlag={uploadImageLoader}
          isJob={true}
          langSelector={true}
          calendar={true}
        />
        <div className="content dashboard-background">
          {(download_link === null ? <Loader /> : (download_link?.key === 0) ? successPage() : errorPage())}
          <div className="mt-5">
            <Footer />
          </div>
        </div>
      </section>
    </>
  );
};

export default DownloadLink;
