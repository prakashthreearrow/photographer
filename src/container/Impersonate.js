import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Loader
} from "../component/CommonComponent";
import { getLocalStorageItem, removeLocalStorageItem } from "../utils/helper";
import {
  impersonateLoginUser,
  impersonateClientLoginUser,
  logoutUser
} from "../redux/action";
window.Buffer = window.Buffer || require("buffer").Buffer;

const Impersonate = () => {

  // data fetch from the address url.
  const params = new URLSearchParams(window?.location?.search);
  let encrypted = params?.get("login");
  let user_data = Buffer.from(encrypted, 'base64').toString('ascii')

  // user data for login.
  let split_user_data = user_data?.split("&");

  var user_email = split_user_data[0]?.split("=")[1];
  var user_password = split_user_data[1]?.split("=")[1];
  var user_roles = split_user_data[2]?.split("=")[1];
  var user_id = split_user_data[3]?.split("=")[1];

  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (getLocalStorageItem("token") && getLocalStorageItem("userData")) {
      let userData = JSON.parse(getLocalStorageItem("userData"));
      if(userData?.email === user_email){
        if(user_roles == 5){
          history.push("/dashboard");
        }else if(user_roles == 6){
          history.push("/editor-dashboard");
        }else if(user_roles == 7){
          history.push("/client-dashboard");
        }
      }else{
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
              init();
            },
          })
        );
      }
    }else{
      init();
    }
  }, []);

  //login
  const init = () => {
    let profileForm = {
      email: user_email,
      password: user_password,
      id: user_id,
    };
    //client login.
    if (user_roles == 7) {
      profileForm.role = user_roles;
      dispatch(
        impersonateClientLoginUser({
          profileForm,
          callback: (data) => {
            if (data) {
              if (data?.code === 200) {
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
                } else if (data?.user?.roles[0]?.id === 6) {
                  if (data?.user?.is_profile_completed === 1) {
                    history.push("/editor-dashboard");
                  } else {
                    history.push("/sign-up-editor");
                  }
                }
              } else if (data?.code === 400) {
                history.push("/");
              }
            }
          },
        })
      );
    } else {
      // photographer and editor login.
      profileForm.role = user_roles;
      dispatch(
        impersonateLoginUser({
          profileForm,
          callback: (data) => {
            if (data) {
              if (data?.code === 200) {
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
              } else if (data?.code === 400) {
                history.push("/");
              }
            }
          },
        })
      );
    }
  }

  return (
    <>
      <Loader />
    </>
  );
};

export default Impersonate;
