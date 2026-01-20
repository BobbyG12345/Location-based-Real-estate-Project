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
import StateContext from "../Contexts/StateContext";

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

function ListingUpdate(props) {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);

  const initialState = {
    titleValue: props.listingData.title,
    listingTypeValue: props.listingData.listing_type,
    listingTypeErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    descriptionValue: props.listingData.description,

    propertyStatusValue: props.listingData.property_status,
    propertyStatusErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    priceValue: props.listingData.price,
    priceErrors: {
      hasErrors: false,
      errorMessage: "",
    },
    rentalFrequencyValue: props.listingData.rental_frequency,
    roomsValue: props.listingData.rooms,
    furnishedValue: props.listingData.furnished,
    poolValue: props.listingData.pool,
    elevatorValue: props.listingData.elevator,
    cctvValue: props.listingData.cctv,
    parkingValue: props.listingData.parking,
    openSnack: false,
    disabledBtn: false,

    sendRequest: 0,
  };

  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "catchTitleChange":
        draft.titleValue = action.value;

        break;
      case "catchListingTypeChange":
        draft.listingTypeValue = action.value;
        draft.listingTypeErrors.hasErrors = false;
        draft.listingTypeErrors.errorMessage = "";
        break;
      case "catchDescriptionChange":
        draft.descriptionValue = action.value;
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

      case "changeSendRequest":
        draft.sendRequest = draft.sendRequest + 1;
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
        if (action.titleChosen.length === 0) {
          draft.titleErrors.hasErrors = true;
          draft.titleErrors.errorMessage = "This field must not be empty";
        }
        break;

      case "catchListingTypeErrors":
        if (action.listingTypeChosen.length === 0) {
          draft.listingTypeErrors.hasErrors = true;
          draft.listingTypeErrors.errorMessage = "This field must not be empty";
        }
        break;

      case "catchPropertyStatusErrors":
        if (action.propertyStatusChosen.length === 0) {
          draft.propertyStatusErrors.hasErrors = true;
          draft.propertyStatusErrors.errorMessage =
            "This field must not be empty";
        }
        break;

      case "catchPriceErrors":
        if (action.priceChosen.length === 0) {
          draft.priceErrors.hasErrors = true;
          draft.priceErrors.errorMessage = "This field must not be empty";
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
    }
  }

  useEffect(() => {
    if (state.sendRequest) {
      async function UpdateProperty() {
        const formData = new FormData();
        if (state.listingTypeValue === "Office") {
          formData.append("title", state.titleValue);
          formData.append("description", state.descriptionValue);
          formData.append("listing_type", state.listingTypeValue);
          formData.append("property_status", state.propertyStatusValue);
          if (
            state.propertyStatusValue === "Rent" &&
            state.rentalFrequencyValue
          ) {
            formData.append("rental_frequency", state.rentalFrequencyValue);
          }
          formData.append("rooms", 0);
          formData.append("price", state.priceValue);
          formData.append("furnished", state.furnishedValue ? "true" : "false");
          formData.append("pool", state.poolValue ? "true" : "false");
          formData.append("elevator", state.elevatorValue ? "true" : "false");
          formData.append("cctv", state.cctvValue ? "true" : "false");
          formData.append("parking", state.parkingValue ? "true" : "false");
          formData.append("seller", GlobalState.userId);
        } else {
          formData.append("title", state.titleValue);
          formData.append("description", state.descriptionValue);
          formData.append("listing_type", state.listingTypeValue);
          formData.append("property_status", state.propertyStatusValue);
          if (
            state.propertyStatusValue === "Rent" &&
            state.rentalFrequencyValue
          ) {
            formData.append("rental_frequency", state.rentalFrequencyValue);
          }
          formData.append("rooms", state.roomsValue);
          formData.append("price", state.priceValue);
          formData.append("furnished", state.furnishedValue ? "true" : "false");
          formData.append("pool", state.poolValue ? "true" : "false");
          formData.append("elevator", state.elevatorValue ? "true" : "false");
          formData.append("cctv", state.cctvValue ? "true" : "false");
          formData.append("parking", state.parkingValue ? "true" : "false");
          formData.append("seller", GlobalState.userId);
        }
        try {
          const response = await Axios.patch(
            `http://localhost:8000/api/listings/${props.listingData.id}/update/`,
            formData
          );
          console.log(response.data);
          dispatch({ type: "openTheSnack" });
        } catch (error) {
          console.log(error.response.data);
          dispatch({ type: "allowTheButton" });
        }
      }
      UpdateProperty();
    }
  }, [state.sendRequest]);

  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate(0);
      }, 1500);
    }
  }, [state.openSnack]);

  function FormSubmit(e) {
    e.preventDefault();
    dispatch({ type: "changeSendRequest" });
    dispatch({ type: "disableTheButton" });
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
          <Typography variant="h4">UPDATE LISTING</Typography>
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
              value={state.rentalFrequencyValue ?? ""}
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
                  checked={state.furnishedValue}
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
                  checked={state.poolValue}
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
                  checked={state.elevatorValue}
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
                  checked={state.cctvValue}
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
                  checked={state.parkingValue}
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
        </Grid>

        <Grid
          item
          container
          xs={8}
          style={{ marginTop: "1rem", marginLeft: "auto", marginRight: "auto" }}
        >
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
            UPDATE
          </Button>
        </Grid>
      </form>
      <Button variant="contained" onClick={props.closeDialog}>
        CANCEL
      </Button>
      <Snackbar
        open={state.openSnack}
        message="You have successfully updated this listing"
        autoHideDuration={4000}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      />
    </div>
  );
}

export default ListingUpdate;
