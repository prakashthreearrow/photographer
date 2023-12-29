import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SelectDropDown, Footer, Input } from "../../component/CommonComponent";
import validateBillingInstruction from "../../validation/ClientModule/placeAnOrderBilling";
import AutocompleteMap from "./AutoComplete";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
} from "../../utils/helper";
import {
  getShootType,
  getSubCategory,
  getSubCategoryItem,
  categoryType,
  getVisualEditing
} from "../../redux/action";
import Header from "../../component/layout/Header";
import Map from "../JobModule/Map";
import searchMap from "../../assets/images/search-map.png";

export default function PlaceAnOrder() {
  const { t } = useTranslation();

  var someDate = new Date();
  var numberOfDaysToAdd = 5; // add a day
  var result = someDate.setDate(someDate.getDate() + numberOfDaysToAdd);

  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [startDate, setStartDate] = useState(new Date(result));

  const [shootTypeStackArray, setShootTypeStackArray] = useState([]);
  const [shootTypeStackArrayChanges, setShootTypeStackArrayChanges] = useState([]);
  const [editingTypeStackArray, setEditingTypeStackArray] = useState([]);
  const [shootTypeStackArrayCount, setShootTypeStackArrayCount] = useState(0);
  const [shootTypeStackArrayCountFlag, setShootTypeStackArrayCountFlag] = useState(false);

  const [cartCount, setCartCount] = useState(0);

  const [shootCount, setShootCount] = useState(0);
  const [shootLocationFeaturesCount, setShootLocationFeaturesCount] = useState(0);
  const [visualEditingCount, setVisualEditingCount] = useState(0);
  const [shootLocationFeaturesShootID, setShootLocationFeaturesShootID] = useState(null);
  const [shootLocationFeaturesSubCategoryName, setShootLocationFeaturesSubCategoryName] = useState(null);
  const [shootLocationFeaturesShootName, setShootLocationFeaturesShootName] = useState(null);
  const [shootLocationArrayIDs, setShootLocationArrayIDs] = useState([]);

  const [form, setForm] = useState({
    name_of_project: "",

    city: "",
    state: "",
    zip_code: "",
    country: "",
    address: "",

    date: "",
    time: "",

    shoot_type: "",
    sub_category: "",

    ref_address: "",
    ref_contact: "",
    billing_address: "",
    additional_instruction: "",
    payment_type: "",
  });

  const [stepViews, setStepViews] = useState([
    { step: "step1", isActive: false },
    { step: "step2", isActive: false },
    { step: "step3", isActive: false },
    { step: "step4", isActive: false },
    { step: "step5", isActive: false },
    { step: "step6", isActive: false },
    { step: "step7", isActive: false },
    { step: "step0", isActive: false },
  ]);

  const [activeStep1, setActiveStep1] = useState(false);
  const [activeStep2, setActiveStep2] = useState(false);
  const [activeStep3, setActiveStep3] = useState(false);
  const [activeStep4, setActiveStep4] = useState(false);
  const [activeStep5, setActiveStep5] = useState(false);
  const [activeStep6, setActiveStep6] = useState(false);
  const [activeStep7, setActiveStep7] = useState(false);
  const [activeStep0, setActiveStep0] = useState(false);

  const [shootTypeIds, setShootTypeIds] = useState([]);
  const [error, setError] = useState({});

  const dispatch = useDispatch();
  const history = useHistory();

  let userData = JSON.parse(getLocalStorageItem("userData"));
  let placeAnOrderArrayCount = JSON.parse(getLocalStorageItem("placeAnOrder"));
  let placeAnOrderArray = JSON.parse(getLocalStorageItem("editOrder"));

  const shoot_types = useSelector((state) => state?.GetShootType?.shootType);

  const category_types = useSelector(
    (state) => state?.CategoryType?.categoryArray
  );

  const sub_category = useSelector(
    (state) => state?.GetSubCategory?.subCategory
  );

  const visual_editing = useSelector(
    (state) => state?.GetEditingVisual?.editingType
  );

  const sub_category_item_loader = useSelector(
    (state) => state?.GetSubCategoryItem?.loading
  );

  useEffect(() => {
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

    if (placeAnOrderArrayCount) {
      setCartCount(placeAnOrderArrayCount?.length)
    }

    dispatch(categoryType());
    dispatch(getShootType());
    dispatch(getVisualEditing());
  }, []);

  useEffect(() => {
    //editing flags
    shoot_types?.type?.length > 0 &&
      shoot_types?.type?.map((shootType, index) => {
        visual_editing?.length > 0 &&
          visual_editing?.map((editingType, index) => {
            setForm((prevState) => ({
              ...prevState,
              ["editing" +
                capitalizeFirstLetter(shootType?.type_slug) +
                capitalizeFirstLetter(editingType?.type_slug)]:
                false
            }));
          })
      })
  }, [shoot_types]);

  useEffect(() => {
    setForm((prevState) => ({
      ...prevState,
      city: city || placeAnOrderArray?.city || "",
      state: state || placeAnOrderArray?.state || "",
      zip_code: zipCode || placeAnOrderArray?.zip_code || "",
      country: country || placeAnOrderArray?.country || "",
      address: address?.label || placeAnOrderArray?.address || "",
    }));
  }, [city, state, zipCode, country]);

  //editing
  useEffect(() => {
    if (placeAnOrderArray) {
      setForm((prevState) => ({
        ...prevState,
        name_of_project: placeAnOrderArray?.name_of_project || "",

        time: new Date(placeAnOrderArray?.time_of_shoot) || "",
        date: new Date(placeAnOrderArray?.date_of_shoot) || "",

        sub_category:
          placeAnOrderArray?.category_id !== null
            ? placeAnOrderArray?.category_id?.toString()
            : "",

        billing_address: placeAnOrderArray?.billing_address || "",
        ref_address: placeAnOrderArray?.ref_address || "",
        ref_contact: placeAnOrderArray?.ref_contact || "",
        additional_instruction: placeAnOrderArray?.additional_instruction || "",

        payment_type:
          placeAnOrderArray?.payment_type !== null
            ? placeAnOrderArray?.payment_type?.toString()
            : "",
      }));

      if (placeAnOrderArray?.editing?.length === placeAnOrderArray?.order_by?.length) {
        setActiveStep5(true);
      } else {
        setActiveStep5(false);
      }
    }
  }, []);

  //active step
  useEffect(() => {
    form?.city &&
      form?.state &&
      form?.zip_code &&
      form?.address &&
      form?.country
      ? setActiveStep1(true)
      : setActiveStep1(false);

    form?.date && form?.time ? setActiveStep2(true) : setActiveStep2(false);

    form?.sub_category ? setActiveStep4(true) : setActiveStep4(false);

    form?.name_of_project ? setActiveStep0(true) : setActiveStep0(false);

    form?.additional_instruction &&
      form?.billing_address &&
      form?.payment_type &&
      form?.ref_address &&
      form?.ref_contact
      ? setActiveStep7(true)
      : setActiveStep7(false);
  }, [
    form?.date,
    form?.time,
    form?.sub_category,
    form?.city,
    form?.state,
    form?.zip_code,
    form?.country,
    form?.address,
    form?.additional_instruction,
    form?.billing_address,
    form?.payment_type,
    form?.ref_address,
    form?.ref_contact,
    form?.name_of_project,
  ]);

  //sub category
  useEffect(() => {
    if (form?.sub_category) {
      let sub_category_id = parseInt(form?.sub_category);
      dispatch(getSubCategory({ sub_category_id }));
    }
  }, [form?.sub_category]);

  //editing shoot type
  useEffect(() => {
    shoot_types?.type?.map((shootType, index) => {
      setForm((prevState) => ({
        ...prevState,
        [shootType?.type_slug + "_editing"]: "",
      }));
    });

    placeAnOrderArray?.order_by?.map((shoot_type) => {
      let shootType = shoot_types?.type?.find((ele) => ele?.id === shoot_type?.shoot_type_id);
      if (shootType !== undefined) {
        setShootTypeStackArray(oldArray => [...oldArray, shootType?.type_slug]);
        setEditingTypeStackArray(oldArray => [...oldArray, shootType?.type_slug]);
        setActiveStep3(true);
        setForm((prevState) => ({
          ...prevState,
          [shootType?.type_slug]: shootType?.id?.toString(),
        }));
      }
    })

    let shoot_ids = [];
    shoot_types?.type?.map((shoot) => {
      shoot_ids?.push(shoot?.id?.toString());
    });
    setShootTypeIds(shoot_ids);
  }, [shoot_types]);

  //editing visual editing
  useEffect(() => {
    var countVisualEditing = 0;
    placeAnOrderArray?.editing?.map((shoot_type) => {
      let shootType = shoot_types?.type?.find((ele) => ele?.id === shoot_type?.shoot_type_id);

      if (shootType !== undefined) {
        let shootTypeEditing = visual_editing?.find((ele) => ele?.id === shoot_type?.item_id);

        if (shootTypeEditing !== undefined) {
          countVisualEditing = countVisualEditing + 1;
          setVisualEditingCount(countVisualEditing);

          setActiveStep6(true);
          setForm((prevState) => ({
            ...prevState,
            [shootType?.type_slug + "_editing"]: form["editing" +
              capitalizeFirstLetter(shootType?.type_slug) +
              capitalizeFirstLetter(shootTypeEditing?.type_slug)]
              ? ""
              : shootTypeEditing?.id?.toString(),
          }));

          setForm((prevState) => ({
            ...prevState,
            ["editing" +
              capitalizeFirstLetter(shootType?.type_slug) +
              capitalizeFirstLetter(shootTypeEditing?.type_slug)]: !form["editing" +
              capitalizeFirstLetter(shootType?.type_slug) +
              capitalizeFirstLetter(shootTypeEditing?.type_slug)]
          }));
        }
      }

    })
  }, [shoot_types, visual_editing]);

  //editing location features
  useEffect(() => {
    placeAnOrderArray?.order_by?.map((shoot_type) => {

      let shootType = shoot_types?.type?.find((ele) => ele?.id === shoot_type?.shoot_type_id);

      if (shootType !== undefined) {

        shoot_type?.sub_category?.map((subCategory) => {

          let sub_category_types = subCategory?.sub_category_response?.find((ele) => ele?.id === subCategory?.sub_category_id);

          let subCategoryItem = subCategory?.sub_category_type?.find(
            (item) => item?.value === subCategory?.item_id
          )

          if (subCategoryItem !== undefined) {

            let result = subCategory?.sub_category_array.map((itm) => ({
              label: `${itm?.limit_criteria === "exceed"
                ? shootType?.length_type === "1" ? "Number of images " + itm?.no_of_images + "+" : shootType?.length_type === "2" ? "Length of Video in Seconds " + itm?.no_of_images + "+" : "Number of 3D Experiences " + itm?.no_of_images + "+"
                : shootType?.length_type === "1" ? "Number of images " + itm?.no_of_images : shootType?.length_type === "2" ? "Length of Video in Seconds " + itm?.no_of_images : "Number of 3D Experiences " + itm?.no_of_images
                }`,
              value: itm.id,
            }));

            setForm((prevState) => ({
              ...prevState,
              [shootType?.type_slug +
                sub_category_types?.type_slug + "Array"]: subCategory?.sub_category_array,
            }));

            setForm((prevState) => ({
              ...prevState,
              [shootType?.type_slug +
                sub_category_types?.type_slug]: result,
            }));

            let parsesubCategoryItem = parseInt(subCategoryItem?.value)

            let data = {
              label: `${subCategoryItem?.label}`,
              value: parsesubCategoryItem,
            };

            setForm((prevState) => ({
              ...prevState,
              [shootType?.type_slug +
                "_" +
                sub_category_types?.type_slug]: data,
            }));

            setForm((prevState) => ({
              ...prevState,
              ["checkbox_" +
                sub_category_types?.type_slug +
                shootType?.id
              ]: sub_category_types?.id?.toString(),
            }));
          }
        })
      }
    })
  }, [shoot_types]);

  //Shoots Type active
  useEffect(() => {
    var shootType = shoot_types?.type?.find((ele) => shootTypeIds.includes(form[ele?.type_slug]));
    if (shootType === undefined) {
      setActiveStep3(false);
    } else {
      setActiveStep3(true);
    }
  }, [shootCount]);

  //visual editing
  useEffect(() => {
    let editingTypeStackArrayCount = 0;
    shoot_types?.type?.length > 0 &&
      shoot_types?.type?.map((shoot, index) => {
        let editingFlag = visual_editing?.map((editing, index) => {
          return form["editing" +
            capitalizeFirstLetter(shoot?.type_slug) +
            capitalizeFirstLetter(editing?.type_slug)]
        })

        let countEditFlag = editingFlag?.find((edit) => {
          if (edit === true) {
            return true;
          } else {
            return false;
          }
        });

        if (countEditFlag !== undefined && countEditFlag === true) {
          editingTypeStackArrayCount++;
        }

        if (shootTypeStackArrayCount > 0) {
          if (shootTypeStackArrayChanges?.length > 0) {
            if (editingTypeStackArrayCount === shootTypeStackArrayChanges?.length) {
              setActiveStep6(true);
            } else {
              setActiveStep6(false);
            }
          }
        } else {
          if (editingTypeStackArray?.length > 0) {
            if (editingTypeStackArrayCount === editingTypeStackArray?.length) {
              setActiveStep6(true);
            } else {
              setActiveStep6(false);
            }
          }
        }
      })
  }, [visualEditingCount]);

  //location features
  useEffect(() => {
    var locationFeaturesCount = null;
    if (shootLocationFeaturesShootName !== null) {

      if (form["checkbox_" +
        shootLocationFeaturesSubCategoryName +
        shootLocationFeaturesShootID] === "") {

        delete form[shootLocationFeaturesShootName + "_" +
          shootLocationFeaturesSubCategoryName]

        if (shootLocationArrayIDs?.includes(shootLocationFeaturesShootID)) {
          const index = shootLocationArrayIDs.indexOf(shootLocationFeaturesShootID);

          if (index > -1) {
            shootLocationArrayIDs.splice(index, 1);

          }

          var finalArray = shootLocationArrayIDs?.filter((ele) => ele === shootLocationFeaturesShootID)
        }

        if (finalArray?.length === 0) {
          setShootTypeStackArray(oldArray => [...oldArray, shootLocationFeaturesShootName]);
        }

      } else {
        setShootLocationArrayIDs(oldArray => [...oldArray, shootLocationFeaturesShootID])

        let check = shootLocationArrayIDs?.includes(shootLocationFeaturesShootID)
        if (!check) {
          locationFeaturesCount = shootTypeStackArray?.filter((shootType) => shootType !== shootLocationFeaturesShootName);
          setShootTypeStackArray(locationFeaturesCount);
        }

      }
    }

  }, [shootLocationFeaturesCount]);

  //location features active
  useEffect(() => {
    if (shootLocationFeaturesShootName) {
      if (shootTypeStackArray?.length === 0) {
        setActiveStep5(true);
      } else {
        setActiveStep5(false);
      }
    }

  }, [shootTypeStackArray])

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  //next button
  const handleTabClick = (step, stepper, next) => {
    if (stepper === "stepper1") {
      const filterStepList = stepViews.map((el) =>
        el.step === step
          ? { ...el, isActive: true }
          : { ...el, isActive: false }
      );
      setStepViews(filterStepList);
    }

    var isValid = true;
    if (step === "step4") {
      setShootTypeStackArrayCountFlag(true);
      if (placeAnOrderArray) {
        shoot_types?.type?.map(
          (shoot_type, index) => {
            if (form[shoot_type?.type_slug] !== "") {
              setShootTypeStackArrayChanges(oldArray => [...oldArray, shoot_type?.type_slug])
            }
          })
      }
    }

    if (step === "step5") {
      if (placeAnOrderArray) {
        let uniq = [...new Set(shootTypeStackArrayChanges)];
        setShootTypeStackArrayChanges(uniq);
      }
    }
    if (step === "step6") {
      if (placeAnOrderArray) {
        shoot_types?.type?.map((shootType, index) => {
          sub_category?.data?.map((subCategory, sub_index) => {
            if (form[
              "checkbox" +
              "_" +
              subCategory?.type_slug + shootType?.id
            ] !== "") {
              if (form[
                shootType?.type_slug +
                "_" +
                subCategory?.type_slug
              ] === "") {
                isValid = false;
                setError((prevState) => ({
                  ...prevState,
                  [shootType?.type_slug +
                    "_" +
                    subCategory?.type_slug]: "Please select sub category item.",
                }));
              }
            }
          })
        })
      } else {
        shoot_types?.type?.map((shootType, index) => {
          sub_category?.data?.map((subCategory, sub_index) => {
            if (form[
              "checkbox" +
              "_" +
              subCategory?.type_slug + shootType?.id
            ] !== "") {
              if (form[
                shootType?.type_slug +
                "_" +
                subCategory?.type_slug
              ] === "") {

                isValid = false;
                setError((prevState) => ({
                  ...prevState,
                  [shootType?.type_slug +
                    "_" +
                    subCategory?.type_slug]: "Please select sub category item.",
                }));
              }
            }
          })
        })
      }

    }

    if (isValid) {
      const filterStepList = stepViews.map((el) =>
        el.step === step
          ? { ...el, isActive: true }
          : { ...el, isActive: false }
      );
      setStepViews(filterStepList);
    }
  };

  //categories tab
  const handleActiveTabClick = (step, active_tab) => {
    setError({});
    if (activeStep0 && step === "step1") {
      const filterStepList = stepViews.map((el) =>
        el.step === step
          ? { ...el, isActive: true }
          : { ...el, isActive: false }
      );
      setStepViews(filterStepList);
    }

    if (activeStep2 && step === "step2") {
      const filterStepList = stepViews.map((el) =>
        el.step === step
          ? { ...el, isActive: true }
          : { ...el, isActive: false }
      );
      setStepViews(filterStepList);
    }

    if (activeStep3 && step === "step3") {
      const filterStepList = stepViews.map((el) =>
        el.step === step
          ? { ...el, isActive: true }
          : { ...el, isActive: false }
      );
      setStepViews(filterStepList);
    }

    if (activeStep4 && step === "step4") {

      if (placeAnOrderArray) {
        shoot_types?.type?.map(
          (shoot_type, index) => {
            if (form[shoot_type?.type_slug] !== "") {
              setShootTypeStackArrayChanges(oldArray => [...oldArray, shoot_type?.type_slug])
            }
          })
      }

      const filterStepList = stepViews.map((el) =>
        el.step === step
          ? { ...el, isActive: true }
          : { ...el, isActive: false }
      );
      setStepViews(filterStepList);
    }

    if (activeStep5 && step === "step5") {
      const filterStepList = stepViews.map((el) =>
        el.step === step
          ? { ...el, isActive: true }
          : { ...el, isActive: false }
      );
      setStepViews(filterStepList);
    }

    if (activeStep6 && step === "step6") {
      const filterStepList = stepViews.map((el) =>
        el.step === step
          ? { ...el, isActive: true }
          : { ...el, isActive: false }
      );
      setStepViews(filterStepList);
    }

    if (activeStep7 && step === "step7") {
      const filterStepList = stepViews.map((el) =>
        el.step === step
          ? { ...el, isActive: true }
          : { ...el, isActive: false }
      );
      setStepViews(filterStepList);
    }
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

  //onchange shoot type
  const changeHandlerShootType = (e, shootTypeName) => {
    setShootLocationArrayIDs([]);
    if (shootTypeStackArrayCountFlag) {
      setShootTypeStackArrayCount(shootTypeStackArrayCount + 1)
    }

    setActiveStep6(false);
    setActiveStep5(false);

    setShootCount(shootCount + 1)

    shoot_types?.type?.map(
      (shoot_type) => {
        visual_editing?.map((editingType, sub_index) => {
          delete form["editing" +
            capitalizeFirstLetter(shoot_type?.type_slug) +
            capitalizeFirstLetter(editingType?.type_slug)]
        })

        sub_category?.data?.map(
          (subCategory, index) => {
            delete form[
              "checkbox_" +
              subCategory?.type_slug +
              shoot_type?.id
            ]

            delete form[
              shoot_type?.type_slug +
              "_" +
              subCategory?.type_slug
            ]
          })

      })

    if (form[shootTypeName] === undefined || form[shootTypeName] === "") {
      setShootTypeStackArray(oldArray => [...oldArray, shootTypeName]);
      setEditingTypeStackArray(oldArray => [...oldArray, shootTypeName]);
      setShootTypeStackArrayChanges(oldArray => [...oldArray, shootTypeName])

      let shootAdd = shoot_types?.type?.find((shoot_type) => shoot_type?.type_slug === shootTypeName);

      sub_category?.data?.map(
        (subCategory, index) => {
          setForm((prevState) => ({
            ...prevState,
            [shootAdd?.type_slug +
              "_" +
              subCategory?.type_slug]: "",
          }));

          if (form[
            "checkbox_" +
            subCategory?.type_slug +
            shootAdd?.id
          ] === undefined) {
            setForm((prevState) => ({
              ...prevState,
              ["checkbox_" +
                subCategory?.type_slug +
                shootAdd?.id]: "",
            }));
          }
        })


    } else {
      let removeShootType = shootTypeStackArray?.filter((shoot) => shoot !== shootTypeName);
      let removeShootTypeChange = shootTypeStackArrayChanges?.filter((shoot) => shoot !== shootTypeName);
      setShootTypeStackArray(removeShootType);
      setEditingTypeStackArray(removeShootType);
      setShootTypeStackArrayChanges(removeShootTypeChange);
    }

    if (e.target) {
      const value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;

      const { name } = e.target;
      setForm((prevState) => ({
        ...prevState,
        [name]: value === true
          ? shoot_types?.type
            ?.find((shoot) => shoot?.type_slug === shootTypeName)
            .id?.toString()
          : ""
      }));

    } else {
      const { value } = e;
      const { name } = e.target;
      setForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  //onchange location features
  const subCategoryItemApi = (subcategory_item, shootTypeSlugName, subCategoryID) => {
    setShootLocationFeaturesCount(shootLocationFeaturesCount + 1);
    setShootLocationFeaturesShootID(shootTypeSlugName?.id);
    setShootLocationFeaturesSubCategoryName(subcategory_item?.type_slug);
    setShootLocationFeaturesShootName(shootTypeSlugName?.type_slug);

    setForm((prevState) => ({
      ...prevState,
      [shootTypeSlugName?.type_slug +
        "_" +
        subcategory_item?.type_slug]: "",
    }));

    if (subcategory_item?.type_slug) {
      // photo , drone photo, standard

      let subcategory_item_id = subCategoryID;
      dispatch(
        getSubCategoryItem({
          subcategory_item_id,
          callback: async (data) => {
            if (data) {
              setForm((prevState) => ({
                ...prevState,
                [shootTypeSlugName?.type_slug +
                  subcategory_item?.type_slug + "Array"]: data?.data,
              }));

              let result = data?.data.map((itm) => ({
                label: `${itm?.limit_criteria === "exceed"
                  ? shootTypeSlugName?.length_type === "1" ? "Number of images " + itm?.no_of_images + "+" : shootTypeSlugName?.length_type === "2" ? "Length of Video in Seconds " + itm?.no_of_images + "+" : "Number of 3D Experiences " + itm?.no_of_images + "+"
                  : shootTypeSlugName?.length_type === "1" ? "Number of images " + itm?.no_of_images : shootTypeSlugName?.length_type === "2" ? "Length of Video in Seconds " + itm?.no_of_images : "Number of 3D Experiences " + itm?.no_of_images
                  }`,
                value: itm.id,
              }));

              setForm((prevState) => ({
                ...prevState,
                [shootTypeSlugName?.type_slug +
                  subcategory_item?.type_slug]: result,
              }));
            }
          },
        })
      );
    }
  }

  //onchange visual editing
  const changeHandlerEditing = (e, shootType, editingType, id) => {
    e.preventDefault();
    setVisualEditingCount(visualEditingCount + 1);

    setForm((prevState) => ({
      ...prevState,
      [shootType + "_editing"]: form["editing" +
        capitalizeFirstLetter(shootType) +
        capitalizeFirstLetter(editingType)]
        ? ""
        : id?.toString(),
    }));

    setForm((prevState) => ({
      ...prevState,
      ["editing" +
        capitalizeFirstLetter(shootType) +
        capitalizeFirstLetter(editingType)]: !form["editing" +
        capitalizeFirstLetter(shootType) +
        capitalizeFirstLetter(editingType)]
    }));

    //editing flags
    shoot_types?.type?.length > 0 &&
      shoot_types?.type?.map((shoot, index) => {
        if (shoot?.type_slug === shootType) {
          visual_editing?.length > 0 &&
            visual_editing?.map((editing, index) => {
              if (editing?.type_slug !== editingType) {
                setForm((prevState) => ({
                  ...prevState,
                  ["editing" +
                    capitalizeFirstLetter(shoot?.type_slug) +
                    capitalizeFirstLetter(editing?.type_slug)]:
                    false
                }));
              }
            })
        }
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let userData = JSON.parse(getLocalStorageItem("userData"));

    var temporay_order_by = shoot_types?.type?.map((ele) => ({
      shoot_type_id:
        ele?.id === parseInt(form[ele?.type_slug])
          ? ele?.id
          : null,
      category_id: parseInt(form?.sub_category),
      sub_category: sub_category?.data?.map((data) => ({
        sub_category_response: sub_category?.data,
        sub_category_id: data?.id,
        sub_category_array:
          ele?.id === parseInt(form[ele?.type_slug]) &&
            data?.id === parseInt(form[
              "checkbox_" +
              data?.type_slug +
              ele?.id
            ])
            ? form[ele?.type_slug + data?.type_slug + "Array"]
            : null,
        sub_category_type:
          ele?.id === parseInt(form[ele?.type_slug]) &&
            data?.id === parseInt(form[
              "checkbox_" +
              data?.type_slug +
              ele?.id
            ])
            ? form[ele?.type_slug + data?.type_slug]
            : null,
        item_id:
          ele?.id === parseInt(form[ele?.type_slug]) &&
            data?.id === parseInt(form[
              "checkbox_" +
              data?.type_slug +
              ele?.id
            ])
            ? parseInt(form[ele?.type_slug +
              "_" +
              data?.type_slug].value)
            : null,
      })),
    }));

    var temporay_shoot_type = temporay_order_by?.filter((order) => {
      if (order?.shoot_type_id !== null) {
        return ({
          ...order, sub_category: order.sub_category?.filter((category) => {
            return category;
          })
        })
      }

    })

    var order_by = temporay_shoot_type.map((order) => {
      return ({
        ...order, sub_category: order?.sub_category?.filter((category) => {
          if (category?.item_id !== null) {
            return category;
          }

        })
      })
    })

    var temporaryEditing = shoot_types?.type?.map((ele) => ({
      shoot_type_id:
        ele?.id === parseInt(form[ele?.type_slug])
          ? ele?.id
          : null,
      category_id: parseInt(form?.sub_category),
      item_id:
        ele?.id === parseInt(form[ele?.type_slug])
          ? parseInt(form[ele?.type_slug + "_editing"])
          : null,
    }));

    let editing = temporaryEditing?.filter((editing) => {
      if (editing?.shoot_type_id !== null && editing?.item_id !== null) {
        return editing;
      }

    })

    const { errors, isValid } = validateBillingInstruction(form);
    if (isValid) {
      var place_an_order_form = {
        name_of_project: form?.name_of_project,
        city: form?.city,
        state: form?.state,
        zip_code: form?.zip_code,
        country: form?.country,
        address: form?.address,
        project_location: "",
        latitude: latitude,
        longitude: longitude,
        date_of_shoot: form?.date,
        time_of_shoot: form?.time,
        category_id: parseInt(form?.sub_category),
        client_id: userData?.client_id,
        order_by: order_by,
        editing: editing,
        ref_address: form?.ref_address,
        ref_contact: form?.ref_contact,
        billing_address: form?.billing_address,
        additional_instruction: form?.additional_instruction,
        payment_type: parseInt(form?.payment_type),
      };

      if (
        activeStep1 &&
        activeStep2 &&
        activeStep3 &&
        activeStep4 &&
        activeStep5 &&
        activeStep6 &&
        activeStep7
      ) {
        removeLocalStorageItem("editOrder");
        localStorage.setItem("count", 0);
        localStorage.setItem("sub_category", JSON.stringify(sub_category));

        history.push({
          pathname: "/cart",
          state: place_an_order_form,
        });
      } else {
        if (activeStep1 === false) {
          var filterStepList = stepViews.map((el) =>
            el.step === "step1"
              ? { ...el, isActive: true }
              : { ...el, isActive: false }
          );
        } else if (activeStep2 === false) {
          var filterStepList = stepViews.map((el) =>
            el.step === "step2"
              ? { ...el, isActive: true }
              : { ...el, isActive: false }
          );
        } else if (activeStep3 === false) {
          var filterStepList = stepViews.map((el) =>
            el.step === "step3"
              ? { ...el, isActive: true }
              : { ...el, isActive: false }
          );
        } else if (activeStep4 === false) {
          var filterStepList = stepViews.map((el) =>
            el.step === "step4"
              ? { ...el, isActive: true }
              : { ...el, isActive: false }
          );
        } else if (activeStep5 === false) {
          var filterStepList = stepViews.map((el) =>
            el.step === "step5"
              ? { ...el, isActive: true }
              : { ...el, isActive: false }
          );
        } else if (activeStep6 === false) {
          var filterStepList = stepViews.map((el) =>
            el.step === "step6"
              ? { ...el, isActive: true }
              : { ...el, isActive: false }
          );
        } else if (activeStep7 === false) {
          var filterStepList = stepViews.map((el) =>
            el.step === "step7"
              ? { ...el, isActive: true }
              : { ...el, isActive: false }
          );
        }
        setStepViews(filterStepList);
      }
    } else {
      setError(errors);
    }
  };

  const isWeekday = (date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  return (
    <>
      <Header
        isJob={true}
        langSelector={false}
        logoutFlag={false}
        orderCount={cartCount}
        client={true}
      />
      <section className="signUpNext-main ">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-10 col-sm-12 col-md-8 signUpNext-detail py-5 animated fadeIn place-an-order">
              <div className="place-order-heading text-center">
                <p className="text_body">
                  What type of order would you like to perform?
                </p>
                <h6 className="sub-title">
                  Choose one of our available categories that suits your needs
                  the most
                </h6>
              </div>
              <div
                className="mx-xl-10 signupnext-padding  place-order-body"
                onSubmit={(e) => handleSubmit(e)}
              >
                <div className="item-one d-flex align-item-center">
                  <span
                    onClick={() => {
                      handleTabClick("step0", "stepper1");
                    }}
                    className={`${activeStep0 ? "active" : ""} place-number`}
                  >
                    1
                  </span>
                  <div className="place-content">
                    <a
                      onClick={() => {
                        handleTabClick("step0", "stepper1");
                      }}
                      className="place-title"
                    >
                      Project Name
                    </a>
                    {stepViews[7]?.isActive ? (
                      <div className="item-toggle">
                        <div className="form-group mt-4">
                          <Input
                            type="text"
                            classNamePlaceHolder="newPlace"
                            className=""
                            name="name_of_project"
                            value={form.name_of_project || ""}
                            onChange={(e) => {
                              changeHandler(e);
                            }}
                            error={error?.name_of_project}
                            maxLength="100"
                            label="Project Name"
                          />
                        </div>
                        <div className="search-btn text-center w-100">
                          <button
                            className={`${!activeStep0 ? "disable-btn-one" : ""
                              } w-100 login-btn btn-common`}
                            disabled={!activeStep0}
                            onClick={() => {
                              handleTabClick("step1", "", "next0");
                            }}
                            type="submit"
                          >
                            NEXT
                          </button>
                        </div>
                      </div>
                    ) : (
                      " "
                    )}
                  </div>
                </div>
                <div className="item-one d-flex align-item-center">
                  <span
                    onClick={() => {
                      handleActiveTabClick("step1", activeStep0);
                    }}
                    className={`${activeStep1 ? "active" : ""} place-number`}
                  >
                    2
                  </span>
                  <div className="place-content">
                    <a
                      onClick={() => {
                        handleActiveTabClick("step1", activeStep0);
                      }}
                      className="place-title"
                    >
                      Add Location
                    </a>
                    {stepViews[0]?.isActive ? (
                      <div className="item-toggle">
                        <div className="search-form">
                          <div className="search-content">
                            <div className="search-box d-flex flex-wrap">
                              <label className="mb-2 w-100">
                                Search for Street or Address
                              </label>
                              <AutocompleteMap
                                setCity={setCity}
                                setState={setState}
                                setZipCode={setZipCode}
                                setCountry={setCountry}
                                setAddress={setAddress}
                                address={address}
                                setLatitude={setLatitude}
                                setLongitude={setLongitude}
                              />
                            </div>
                            <div className="search-map">
                              {latitude && longitude ? (
                                <Map
                                  latitude={latitude}
                                  longitude={longitude}
                                  address={
                                    city +
                                    " " +
                                    state +
                                    " " +
                                    zipCode +
                                    " " +
                                    country
                                  }
                                />
                              ) : (
                                <img src={searchMap} alt="" />
                              )}
                            </div>
                            <div className="street-add">
                              <h3 className="street-title">Street Address</h3>
                              <Input
                                type="text"
                                classNamePlaceHolder="newPlaceOne"
                                className=""
                                name="address"
                                value={form.address || ""}
                                onChange={(e) => {
                                  changeHandler(e);
                                }}
                                error={error?.address}
                                maxLength="100"
                                label="Address"
                              />
                              <div className="street-half d-flex justify-content-between flex-wrap">
                                <div className="form-group">
                                  <Input
                                    type="text"
                                    classNamePlaceHolder="newPlace"
                                    className=""
                                    name="city"
                                    value={form.city || ""}
                                    onChange={(e) => {
                                      changeHandler(e);
                                    }}
                                    error={error?.city}
                                    maxLength="100"
                                    label="City"
                                  />
                                </div>
                                <div className="form-group">
                                  <Input
                                    type="text"
                                    classNamePlaceHolder="newPlace"
                                    className=""
                                    name="state"
                                    value={form.state || ""}
                                    onChange={(e) => {
                                      changeHandler(e);
                                    }}
                                    error={error?.state}
                                    maxLength="100"
                                    label="State"
                                  />
                                </div>
                                <div className="form-group">
                                  <Input
                                    type="text"
                                    classNamePlaceHolder="newPlace"
                                    className=""
                                    name="zip_code"
                                    value={form.zip_code || ""}
                                    onChange={(e) => {
                                      changeHandler(e);
                                    }}
                                    error={error?.zip_code}
                                    maxLength="100"
                                    label="Zip Code"
                                  />
                                </div>
                                <div className="form-group">
                                  <Input
                                    type="text"
                                    classNamePlaceHolder="newPlace"
                                    className=""
                                    name="country"
                                    value={form.country || ""}
                                    onChange={(e) => {
                                      changeHandler(e);
                                    }}
                                    error={error?.country}
                                    maxLength="100"
                                    label="Country"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="search-btn text-center w-100">
                            <button
                              disabled={!activeStep1}
                              onClick={() => {
                                handleTabClick("step2", "", "next1");
                              }}
                              type="submit"
                              className={`${!activeStep1 ? "disable-btn-one" : ""
                                } w-100 login-btn btn-common`}
                            >
                              NEXT
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      " "
                    )}
                  </div>
                </div>
                <div className="item-one d-flex align-item-center">
                  <span
                    onClick={() => {
                      handleActiveTabClick("step2", activeStep2);
                    }}
                    className={`${activeStep2 ? "active" : ""} place-number`}
                  >
                    3
                  </span>
                  <div className="place-content">
                    <a
                      onClick={() => {
                        handleActiveTabClick("step2", activeStep2);
                      }}
                      className="place-title"
                    >
                      Schedule Shoot
                    </a>
                    <h6 className="place-content-data">
                      * widu can schedule a shoot with a minimum lead time of 4
                      working days, incase you need more customised service
                      please contact{" "}
                      <a href="mailto:sales@widu.co">sales@widu.co</a>{" "}
                    </h6>
                    {stepViews[1]?.isActive ? (
                      <div className="item-toggle">
                        <div
                          onClick={() => {
                            handleActiveTabClick("step2", activeStep2);
                          }}
                          className="date-time d-flex"
                        >
                          <div
                            className={`${form?.date ? "" : "date-field"
                              } date-icon  select-arrow`}
                          >
                            <DatePicker
                              selected={form?.date}
                              onChange={(date) => {
                                setForm((prevState) => ({
                                  ...prevState,
                                  ["date"]: date,
                                }));
                                setError((prevState) => ({
                                  ...prevState,
                                  ["date"]: "",
                                }));
                              }}
                              className="datepickerInput"
                              minDate={startDate}
                              dateFormat="do MMM"
                              filterDate={isWeekday}
                            />
                            {error?.date && (
                              <div className="invalid">{error?.date}</div>
                            )}
                          </div>
                          <div
                            className={`${form?.time ? "" : "date-title"
                              } time-field select-arrow`}
                          >
                            <DatePicker
                              selected={form?.time}
                              onChange={(time) => {
                                setForm((prevState) => ({
                                  ...prevState,
                                  ["time"]: time,
                                }));
                                setError((prevState) => ({
                                  ...prevState,
                                  ["time"]: "",
                                }));
                              }}
                              showTimeSelect
                              className="datepickerInput"
                              showTimeSelectOnly
                              timeIntervals={15}
                              timeCaption="Time"
                              dateFormat="h:mm aa"
                            />
                            {error?.time && (
                              <div className="invalid">{error?.time}</div>
                            )}
                          </div>
                        </div>
                        <div className="shoot-types shoot-types-check d-flex flex-wrap justify-content-between">
                          <div className="text-center w-100">
                            <button
                              disabled={!activeStep2}
                              onClick={() => {
                                handleTabClick("step3", "", "next2");
                              }}
                              type="submit"
                              className={`${!activeStep2 ? "disable-btn-one" : ""
                                } w-100 login-btn btn-common`}
                            >
                              NEXT
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="item-one d-flex align-item-center">
                  <span
                    onClick={() => {
                      handleActiveTabClick("step3", activeStep3);
                    }}
                    className={`${activeStep3 ? "active" : " "} place-number`}
                  >
                    4
                  </span>
                  <div className="place-content">
                    <a
                      onClick={() => {
                        handleActiveTabClick("step3", activeStep3);
                      }}
                      className="place-title"
                    >
                      Shoots Type
                    </a>
                    {stepViews[2]?.isActive ? (
                      <div className="item-toggle">
                        <div>
                          <div className="shoot-types shoot-types-check d-flex flex-wrap justify-content-between">
                            {shoot_types?.type?.length > 0 &&
                              shoot_types?.type?.map((shootType, index) => {
                                return (
                                  <div
                                    key={index}
                                    className="shoot-one d-flex flex-row-reverse justify-content-end"
                                  >
                                    <input
                                      id={`test1${shootType?.id}`}
                                      value={
                                        shootType?.id ===
                                          shoot_types?.type?.find(
                                            (shootId) => shootType?.id === shootId
                                          )
                                          ? form[shootType?.type_slug]
                                          : ""
                                      }
                                      onChange={(e) => {
                                        changeHandlerShootType(
                                          e,
                                          shoot_types?.type?.find((shootId) => shootId?.id === shootType?.id)?.type_slug)
                                      }}
                                      type="checkbox"
                                      name={
                                        shoot_types?.type?.find((shootId) => shootId?.id === shootType?.id)?.type_slug
                                      }
                                      checked={
                                        shootType?.id?.toString() === form[shootType?.type_slug]
                                      }
                                    />
                                    <label
                                      htmlFor={`test1${shootType?.id}`}
                                      title={`item${shootType?.id}`}
                                      className="me-2 d-flex align-items-center"
                                    >
                                      {shootType?.type_name}
                                    </label>
                                  </div>
                                );
                              })}
                            {error?.shoot_type && (
                              <div className="invalid">{error?.shoot_type}</div>
                            )}
                          </div>
                          <div className="search-btn text-center w-100">
                            <button
                              disabled={!activeStep3}
                              onClick={() => {
                                handleTabClick("step4", "", "next3");
                              }}
                              type="submit"
                              className={`${!activeStep3 ? "disable-btn-one" : ""
                                } w-100 login-btn btn-common`}
                            >
                              NEXT
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      " "
                    )}
                  </div>
                </div>
                <div className="item-one d-flex align-item-center">
                  <span
                    onClick={() => {
                      handleActiveTabClick("step4", activeStep4);
                    }}
                    className={`${activeStep4 ? "active" : " "} place-number`}
                  >
                    5
                  </span>
                  <div className="place-content">
                    <a
                      onClick={() => {
                        handleActiveTabClick("step4", activeStep4);
                      }}
                      className="place-title"
                    >
                      Choose Shoots Category
                    </a>
                    {stepViews[3]?.isActive ? (
                      <div className="item-toggle">
                        <div>
                          <div className="shoot-types d-flex flex-wrap justify-content-between">
                            {category_types?.category?.length > 0 &&
                              category_types?.category?.map(
                                (category_type, index) => {
                                  return (
                                    <div
                                      key={index}
                                      className="shoot-one d-flex flex-row-reverse  justify-content-end"
                                    >
                                      <input
                                        id={`test1${category_type?.id}`}
                                        onChange={(e) => {
                                          changeHandler(e);
                                        }}
                                        type="radio"
                                        name="sub_category"
                                        value={category_type?.id?.toString()}
                                        checked={
                                          form?.sub_category ===
                                          category_type?.id.toString()
                                        }
                                      />
                                      {category_type?.name}
                                      <label
                                        htmlFor={`test1${category_type?.id}`}
                                        title="item2"
                                        className="me-2 d-flex align-items-center "
                                      ></label>
                                    </div>
                                  );
                                }
                              )}
                            {error?.sub_category && (
                              <div className="invalid">
                                {error?.sub_category}
                              </div>
                            )}
                          </div>
                          <div className="search-btn text-center w-100">
                            <button
                              disabled={!activeStep4}
                              onClick={() => {
                                handleTabClick("step5", "", "next4");
                              }}
                              type="submit"
                              className={`${!activeStep4 ? "disable-btn-one" : ""
                                } w-100 login-btn btn-common`}
                            >
                              NEXT
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      " "
                    )}
                  </div>
                </div>
                <div className="item-one d-flex align-item-center">
                  <span
                    onClick={() => {
                      handleActiveTabClick("step5", activeStep5);
                    }}
                    className={`${activeStep5 ? "active" : " "} place-number`}
                  >
                    6
                  </span>
                  <div className="place-content">
                    <a
                      onClick={() => {
                        handleActiveTabClick("step5", activeStep5);
                      }}
                      className="place-title"
                    >
                      Location Features
                    </a>
                    {stepViews[4]?.isActive ? (
                      <div className="item-toggle">
                        <div>
                          <h5 className="location-title">
                            Shoots Category :
                            <span>
                              {
                                category_types?.category?.find(
                                  (category) =>
                                    category?.id ===
                                    parseInt(form?.sub_category)
                                )?.name
                              }
                            </span>
                          </h5>
                          {shoot_types?.type?.length > 0 &&
                            shoot_types?.type?.map((shootType, index) => {
                              if (
                                shootType?.id?.toString() ===
                                form[shootType?.type_slug]
                              ) {
                                return (
                                  <div
                                    key={index}
                                    className="shoot-types shoot-types-check location-types d-flex flex-wrap justify-content-between mb-5"
                                  >
                                    <div className="shoot-types-title w-100 mb-2">
                                      <h5>
                                        {
                                          shoot_types?.type?.find(
                                            (shoot) =>
                                              shoot?.id?.toString() ===
                                              form[shootType?.type_slug]
                                          )?.type_name
                                        }
                                      </h5>
                                    </div>
                                    {sub_category?.data?.map(
                                      (subCategory, index) => {
                                        return (
                                          <div
                                            key={index}
                                            className="shoot-one d-flex flex-row-reverse  justify-content-end"
                                          >
                                            {form[
                                              "checkbox_" +
                                              subCategory?.type_slug +
                                              shootType?.id
                                            ] === subCategory?.id?.toString() ? (
                                              <SelectDropDown
                                                options={
                                                  form[shootType?.type_slug +
                                                  subCategory?.type_slug]}
                                                value={
                                                  form[
                                                  shootType?.type_slug +
                                                  "_" +
                                                  subCategory?.type_slug
                                                  ]
                                                }
                                                isSearchable={true}
                                                name={
                                                  shootType?.type_slug +
                                                  "_" +
                                                  subCategory?.type_slug
                                                }
                                                className="multiple-search search-select w-100"
                                                onChange={(value) => {
                                                  setForm((prevState) => ({
                                                    ...prevState,
                                                    [shootType?.type_slug +
                                                      "_" +
                                                      subCategory?.type_slug]: value,
                                                  }));
                                                  setError((prevState) => ({
                                                    ...prevState,
                                                    [shootType?.type_slug +
                                                      "_" +
                                                      subCategory?.type_slug]: "",
                                                  }));
                                                }}
                                                loading={
                                                  sub_category_item_loader
                                                }
                                                label={
                                                  subCategory?.sub_category_name
                                                }
                                                error={
                                                  error[
                                                  shootType?.type_slug +
                                                  "_" +
                                                  subCategory?.type_slug
                                                  ]
                                                }
                                              />
                                            ) : (
                                              ""
                                            )}
                                            <input
                                              id={`test${shootType?.id}${subCategory?.id}`}
                                              onChange={(e, value) => {
                                                setForm((prevState) => ({
                                                  ...prevState,
                                                  ["checkbox_" +
                                                    subCategory?.type_slug +
                                                    shootType?.id]:
                                                    e.target.checked === true
                                                      ? subCategory?.id?.toString()
                                                      : "",
                                                }));
                                                subCategoryItemApi(subCategory, shootType, subCategory?.id);
                                              }}
                                              type="checkbox"
                                              name={
                                                "checkbox_" +
                                                subCategory?.type_slug +
                                                shootType?.id
                                              }
                                              value={subCategory?.id?.toString()}
                                              checked={
                                                form[
                                                "checkbox_" +
                                                subCategory?.type_slug +
                                                shootType?.id
                                                ] ===
                                                subCategory?.id?.toString()
                                              }
                                            />
                                            {form[
                                              "checkbox_" +
                                              subCategory?.type_slug +
                                              shootType?.id
                                            ] === subCategory?.id?.toString()
                                              ? ""
                                              : subCategory?.sub_category_name}
                                            <label
                                              htmlFor={`test${shootType?.id}${subCategory?.id}`}
                                              title="item2"
                                              className="me-2 d-flex align-items-center "
                                            ></label>
                                            {
                                              error[
                                              "checkbox_" +
                                              subCategory?.type_slug +
                                              shootType?.id
                                              ] && (
                                                <div className="invalid">
                                                  {error?.checkbox_house_apt1}
                                                </div>
                                              )
                                            }
                                          </div>
                                        );

                                      }
                                    )}
                                  </div>
                                );
                              }
                            })}
                          <div className="search-btn text-center w-100">
                            <button
                              disabled={!activeStep5}
                              onClick={() => {
                                handleTabClick("step6", "", "next5");
                              }}
                              type="submit"
                              className={`${!activeStep5 ? "disable-btn-one" : ""
                                } w-100 login-btn btn-common`}
                            >
                              NEXT
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="item-one d-flex align-item-center">
                  <span
                    onClick={() => {
                      handleActiveTabClick("step6", activeStep6);
                    }}
                    className={`${activeStep6 ? "active" : " "} place-number`}
                  >
                    7
                  </span>
                  <div className="place-content">
                    <a
                      onClick={() => {
                        handleActiveTabClick("step6", activeStep6);
                      }}
                      className="place-title"
                    >
                      Editing
                    </a>
                    {stepViews[5]?.isActive ? (
                      <div className="item-toggle">
                        {shoot_types?.type?.length > 0 &&
                          shoot_types?.type?.map((shootType, index) => {
                            if (
                              shootType?.id?.toString() ===
                              form[shootType?.type_slug]
                            ) {
                              return (
                                <div key={index} className="mb-4 mt-4">
                                  <div className="shoot-types-title w-100 mb-2 mt-3 ps-5">
                                    <h5>
                                      {
                                        shoot_types?.type?.find(
                                          (shoot) =>
                                            shoot?.id?.toString() ===
                                            form[shootType?.type_slug]
                                        )?.type_name
                                      }
                                    </h5>
                                  </div>
                                  <div className="editing-img d-flex justify-content-between">
                                    {visual_editing?.length > 0 &&
                                      visual_editing?.map((editingType, sub_index) => {
                                        return (
                                          <div
                                            key={sub_index}
                                            onClick={(e) => {
                                              changeHandlerEditing(e, shootType?.type_slug, editingType?.type_slug, editingType?.id)
                                            }}
                                            className={`${form["editing" +
                                              capitalizeFirstLetter(shootType?.type_slug) +
                                              capitalizeFirstLetter(editingType?.type_slug)] === true
                                              ? "active-one"
                                              : ""
                                              } edit-one cursor-pointer`}
                                          >
                                            <img src={`${process.env.REACT_APP_AWS_DSP_AWS_URL}editing/${editingType?.image}`} alt="" />
                                            <h4>{editingType?.editing_name}</h4>
                                          </div>
                                        );
                                      })}
                                  </div>
                                </div>
                              );
                            }
                          })}
                        <div className="search-btn text-center w-100">
                          <button
                            disabled={!activeStep6}
                            onClick={() => {
                              handleTabClick("step7", "", "next6");
                            }}
                            type="submit"
                            className={`${!activeStep6 ? "disable-btn-one" : ""
                              } w-100 login-btn btn-common`}
                          >
                            NEXT
                          </button>
                        </div>
                      </div>
                    ) : (
                      " "
                    )}
                  </div>
                </div>
                <div className="item-one d-flex align-item-center">
                  <span
                    onClick={() => {
                      handleActiveTabClick("step7", activeStep7);
                    }}
                    className={`${activeStep7 ? "active" : " "} place-number`}
                  >
                    8
                  </span>
                  <div className="place-content">
                    <a
                      onClick={() => {
                        handleActiveTabClick("step7", activeStep7);
                      }}
                      className="place-title"
                    >
                      Instructions, Organization & Billing
                    </a>
                    {stepViews[6]?.isActive ? (
                      <div className="item-toggle">
                        <div className="instruction-form">
                          <div className="street-add">
                            <div className="street-half d-flex justify-content-between flex-wrap">
                              <div className="form-group">
                                <Input
                                  autoComplete="off"
                                  name="ref_address"
                                  value={form?.ref_address || ""}
                                  onChange={(e) => {
                                    changeHandler(e);
                                  }}
                                  classNamePlaceHolder="newPlacetwo"
                                  type="text"
                                  error={error?.ref_address}
                                  label="Reference Address"
                                />
                              </div>
                              <div className="form-group">
                                <Input
                                  autoComplete="off"
                                  name="ref_contact"
                                  value={form?.ref_contact || ""}
                                  onChange={(e) => {
                                    setForm((prevState) => ({
                                      ...prevState,
                                      ["ref_contact"]: e.target.value,
                                    }));
                                  }}
                                  type="number"
                                  classNamePlaceHolder="newPlacetwo"
                                  error={error?.ref_contact}
                                  label="Reference Contact Number"
                                />
                              </div>
                              <div className="form-group w-100">
                                <Input
                                  autoComplete="off"
                                  name="billing_address"
                                  value={form?.billing_address || ""}
                                  onChange={(e) => {
                                    changeHandler(e);
                                  }}
                                  classNamePlaceHolder="newPlacetwo"
                                  type="text"
                                  error={error?.billing_address}
                                  label="Billing Address"
                                />
                              </div>

                              <div className="form-group w-100">
                                <Input
                                  autoComplete="off"
                                  name="additional_instruction"
                                  value={form?.additional_instruction || ""}
                                  onChange={(e) => {
                                    changeHandler(e);
                                  }}
                                  type="text"
                                  classNamePlaceHolder="newPlacetwo"
                                  error={error?.additional_instruction}
                                  label="Additional Instructions"
                                />
                              </div>
                              <div className="form-group mb-4">
                                <div className="shoot-types d-flex flex-wrap justify-content-between">
                                  <div className="shoot-one d-flex flex-row-reverse  justify-content-end">
                                    <input
                                      id="test11"
                                      onChange={(e) => {
                                        changeHandler(e);
                                      }}
                                      type="radio"
                                      name="payment_type"
                                      value="1"
                                      checked={form?.payment_type === "1"}
                                    />
                                    {t("Invoice by email")}
                                    <label
                                      htmlFor="test11"
                                      title="item2"
                                      className="me-2 d-flex align-items-center "
                                    ></label>
                                  </div>
                                  <div className="shoot-one d-flex flex-row-reverse  justify-content-end">
                                    <input
                                      id="test12"
                                      onChange={(e) => {
                                        changeHandler(e);
                                      }}
                                      type="radio"
                                      name="payment_type"
                                      value="2"
                                      checked={form?.payment_type === "2"}
                                    />
                                    {t("Card payment")}
                                    <label
                                      htmlFor="test12"
                                      title="item2"
                                      className="me-2 d-flex align-items-center "
                                    ></label>
                                  </div>
                                </div>
                                {error?.payment_type && (
                                  <div className="invalid">
                                    {error?.payment_type}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="search-btn text-center w-100">
                              <button
                                disabled={!activeStep7}
                                onClick={(e) => {
                                  handleSubmit(e);
                                }}
                                type="submit"
                                className={`${!activeStep7 ? "disable-btn-one" : ""
                                  } w-100 btn-common`}
                              >
                                {form?.address}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      " "
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer headerDesign={true} />
      </section>
    </>
  );
}