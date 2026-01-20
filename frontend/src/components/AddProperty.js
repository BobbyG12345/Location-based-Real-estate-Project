import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
// MUI
import {
  Grid,
  AppBar,
  Typography,
  Button,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CircularProgress,
  TextField,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  Polygon,
} from "react-leaflet";
import Vancouver from "./Assets/Cities/Vancouver";
import Burnaby from "./Assets/Cities/Burnaby";
import Surrey from "./Assets/Cities/Surrey";
import Richmond from "./Assets/Cities/Richmond";
import Coquitlam from "./Assets/Cities/Coquitlam";
import Delta from "./Assets/Cities/Delta";
import NewWestminster from "./Assets/Cities/NewWestminster";
import Langley from "./Assets/Cities/Langley";
import MapleRidge from "./Assets/Cities/MapleRidge";
import PortCoquitlam from "./Assets/Cities/PortCoquitlam";
import PortMoody from "./Assets/Cities/PortMoody";
import NorthVancouver from "./Assets/Cities/NorthVancouver";
import WestVancouver from "./Assets/Cities/WestVancouver";
import WhiteRock from "./Assets/Cities/WhiteRock";
import PittMeadows from "./Assets/Cities/PittMeadows";
import BowenIsland from "./Assets/Cities/BowenIsland";
import StateContext from "../Contexts/StateContext";

const cityOptions = [
  { value: "", label: "" },
  { value: "Vancouver", label: "Vancouver" },
  { value: "Surrey", label: "Surrey" },
  { value: "Burnaby", label: "Burnaby" },
  { value: "Richmond", label: "Richmond" },
  { value: "Coquitlam", label: "Coquitlam" },
  { value: "Delta", label: "Delta" },
  { value: "New Westminster", label: "New Westminster" },
  { value: "Langley", label: "Langley" },
  { value: "Maple Ridge", label: "Maple Ridge" },
  { value: "Port Coquitlam", label: "Port Coquitlam" },
  { value: "Port Moody", label: "Port Moody" },
  { value: "North Vancouver", label: "North Vancouver" },
  { value: "West Vancouver", label: "West Vancouver" },
  { value: "White Rock", label: "White Rock" },
  { value: "Pitt Meadows", label: "Pitt Meadows" },
  { value: "Bowen Island", label: "Bowen Island" },
  { value: "Anmore", label: "Anmore" },
  { value: "Belcarra", label: "Belcarra" },
  { value: "Lions Bay", label: "Lions Bay" },
  { value: "Tsawwassen First Nation", label: "Tsawwassen First Nation" },
  { value: "Electoral Area A", label: "Electoral Area A" },
];

const listingTypeOptions = [
  {
    value: "",
    label: "",
  },
  {
    value: "Apartment",
    label: "Apartment",
  },
  {
    value: "House",
    label: "House",
  },
  {
    value: "Office",
    label: "Office",
  },
];

const propertyStatusOptions = [
  {
    value: "",
    label: "",
  },
  {
    value: "Sale",
    label: "Sale",
  },
  {
    value: "Rent",
    label: "Rent",
  },
];

const rentalFrequencyOptions = [
  {
    value: "",
    label: "",
  },
  {
    value: "Month",
    label: "Month",
  },
  {
    value: "Week",
    label: "Week",
  },
  {
    value: "Day",
    label: "Day",
  },
];

function AddProperty() {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);

  const initialState = {
    titleValue: "",
    listingTypeValue: "",
    listingTypeErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    descriptionValue: "",
    cityValue: "",
    cityErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    latitudeValue: "",
    longitudeValue: "",
    propertyStatusValue: "",
    propertyStatusErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    priceValue: "",
    priceErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    rentalFrequencyValue: "",
    roomsValue: "",
    furnishedValue: false,
    poolValue: false,
    elevatorValue: false,
    cctvValue: false,
    parkingValue: false,
    picture1Value: "",
    picture2Value: "",
    picture3Value: "",
    picture4Value: "",
    picture5Value: "",
    mapInstance: "",
    markerPosition: {
      lat: 49.280167943105006,
      lng: -123.1213688357416,
    },
    uploadedPictures: [],
    sendRequest: false,
    userProfile: {
      agencyName: "",
      phoneNumber: "",
    },
    openSnack: false,
    disabledBtn: false,
    titleErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    listingTypeErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    propertyStatusErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    priceErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    cityErrors: {
      hasErrors: false,
      errorMessage: "",
    },
  };
  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "catchTitleChange":
        draft.titleValue = action.value;
        draft.titleErrors.hasErrors = false;
        draft.titleErrors.errorMessage = "";
        break;
      case "catchListingTypeChange":
        draft.listingTypeValue = action.value;
        draft.listingTypeErrors.hasErrors = false;
        draft.listingTypeErrors.errorMessage = "";
        break;
      case "catchDescriptionChange":
        draft.descriptionValue = action.value;
        break;

      case "catchCityChange":
        draft.cityValue = action.value;
        draft.cityErrors.hasErrors = false;
        draft.cityErrors.errorMessage = "";
        break;

      case "catchLatitudeChange":
        draft.latitudeValue = action.latitudeChosen;
        break;

      case "catchLongitudeChange":
        draft.longitudeValue = action.longitudeChosen;
        break;

      case "catchPropertyStatusChange":
        draft.propertyStatusValue = action.value;
        draft.propertyStatusErrors.hasErrors = false;
        draft.propertyStatusErrors.errorMessage = "";
        break;

      case "catchPriceChange":
        draft.priceValue = action.value;
        draft.priceErrors.hasErrors = false;
        draft.priceErrors.errorMessage = "";
        break;

      case "catchRentalFrequencyChange":
        draft.rentalFrequencyValue = action.value;
        break;

      case "catchRoomsChange":
        draft.roomsValue = action.value;
        break;

      case "catchFurnishedChange":
        draft.furnishedValue = action.value;
        break;

      case "catchPoolChange":
        draft.poolValue = action.value;
        break;

      case "catchElevatorChange":
        draft.elevatorValue = action.value;
        break;

      case "catchCctvChange":
        draft.cctvValue = action.value;
        break;

      case "catchParkingChange":
        draft.parkingValue = action.value;
        break;

      case "catchPicture1Change":
        draft.picture1Value = action.picture1Chosen;
        break;

      case "catchPicture2Change":
        draft.picture2Value = action.picture2Chosen;
        break;

      case "catchPicture3Change":
        draft.picture3Value = action.picture3Chosen;
        break;

      case "catchPicture4Change":
        draft.picture4Value = action.picture4Chosen;
        break;

      case "catchPicture5Change":
        draft.picture5Value = action.picture5Chosen;
        break;

      case "getMap":
        draft.mapInstance = action.mapData;
        break;

      case "changeMarkerPosition":
        draft.markerPosition.lat = action.changeLatitude;
        draft.markerPosition.lng = action.changeLongitude;
        draft.latitudeValue = "";
        draft.longitudeValue = "";
        break;

      case "catchUploadedPictures":
        draft.uploadedPictures = action.picturesChosen;
        break;

      case "changeSendRequest":
        draft.sendRequest = draft.sendRequest + 1;
        break;

      case "catchUserProfileInfo":
        draft.userProfile.agencyName = action.profileInfo.agency_name;
        draft.userProfile.phoneNumber = action.profileInfo.phone_number;
        break;

      case "openTheSnack":
        draft.openSnack = true;
        break;

      case "disableTheButton":
        draft.disabledBtn = true;
        break;

      case "allowTheButton":
        draft.disabledBtn = false;
        break;

      case "catchTitleErrors":
        if (action.value.length === 0) {
          draft.titleErrors.hasErrors = true;
          draft.titleErrors.errorMessage = "This field must not be empty";
        }
        break;

      case "catchListingTypeErrors":
        if (action.value.length === 0) {
          draft.listingTypeErrors.hasErrors = true;
          draft.listingTypeErrors.errorMessage = "This field must not be empty";
        }
        break;

      case "catchPropertyStatusErrors":
        if (action.value.length === 0) {
          draft.propertyStatusErrors.hasErrors = true;
          draft.propertyStatusErrors.errorMessage =
            "This field must not be empty";
        }
        break;

      case "catchPriceErrors":
        if (action.value.length === 0) {
          draft.priceErrors.hasErrors = true;
          draft.priceErrors.errorMessage = "This field must not be empty";
        }
        break;

      case "catchCityErrors":
        if (action.value.length === 0) {
          draft.cityErrors.hasErrors = true;
          draft.cityErrors.errorMessage = "This field must not be empty";
        }
        break;

      case "emptyTitle":
        draft.titleErrors.hasErrors = true;
        draft.titleErrors.errorMessage = "This field must not be empty";
        break;

      case "emptyListingType":
        draft.listingTypeErrors.hasErrors = true;
        draft.listingTypeErrors.errorMessage = "This field must not be empty";
        break;

      case "emptyPropertyStatus":
        draft.propertyStatusErrors.hasErrors = true;
        draft.propertyStatusErrors.errorMessage =
          "This field must not be empty";
        break;

      case "emptyPrice":
        draft.priceErrors.hasErrors = true;
        draft.priceErrors.errorMessage = "This field must not be empty";
        break;

      case "emptyCity":
        draft.cityErrors.hasErrors = true;
        draft.cityErrors.errorMessage = "This field must not be empty";
        break;

      case "getMap":
        draft.mapInstance = action.mapData;
        break;

      case "changeMarkerPosition":
        draft.markerPosition.lat = action.changeLatitude;
        draft.markerPosition.lng = action.changeLongitude;
        draft.latitudeValue = "";
        draft.longitudeValue = "";
        break;

      case "openTheSnack":
        draft.openSnack = true;
        break;

      case "disableTheButton":
        draft.disabledBtn = true;
        break;

      case "allowTheButton":
        draft.disabledBtn = false;
        break;
    }
  }

  function TheMapComponent() {
    const map = useMap();
    useEffect(() => {
      dispatch({ type: "getMap", mapData: map });
    }, [map]);
    return null;
  }

  useEffect(() => {
    if (state.cityValue === "Vancouver") {
      state.mapInstance.flyTo([49.2827, -123.1207], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 49.2827,
        changeLongitude: -123.1207,
      });
    } else if (state.cityValue === "Surrey") {
      state.mapInstance.flyTo([49.1913, -122.84889], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 49.1913,
        changeLongitude: -122.84889,
      });
    } else if (state.cityValue === "Burnaby") {
      state.mapInstance.flyTo([49.2488, -122.9805], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 49.2488,
        changeLongitude: -122.9805,
      });
    } else if (state.cityValue === "Richmond") {
      state.mapInstance.flyTo([49.1666, -123.1336], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 49.1666,
        changeLongitude: -123.1336,
      });
    } else if (state.cityValue === "Coquitlam") {
      state.mapInstance.flyTo([49.283, -122.7932], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 49.283,
        changeLongitude: -122.7932,
      });
    } else if (state.cityValue === "Delta") {
      state.mapInstance.flyTo([49.0957, -123.026], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 49.0957,
        changeLongitude: -123.026,
      });
    } else if (state.cityValue === "New Westminster") {
      state.mapInstance.flyTo([49.2057, -122.9141], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 49.2057,
        changeLongitude: -122.9141,
      });
    } else if (state.cityValue === "Langley") {
      state.mapInstance.flyTo([49.1044, -122.6606], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 49.1044,
        changeLongitude: -122.6606,
      });
    } else if (state.cityValue === "Maple Ridge") {
      state.mapInstance.flyTo([49.2194, -122.6011], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 49.2194,
        changeLongitude: -122.6011,
      });
    } else if (state.cityValue === "Port Coquitlam") {
      state.mapInstance.flyTo([49.2625, -122.782], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 49.2625,
        changeLongitude: -122.782,
      });
    } else if (state.cityValue === "Port Moody") {
      state.mapInstance.flyTo([49.282, -122.849], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 49.282,
        changeLongitude: -122.849,
      });
    } else if (state.cityValue === "North Vancouver") {
      state.mapInstance.flyTo([49.3193, -123.07], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 49.3193,
        changeLongitude: -123.07,
      });
    } else if (state.cityValue === "West Vancouver") {
      state.mapInstance.flyTo([49.3294, -123.155], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 49.3294,
        changeLongitude: -123.155,
      });
    } else if (state.cityValue === "White Rock") {
      state.mapInstance.flyTo([49.0251, -122.8057], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 49.0251,
        changeLongitude: -122.8057,
      });
    } else if (state.cityValue === "Pitt Meadows") {
      state.mapInstance.flyTo([49.2199, -122.6797], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 49.2199,
        changeLongitude: -122.6797,
      });
    } else if (state.cityValue === "Bowen Island") {
      state.mapInstance.flyTo([49.3975, -123.3137], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 49.3975,
        changeLongitude: -123.3137,
      });
    } else if (state.cityValue === "Anmore") {
      state.mapInstance.flyTo([49.31, -122.895], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 49.31,
        changeLongitude: -122.895,
      });
    } else if (state.cityValue === "Belcarra") {
      state.mapInstance.flyTo([49.348, -122.905], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 49.348,
        changeLongitude: -122.905,
      });
    } else if (state.cityValue === "Lions Bay") {
      state.mapInstance.flyTo([49.4, -123.155], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 49.4,
        changeLongitude: -123.155,
      });
    } else if (state.cityValue === "Tsawwassen First Nation") {
      state.mapInstance.flyTo([49.057, -123.107], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 49.057,
        changeLongitude: -123.107,
      });
    } else if (state.cityValue === "Electoral Area A") {
      state.mapInstance.flyTo([49.44, -123.0], 12);
      dispatch({
        type: "changeMarkerPosition",
        changeLatitude: 49.44,
        changeLongitude: -123.0,
      });
    }
  }, [state.cityValue]);

  useEffect(() => {
    if (state.sendRequest) {
      async function AddProperty() {
        const formData = new FormData();
        formData.append("title", state.titleValue);
        formData.append("description", state.descriptionValue);
        formData.append("city", state.cityValue);
        formData.append("address", state.addressValue);
        formData.append("listing_type", state.listingTypeValue);
        formData.append("property_status", state.propertyStatusValue);
        formData.append("rental_frequency", state.rentalFrequencyValue);
        formData.append("rooms", state.roomsValue);
        formData.append("price", state.priceValue);
        formData.append("furnished", state.furnishedValue);
        formData.append("pool", state.poolValue);
        formData.append("cctv", state.cctvValue);
        formData.append("parking", state.parkingValue);
        formData.append("latitude", state.latitudeValue);
        formData.append("longitude", state.longitudeValue);
        formData.append("picture1", state.picture1Value);
        formData.append("picture2", state.picture2Value);
        formData.append("picture3", state.picture3Value);
        formData.append("picture4", state.picture3Value);
        formData.append("picture5", state.picture3Value);
        formData.append("seller", GlobalState.userId);
        try {
          const response = await Axios.post(
            "http://localhost:8000/api/listings/create/",
            formData
          );
          console.log(response.data);
          dispatch({ type: "openTheSnack" });
        } catch (error) {
          console.log(error.response);
          dispatch({ type: "allowTheButton" });
        }
      }
      AddProperty();
    }
  }, [state.sendRequest]);

  function CityDisplay() {
    if (state.cityValue === "Vancouver") {
      return <Polygon positions={Vancouver}></Polygon>;
    } else if (state.cityValue === "Burnaby") {
      return <Polygon positions={Burnaby}></Polygon>;
    } else if (state.cityValue === "Surrey") {
      return <Polygon positions={Surrey}></Polygon>;
    } else if (state.cityValue === "Richmond") {
      return <Polygon positions={Richmond}></Polygon>;
    } else if (state.cityValue === "Coquitlam") {
      return <Polygon positions={Coquitlam}></Polygon>;
    } else if (state.cityValue === "Delta") {
      return <Polygon positions={Delta}></Polygon>;
    } else if (state.cityValue === "New Westminster") {
      return <Polygon positions={NewWestminster}></Polygon>;
    } else if (state.cityValue === "Langley") {
      return <Polygon positions={Langley}></Polygon>;
    } else if (state.cityValue === "Maple Ridge") {
      return <Polygon positions={MapleRidge}></Polygon>;
    } else if (state.cityValue === "Port Coquitlam") {
      return <Polygon positions={PortCoquitlam}></Polygon>;
    } else if (state.cityValue === "Port Moody") {
      return <Polygon positions={PortMoody}></Polygon>;
    } else if (state.cityValue === "North Vancouver") {
      return <Polygon positions={NorthVancouver}></Polygon>;
    } else if (state.cityValue === "West Vancouver") {
      return <Polygon positions={WestVancouver}></Polygon>;
    } else if (state.cityValue === "White Rock") {
      return <Polygon positions={WhiteRock}></Polygon>;
    } else if (state.cityValue === "Pitt Meadows") {
      return <Polygon positions={PittMeadows}></Polygon>;
    } else if (state.cityValue === "Bowen Island") {
      return <Polygon positions={BowenIsland}></Polygon>;
    }
  }

  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        dispatch({
          type: "catchLatitudeChange",
          latitudeChosen: marker.getLatLng().lat,
        });
        dispatch({
          type: "catchLongitudeChange",
          longitudeChosen: marker.getLatLng().lng,
        });
      },
    }),
    []
  );

  useEffect(() => {
    if (state.uploadedPictures[0]) {
      dispatch({
        type: "catchPicture1Change",
        picture1Chosen: state.uploadedPictures[0],
      });
    }
  }, [state.uploadedPictures[0]]);

  useEffect(() => {
    if (state.uploadedPictures[1]) {
      dispatch({
        type: "catchPicture2Change",
        picture2Chosen: state.uploadedPictures[1],
      });
    }
  }, [state.uploadedPictures[1]]);

  useEffect(() => {
    if (state.uploadedPictures[2]) {
      dispatch({
        type: "catchPicture3Change",
        picture3Chosen: state.uploadedPictures[2],
      });
    }
  }, [state.uploadedPictures[2]]);

  useEffect(() => {
    if (state.uploadedPictures[3]) {
      dispatch({
        type: "catchPicture4Change",
        picture4Chosen: state.uploadedPictures[3],
      });
    }
  }, [state.uploadedPictures[3]]);

  useEffect(() => {
    if (state.uploadedPictures[4]) {
      dispatch({
        type: "catchPicture5Change",
        picture5Chosen: state.uploadedPictures[4],
      });
    }
  }, [state.uploadedPictures[4]]);

  useEffect(() => {
    async function GetProfileInfo() {
      try {
        const response = await Axios.get(
          `http://localhost:8000/api/profiles/${GlobalState.userId}/`
        );
        dispatch({ type: "catchUserProfileInfo", profileInfo: response.data });
      } catch (error) {
        console.log(error.response);
      }
    }
    GetProfileInfo();
  }, []);

  function FormSubmit(e) {
    e.preventDefault();
    console.log("the form has been submitted");
    if (
      !state.titleErrors.hasErrors &&
      !state.listingTypeErrors.hasErrors &&
      !state.propertyStatusErrors.hasErrors &&
      !state.priceErrors.hasErrors &&
      !state.cityErrors.hasErrors &&
      state.latitudeValue &&
      state.longitudeValue
    ) {
      dispatch({ type: "changeSendRequest" });
      dispatch({ type: "disableTheButton" });
    } else if (state.titleValue === "") {
      dispatch({ type: "emptyTitle" });
      window.scrollTo(0, 0);
    } else if (state.listingTypeValue === "") {
      dispatch({ type: "emptyListingType" });
      window.scrollTo(0, 0);
    } else if (state.propertyStatusValue === "") {
      dispatch({ type: "emptyPropertyStatus" });
      window.scrollTo(0, 0);
    } else if (state.priceValue === "") {
      dispatch({ type: "emptyPrice" });
      window.scrollTo(0, 0);
    } else if (state.cityValue === "") {
      dispatch({ type: "emptyCity" });
      window.scrollTo(0, 0);
    }
  }

  function PriceDisplay() {
    if (
      state.propertyStatusValue === "Rent" &&
      state.rentalFrequencyValue === "Day"
    ) {
      return "Price per Day*";
    } else if (
      state.propertyStatusValue === "Rent" &&
      state.rentalFrequencyValue === "Week"
    ) {
      return "Price per Week*";
    } else if (
      state.propertyStatusValue === "Rent" &&
      state.rentalFrequencyValue === "Month"
    ) {
      return "Price per Month*";
    } else {
      return "Price*";
    }
  }

  function SubmitButtonDisplay() {
    console.log("is logged in", GlobalState.userIsLogged);
    console.log("has profile info", state.userProfile);
    const isLoggedIn = GlobalState.userIsLogged;
    const profile = state.userProfile || {}; // 防止 undefined 出错
    const hasProfileInfo =
      profile.agencyName?.trim() && profile.phoneNumber?.trim();
    if (isLoggedIn && hasProfileInfo) {
      return (
        <Button
          variant="contained"
          fullWidth
          type="submit"
          style={{
            backgroundColor: "green",
            color: "white",
            fontSize: "1.1rem",
            marginLeft: "1rem",
            top: "10px",
            // "&:focus": {
            // 	backgroundColor: "blue",
            // },
            // "&:hover": {
            // 	backgroundColor: "blue",
            // },
          }}
          disabled={state.disabledBtn}
        >
          SUBMIT
        </Button>
      );
    } else if (isLoggedIn && !hasProfileInfo) {
      return (
        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate("/profile")}
          style={{
            backgroundColor: "green",
            color: "white",
            fontSize: "1.1rem",
            marginLeft: "1rem",
            top: "10px",
            // "&:focus": {
            // 	backgroundColor: "blue",
            // },
            // "&:hover": {
            // 	backgroundColor: "blue",
            // },
          }}
          disabled={state.disabledBtn}
        >
          COMPLETE YOUR PROFILE TO ADD A PROPERTY
        </Button>
      );
    } else if (!isLoggedIn) {
      return (
        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate("/login")}
          style={{
            backgroundColor: "green",
            color: "white",
            fontSize: "1.1rem",
            marginLeft: "1rem",
            top: "10px",
            // "&:focus": {
            // 	backgroundColor: "blue",
            // },
            // "&:hover": {
            // 	backgroundColor: "blue",
            // },
          }}
          disabled={state.disabledBtn}
        >
          LOGIN TO ADD A PROPERTY
        </Button>
      );
    }
  }

  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate("/listings");
      }, 1500);
    }
  });

  return (
    <div
      style={{
        width: "75%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: "90px",
        marginBottom: "90px",
        border: "5px solid black",
        padding: "3rem",
      }}
    >
      <form onSubmit={FormSubmit}>
        <Grid item container justifyContent="center">
          <Typography variant="h4">SUBMIT A PROPERTY</Typography>
        </Grid>

        <Grid item container style={{ marginTop: "1rem" }}>
          <TextField
            id="title"
            label="Title*"
            variant="standard"
            fullWidth
            value={state.titleValue}
            onChange={(e) => {
              dispatch({ type: "catchTitleChange", value: e.target.value });
            }}
            onBlur={(e) => {
              dispatch({ type: "catchTitleErrors", value: e.target.value });
            }}
            error={state.titleErrors.hasErrors ? true : false}
            helperText={state.titleErrors.errorMessage}
          />
        </Grid>

        <Grid item container justifyContent={"space-between"}>
          <Grid item xs={5} style={{ marginTop: "1rem" }}>
            <TextField
              id="listingType"
              label="Listing Type*"
              variant="standard"
              fullWidth
              value={state.listingTypeValue}
              onChange={(e) =>
                dispatch({
                  type: "catchListingTypeChange",
                  value: e.target.value,
                })
              }
              onBlur={(e) => {
                dispatch({
                  type: "catchListingTypeErrors",
                  value: e.target.value,
                });
              }}
              error={state.listingTypeErrors.hasErrors ? true : false}
              helperText={state.listingTypeErrors.errorMessage}
              select
              SelectProps={{
                native: true,
              }}
            >
              {listingTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={5} style={{ marginTop: "1rem" }}>
            <TextField
              id="propertyStatus"
              label="Property Status*"
              variant="standard"
              fullWidth
              value={state.propertyStatusValue}
              onChange={(e) => {
                dispatch({
                  type: "catchPropertyStatusChange",
                  value: e.target.value,
                });
              }}
              onBlur={(e) => {
                dispatch({
                  type: "catchPropertyStatusErrors",
                  value: e.target.value,
                });
              }}
              error={state.propertyStatusErrors.hasErrors ? true : false}
              helperText={state.propertyStatusErrors.errorMessage}
              select
              SelectProps={{
                native: true,
              }}
            >
              {propertyStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Grid item container justifyContent={"space-between"}>
          <Grid item xs={5} style={{ marginTop: "1rem" }}>
            <TextField
              id="rentalFrequency"
              label="Rental Frequency"
              variant="standard"
              fullWidth
              disabled={state.propertyStatusValue !== "Rent"}
              value={state.rentalFrequencyValue}
              onChange={(e) =>
                dispatch({
                  type: "catchRentalFrequencyChange",
                  value: e.target.value,
                })
              }
              select
              SelectProps={{
                native: true,
              }}
            >
              {rentalFrequencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={5} style={{ marginTop: "1rem" }}>
            <TextField
              id="prrice"
              type="number"
              label={PriceDisplay()}
              variant="standard"
              fullWidth
              value={state.priceValue}
              onChange={(e) => {
                dispatch({
                  type: "catchPriceChange",
                  value: e.target.value,
                });
              }}
              onBlur={(e) => {
                dispatch({
                  type: "catchPriceErrors",
                  value: e.target.value,
                });
              }}
              error={state.priceErrors.hasErrors ? true : false}
              helperText={state.priceErrors.errorMessage}
            />
          </Grid>
        </Grid>

        <Grid item container style={{ marginTop: "1rem" }}>
          <TextField
            id="description"
            label="Description"
            variant="outlined"
            multiline
            rows={6}
            fullWidth
            value={state.descriptionValue}
            onChange={(e) => {
              dispatch({
                type: "catchDescriptionChange",
                value: e.target.value,
              });
            }}
          />
        </Grid>

        {state.listingTypeValue === "Office" ? (
          ""
        ) : (
          <Grid item xs={3} container style={{ marginTop: "1rem" }}>
            <TextField
              id="rooms"
              type="number"
              label="Rooms"
              variant="standard"
              fullWidth
              value={state.roomsValue}
              onChange={(e) => {
                dispatch({
                  type: "catchRoomsChange",
                  value: e.target.value,
                });
              }}
            />
          </Grid>
        )}

        <Grid item container justifyContent={"space-between"}>
          <Grid item xs={2} style={{ marginTop: "1rem" }}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    dispatch({
                      type: "catchFurnishedChange",
                      value: e.target.checked,
                    });
                  }}
                />
              }
              label="Furnished"
            />
          </Grid>

          <Grid item xs={2} style={{ marginTop: "1rem" }}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    dispatch({
                      type: "catchPoolChange",
                      value: e.target.checked,
                    });
                  }}
                />
              }
              label="Pool"
            />
          </Grid>

          <Grid item xs={2} style={{ marginTop: "1rem" }}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    dispatch({
                      type: "catchElevatorChange",
                      value: e.target.checked,
                    });
                  }}
                />
              }
              label="Elevator"
            />
          </Grid>

          <Grid item xs={2} style={{ marginTop: "1rem" }}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    dispatch({
                      type: "catchCctvChange",
                      value: e.target.checked,
                    });
                  }}
                />
              }
              label="Cctv"
            />
          </Grid>

          <Grid item xs={2} style={{ marginTop: "1rem" }}>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={(e) => {
                    dispatch({
                      type: "catchParkingChange",
                      value: e.target.checked,
                    });
                  }}
                />
              }
              label="Parking"
            />
          </Grid>

          <Grid item xs={3} container style={{ marginTop: "1rem" }}>
            <TextField
              id="city"
              label="City*"
              variant="standard"
              fullWidth
              value={state.cityValue}
              onChange={(e) => {
                dispatch({
                  type: "catchCityChange",
                  value: e.target.value,
                });
              }}
              onBlur={(e) => {
                dispatch({
                  type: "catchCityErrors",
                  value: e.target.value,
                });
              }}
              error={state.cityErrors.hasErrors ? true : false}
              helperText={state.cityErrors.errorMessage}
              select
              SelectProps={{
                native: true,
              }}
            >
              {cityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Grid item style={{ marginTop: "1rem" }}>
          {state.latitudeValue && state.longitudeValue ? (
            <Alert severity="success">
              Your property is located at {state.latitudeValue},{" "}
              {state.longitudeValue}
            </Alert>
          ) : (
            <Alert severity="warning">
              Locate your property on the map before submitting this form
            </Alert>
          )}
        </Grid>

        <Grid item container style={{ height: "35rem", marginTop: "1rem" }}>
          <MapContainer
            center={[49.280167943105006, -123.1213688357416]}
            zoom={12}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <TheMapComponent />
            {CityDisplay()}
            <Marker
              draggable
              eventHandlers={eventHandlers}
              position={state.markerPosition}
              ref={markerRef}
            ></Marker>
          </MapContainer>
        </Grid>

        <Grid
          item
          container
          xs={6}
          style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}
        >
          <Button
            variant="contained"
            component="label"
            fullWidth
            style={{
              backgroundColor: "green",
              color: "white",
              fontSize: "1.1rem",
              marginLeft: "1rem",
              top: "10px",
            }}
          >
            UPLOAD PICTURES (MAX5)
            <input
              type="file"
              multiple
              accept="image/png, image/gif, image/jpeg, image/jpg"
              hidden
              onChange={(e) =>
                dispatch({
                  type: "catchUploadedPictures",
                  picturesChosen: e.target.files,
                })
              }
            />
          </Button>
        </Grid>

        <Grid item container>
          <ul>
            {state.picture1Value ? <li>{state.picture1Value.name}</li> : ""}
            {state.picture2Value ? <li>{state.picture2Value.name}</li> : ""}
            {state.picture3Value ? <li>{state.picture3Value.name}</li> : ""}
            {state.picture4Value ? <li>{state.picture4Value.name}</li> : ""}
            {state.picture5Value ? <li>{state.picture5Value.name}</li> : ""}
          </ul>
        </Grid>

        <Grid
          item
          container
          xs={8}
          style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}
        >
          {SubmitButtonDisplay()}
        </Grid>
      </form>
      <Button
        onClick={() =>
          console.log(state.uploadedPictures, state.picture1Value.name)
        }
      >
        Test Button
      </Button>
      <Snackbar
        open={state.openSnack}
        message="You have successfully added a property"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      />
    </div>
  );
}

export default AddProperty;
