// import "./styles.css";
import { useEffect } from "react";
import GooglePlacesAutocomplete, {
  geocodeByPlaceId
} from "react-google-places-autocomplete";

export default function AutoCompleteMap({ setCity, setState, setZipCode, setCountry, setAddress, address, setLatitude, setLongitude }) {
  const getAddressObject = (address_components) => {
    const ShouldBeComponent = {
      street_number: ["street_number"],
      postal_code: ["postal_code"],
      street: ["street_address", "route"],
      province: [
        "administrative_area_level_1",
        "administrative_area_level_2",
        "administrative_area_level_3",
        "administrative_area_level_4",
        "administrative_area_level_5"
      ],
      city: [
        "locality",
        "sublocality",
        "sublocality_level_1",
        "sublocality_level_2",
        "sublocality_level_3",
        "sublocality_level_4"
      ],
      country: ["country"]
    };

    let address = {
      street_number: "",
      postal_code: "",
      street: "",
      province: "",
      city: "",
      country: ""
    };

    address_components.forEach((component) => {
      for (var shouldBe in ShouldBeComponent) {
        if (ShouldBeComponent[shouldBe].indexOf(component.types[0]) !== -1) {
          if (shouldBe === "country") {
            address[shouldBe] = component.long_name;
          } else {
            address[shouldBe] = component.long_name;
          }
        }
      }
    });

    // Fix the shape to match our schema
    address.address = address.street_number + " " + address.street;
    delete address.street_number;
    delete address.street;
    if (address.country === "US") {
      address.state = address.province;
      delete address.province;
    }
    return address;
  };

  useEffect(() => {
    const func = async () => {
      const geocodeObj =
        address &&
        address.value &&
        (await geocodeByPlaceId(address.value.place_id));
      const addressObject =
        geocodeObj && getAddressObject(geocodeObj[0].address_components);
      setCity(addressObject?.city)
      setState(addressObject?.province)
      setZipCode(addressObject?.postal_code)
      setCountry(addressObject?.country)

      if (geocodeObj && geocodeObj !== undefined) {
        var lat = geocodeObj[0]?.geometry?.location?.lat();
        var lng = geocodeObj[0]?.geometry?.location?.lng();
        setLatitude(lat);
        setLongitude(lng);
      }
    };
    func();
  }, [address]);

  const styles = {
    textInputContainer: {
      backgroundColor: 'rgba(0,0,0,0)',
      borderTopWidth: 0,
      borderBottomWidth: 0,
      zIndex: 999,
      width: '90%',
    },
    textInput: {
      marginLeft: 0,
      marginRight: 0,
      height: 45,
      color: '#5d5d5d',
      fontSize: 16,
      borderWidth: 1,
      zIndex: 999,
    },
    predefinedPlacesDescription: {
      color: '#1faadb'
    },
    listView: {
      top: 45.5,
      zIndex: 10,
      position: 'absolute',
      color: 'black',
      backgroundColor: "white",
      width: '89%',
    },
    separator: {
      flex: 1,
      height: StyleSheet.hairlineWidth,
      backgroundColor: 'blue',
    },
    description: {
      flexDirection: "row",
      flexWrap: "wrap",
      fontSize: 14,
      maxWidth: '89%',
    },
  };

  return (
    <div className="App newPlace">
      <GooglePlacesAutocomplete
        apiKey="AIzaSyBDB_axme62VjOEVf7ITiDYnmbANrN1CbY"
        placeholder='Enter your placeholder text here'
        selectProps={{
          isClearable: true,
          value: address,
          onChange: (val) => {
            setAddress(val);
          },

        }}
        styles={styles}
      />
    </div>
  );
}
