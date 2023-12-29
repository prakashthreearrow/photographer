import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from "react-redux";
import { getLocalStorageItem } from "../../utils/helper";
import {
  languageSelector
} from "../../redux/action";

const LangSelector = () => {
  const { i18n } = useTranslation();


  let userData = JSON.parse(getLocalStorageItem("userData"));
  let user_id = JSON.parse(getLocalStorageItem("userId"));

  const dispatch = useDispatch();

  const [languageToggle, setLanguageToggle] = useState(true);

  const user_data = useSelector((state) => state?.Login?.userData);

  const [langSelected, setLangSelected] = useState(userData?.lang);

  useEffect(() => {
    if (langSelected === "en") {
      setLanguageToggle(true);
    } else {
      setLanguageToggle(false);
    }
    changeLanguage({ label: 'onReload', value: langSelected });

  }, []);

  const changeLanguage = (event, lang) => {
    if (event.label === 'onReload') {
      i18n.changeLanguage(event.value);
      let lang_payload = {
        user_id: userData?.id || user_id || user_data?.id,
        lang: event.value
      }
   
      dispatch(languageSelector({
        lang_payload, callback: (data) => {
          setLangSelected("languageSelector 1",data)
          localStorage.setItem(
            "userData",
            JSON.stringify(data)
          );
          if (data?.lang === "en") {
            setLanguageToggle(true);
          } else {
            setLanguageToggle(false);
          }
        }
      }));
    } else {
      event.preventDefault();
      i18n.changeLanguage(lang);
      let lang_payload = {
        user_id: userData?.id || user_id || user_data?.id,
        lang: lang
      }
     
      dispatch(languageSelector({
        lang_payload, callback: (data) => {
          setLangSelected("languageSelector 2",data)
          setLangSelected("")
          localStorage.setItem(
            "userData",
            JSON.stringify(data)
          );
          if (data?.lang === "en") {
            setLanguageToggle(true);
          } else {
            setLanguageToggle(false);
          }
        }
      }));
    }
  }

  return (
    <div className=" col-sm-5  col-xl-5 col-xxl-5 text-start pe-3 pr-custom">
      <ul className="d-flex m-0 p-0 language-change">
        <li><a href="" onClick={(e) => { changeLanguage(e, "en") }} className={`${languageToggle ? "active" : ""}`}>ENG</a></li>
        <li>/</li>
        <li><a href="" onClick={(e) => { changeLanguage(e, "es") }} className={`${languageToggle ? "" : "active"}`}>ESP</a></li>
      </ul>
    </div>
  )
}

export default LangSelector;