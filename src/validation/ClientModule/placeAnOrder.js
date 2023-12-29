import validator from "validator";

function validatePlaceAnOrder(data, step, stepper, next, editingFlag) {
  const errors = {};
  var shoot_type = null;

  if ((next === "next1") && (stepper !== "stepper1")) {
    if (validator.isEmpty(data.address.trim()))
      errors.address = "Please enter the address."
    if (validator.isEmpty(data.city.trim()))
      errors.city = "Please enter the city."
    if (validator.isEmpty(data.country.trim()))
      errors.country = "Please enter the country."
    if (validator.isEmpty(data.state.trim()))
      errors.state = "Please enter the state."
    if (validator.isEmpty(data.zip_code.trim()))
      errors.zip_code = "Please enter the zipCode."
  }
  if ((next === "next2") && (stepper !== "stepper1")) {
    if (typeof data.date !== "object" && typeof data.time !== "object") {
      if (validator.isEmpty(data.date.trim()))
        errors.date = "Please select the date."
      if (validator.isEmpty(data.time.trim()))
        errors.time = "Please select the time."
    }

    if (typeof data.date === "object") {
      if (data.date === null)
        errors.date = "Please select the date."
    }

    if (typeof data.time !== "object") {
      if (validator.isEmpty(data.time.trim()))
        errors.time = "Please select the time."
    }
  }

  if ((next === "next3") && (stepper !== "stepper1")) {
    shoot_type = (data?.drone_photo || data?.drone_video || data?.matterport || data?.photo || data?.standard || data?.video);
    if (validator.isEmpty(shoot_type))
      errors.shoot_type = "Please select any one shoot type."
  }

  if ((next === "next4") && (stepper !== "stepper1")) {
    if (validator.isEmpty(data?.sub_category))
      errors.sub_category = "Please select any one shoot type."
  }

  if ((next === "next5") && (stepper !== "stepper1")) {
    if (data?.photo === "1") {
      let photo = (data?.checkbox_house_apt1 || data?.checkbox_house_landscape1 || data?.checkbox_landscape1 || data?.checkbox_upto_15_1 || data?.checkbox_more_than_15_1 || data?.checkbox_food_Beverage1 || data?.checkbox_products1);
      if (data?.checkbox_house_apt1 !== "") {
        if (data?.photo_house_apt?.length === 0) {
          errors.photo_house_apt = "Please select house apartment."
        }

      }
      if (data?.checkbox_house_landscape1 !== "") {
        if (data?.photo_house_landscape?.length === 0) {
          errors.photo_house_landscape = "Please select house landscape."
        }

      }
      if (data?.checkbox_landscape1 !== "") {
        if (data?.photo_landscape?.length === 0) {
          errors.photo_landscape = "Please select landscape."
        }

      }
      if (data?.checkbox_upto_15_1 !== "") {
        if (data?.photo_upto_15?.length === 0) {
          errors.photo_upto_15 = "Please select upto 15."
        }

      }
      if (data?.checkbox_more_than_15_1 !== "") {
        if (data?.photo_more_than_15?.length === 0) {
          errors.photo_more_than_15 = "Please select more than 15."
        }

      }
      if (data?.checkbox_food_Beverage1 !== "") {
        if (data?.photo_food_Beverage?.length === 0) {
          errors.photo_food_Beverage = "Please select food beverage."
        }

      }
      if (data?.checkbox_products1 !== "") {
        if (data?.photo_products?.length === 0) {
          errors.photo_products = "Please select product."
        }

      }
      if (validator.isEmpty(photo)) {
        errors.checkbox_house_apt1 = "Please select any one sub category."
      }

    }

    if (data?.video === "3") {
      let video = (data?.checkbox_house_apt2 || data?.checkbox_house_landscape2 || data?.checkbox_landscape2 || data?.checkbox_upto_15_2 || data?.checkbox_more_than_15_2 || data?.checkbox_food_Beverage2 || data?.checkbox_products2);

      if (data?.checkbox_house_apt2 !== "") {
        if (data?.video_house_apt?.length === 0) {
          errors.video_house_apt = "Please select house apartment."
        }

      }
      if (data?.checkbox_house_landscape2 !== "") {
        if (data?.video_house_landscape?.length === 0) {
          errors.video_house_landscape = "Please select house landscape."
        }

      }
      if (data?.checkbox_landscape2 !== "") {
        if (data?.video_landscape?.length === 0) {
          errors.video_landscape = "Please select landscape."
        }

      }
      if (data?.checkbox_upto_15_2 !== "") {
        if (data?.video_upto_15?.length === 0) {
          errors.video_upto_15 = "Please select upto 15."
        }

      }
      if (data?.checkbox_more_than_15_2 !== "") {
        if (data?.video_more_than_15?.length === 0) {
          errors.video_more_than_15 = "Please select more than 15."
        }

      }
      if (data?.checkbox_food_Beverage2 !== "") {
        if (data?.video_food_Beverage?.length === 0) {
          errors.video_food_Beverage = "Please select food beverage."
        }

      }
      if (data?.checkbox_products2 !== "") {
        if (data?.video_products?.length === 0) {
          errors.video_products = "Please select product."
        }

      }
      if (validator.isEmpty(video)) {
        errors.checkbox_house_apt2 = "Please select any one sub category."
      }

    }
    if (data?.drone_photo === "5") {
      let drone_photo = (data?.checkbox_house_apt3 || data?.checkbox_house_landscape3 || data?.checkbox_landscape3 || data?.checkbox_upto_15_3 || data?.checkbox_more_than_15_3 || data?.checkbox_food_Beverage3 || data?.checkbox_products3);

      if (data?.checkbox_house_apt3 !== "") {
        if (data?.drone_photo_house_apt?.length === 0) {
          errors.drone_photo_house_apt = "Please select house apartment."
        }

      }
      if (data?.checkbox_house_landscape3 !== "") {
        if (data?.drone_photo_house_landscape?.length === 0) {
          errors.drone_photo_house_landscape = "Please select house landscape."
        }

      }
      if (data?.checkbox_landscape3 !== "") {
        if (data?.drone_photo_landscape?.length === 0) {
          errors.drone_photo_landscape = "Please select landscape."
        }

      }
      if (data?.checkbox_upto_15_3 !== "") {
        if (data?.drone_photo_upto_15?.length === 0) {
          errors.drone_photo_upto_15 = "Please select upto 15."
        }

      }
      if (data?.checkbox_more_than_15_3 !== "") {
        if (data?.drone_photo_more_than_15?.length === 0) {
          errors.drone_photo_more_than_15 = "Please select more than 15."
        }

      }
      if (data?.checkbox_food_Beverage3 !== "") {
        if (data?.drone_photo_food_Beverage?.length === 0) {
          errors.drone_photo_food_Beverage = "Please select food beverage."
        }

      }
      if (data?.checkbox_products3 !== "") {
        if (data?.drone_photo_products?.length === 0) {
          errors.drone_photo_products = "Please select product."
        }
      }
      if (validator.isEmpty(drone_photo)) {
        errors.checkbox_house_apt3 = "Please select any one sub category."
      }

    }

    if (data?.drone_video === "2") {
      let drone_video = (data?.checkbox_house_apt4 || data?.checkbox_house_landscape4 || data?.checkbox_landscape4 || data?.checkbox_upto_15_4 || data?.checkbox_more_than_15_4 || data?.checkbox_food_Beverage4 || data?.checkbox_products4);

      if (data?.checkbox_house_apt4 !== "") {
        if (data?.drone_video_house_apt?.length === 0) {
          errors.drone_video_house_apt = "Please select house apartment."
        }

      }
      if (data?.checkbox_house_landscape4 !== "") {
        if (data?.drone_video_house_landscape?.length === 0) {
          errors.drone_video_house_landscape = "Please select house landscape."
        }

      }
      if (data?.checkbox_landscape4 !== "") {
        if (data?.drone_video_landscape?.length === 0) {
          errors.drone_video_landscape = "Please select landscape."
        }

      }
      if (data?.checkbox_upto_15_4 !== "") {
        if (data?.drone_video_upto_15?.length === 0) {
          errors.drone_video_upto_15 = "Please select upto 15."
        }

      }
      if (data?.checkbox_more_than_15_4 !== "") {
        if (data?.drone_video_more_than_15?.length === 0) {
          errors.drone_video_more_than_15 = "Please select more than 15."
        }

      }
      if (data?.checkbox_food_Beverage4 !== "") {
        if (data?.drone_video_food_Beverage?.length === 0) {
          errors.drone_video_food_Beverage = "Please select food beverage."
        }

      }
      if (data?.checkbox_products4 !== "") {
        if (data?.drone_video_products?.length === 0) {
          errors.drone_video_products = "Please select product."
        }

      }
      if (validator.isEmpty(drone_video)) {
        errors.checkbox_house_apt4 = "Please select any one sub category."
      }

    }


    if (data?.standard === "4") {
      let standard = (data?.checkbox_house_apt5 || data?.checkbox_house_landscape5 || data?.checkbox_landscape5 || data?.checkbox_upto_15_5 || data?.checkbox_more_than_15_5 || data?.checkbox_food_Beverage5 || data?.checkbox_products5);

      if (data?.checkbox_house_apt5 !== "") {
        if (data?.standard_house_apt?.length === 0) {
          errors.standard_house_apt = "Please select house apartment."
        }

      }
      if (data?.checkbox_house_landscape5 !== "") {
        if (data?.standard_house_landscape?.length === 0) {
          errors.standard_house_landscape = "Please select house landscape."
        }

      }
      if (data?.checkbox_landscape5 !== "") {
        if (data?.standard_landscape?.length === 0) {
          errors.standard_landscape = "Please select landscape."
        }

      }
      if (data?.checkbox_upto_15_5 !== "") {
        if (data?.standard_upto_15?.length === 0) {
          errors.standard_upto_15 = "Please select upto 15."
        }

      }
      if (data?.checkbox_more_than_15_5 !== "") {
        if (data?.standard_more_than_15?.length === 0) {
          errors.standard_more_than_15 = "Please select more than 15."
        }

      }
      if (data?.checkbox_food_Beverage5 !== "") {
        if (data?.standard_food_Beverage?.length === 0) {
          errors.standard_food_Beverage = "Please select food beverage."
        }

      }
      if (data?.checkbox_products5 !== "") {
        if (data?.standard_products?.length === 0) {
          errors.standard_products = "Please select product."
        }

      }
      if (validator.isEmpty(standard)) {
        errors.checkbox_house_apt5 = "Please select any one sub category."
      }

    }


    if (data?.matterport === "6") {
      let matterport = (data?.checkbox_house_apt6 || data?.checkbox_house_landscape6 || data?.checkbox_landscape6 || data?.checkbox_upto_15_6 || data?.checkbox_more_than_15_6 || data?.checkbox_food_Beverage6 || data?.checkbox_products6);

      if (data?.checkbox_house_apt6 !== "") {
        if (data?.matterport_house_apt?.length === 0) {
          errors.matterport_house_apt = "Please select house apartment."
        }

      }
      if (data?.checkbox_house_landscape6 !== "") {
        if (data?.matterport_house_landscape?.length === 0) {
          errors.matterport_house_landscape = "Please select house landscape."
        }

      }
      if (data?.checkbox_landscape6 !== "") {
        if (data?.matterport_landscape?.length === 0) {
          errors.matterport_landscape = "Please select landscape."
        }

      }
      if (data?.checkbox_upto_15_6 !== "")
        if (data?.matterport_upto_15?.length === 0) {
          errors.matterport_upto_15 = "Please select upto 15."
        }

      if (data?.checkbox_more_than_15_6 !== "") {
        if (data?.matterport_more_than_15?.length === 0) {
          errors.matterport_more_than_15 = "Please select more than 15."
        }

      }
      if (data?.checkbox_food_Beverage6 !== "") {
        if (data?.matterport_food_Beverage?.length === 0) {
          errors.matterport_food_Beverage = "Please select food beverage."
        }

      }
      if (data?.checkbox_products6 !== "") {
        if (data?.matterport_products?.length === 0) {
          errors.matterport_products = "Please select product."
        }

      }
      if (validator.isEmpty(matterport)) {
        errors.checkbox_house_apt6 = "Please select any one sub category."
      }

    }
  }

  if ((next === "next6") && (stepper !== "stepper1")) {

    if (data?.photo === "1") {
      if (validator.isEmpty(data?.photo_editing)) {
        errors.photo_editing = "Please select any one editing type."
      } else {
        if (data?.photo_editing === "1" && !editingFlag?.editingPhotoStandard) {
          errors.photo_editing = "Please select any one editing type."
        } else if (data?.photo_editing === "2" && !editingFlag?.editingPhotoPremium) {
          errors.photo_editing = "Please select any one editing type."
        }
      }

    }
    if (data?.video === "3") {
      if (validator.isEmpty(data?.video_editing)) {
        errors.video_editing = "Please select any one editing type."
      } else {
        if (data?.video_editing === "1" && !editingFlag?.editingVideoStandard) {
          errors.video_editing = "Please select any one editing type."
        } else if (data?.video_editing === "2" && !editingFlag?.editingVideoPremium) {
          errors.video_editing = "Please select any one editing type."
        }
      }
    }
    if (data?.drone_photo === "5") {
      if (validator.isEmpty(data?.drone_photo_editing)) {
        errors.drone_photo_editing = "Please select any one editing type."
      } else {
        if (data?.drone_photo_editing === "1" && !editingFlag?.editingDronePhotoStandard) {
          errors.drone_photo_editing = "Please select any one editing type."
        } else if (data?.drone_photo_editing === "2" && !editingFlag?.editingDronePhotoPremium) {
          errors.drone_photo_editing = "Please select any one editing type."
        }
      }

    }
    if (data?.drone_video === "2") {
      if (validator.isEmpty(data?.drone_video_editing)) {
        errors.drone_video_editing = "Please select any one editing type."
      } else {
        if (data?.drone_video_editing === "1" && !editingFlag?.editingDroneVideoStandard) {
          errors.drone_video_editing = "Please select any one editing type."
        } else if (data?.drone_video_editing === "2" && !editingFlag?.editingDroneVideoPremium) {
          errors.drone_video_editing = "Please select any one editing type."
        }
      }
    }
    if (data?.standard === "4") {
      if (validator.isEmpty(data?.standard360_editing)) {
        errors.standard360_editing = "Please select any one editing type."
      } else {
        if (data?.standard360_editing === "1" && !editingFlag?.editingStandard) {
          errors.standard360_editing = "Please select any one editing type."
        } else if (data?.standard360_editing === "2" && !editingFlag?.editingPremium) {
          errors.standard360_editing = "Please select any one editing type."
        }
      }

    }
    if (data?.matterport === "6") {
      if (validator.isEmpty(data?.matterport_editing)) {
        errors.matterport_editing = "Please select any one editing type."
      } else {
        if (data?.matterport_editing === "1" && !editingFlag?.editingMatterportStandard) {
          errors.matterport_editing = "Please select any one editing type."
        } else if (data?.matterport_editing === "2" && !editingFlag?.editingMatterportPremium) {
          errors.matterport_editing = "Please select any one editing type."
        }
      }
    }
  }

  return { errors, isValid: Object.keys(errors).length <= 0 };
}

export default validatePlaceAnOrder;