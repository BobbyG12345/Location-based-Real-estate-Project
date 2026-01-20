import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import StateContext from "../Contexts/StateContext";
import ProfileUpdate from "./ProfileUpdate";
import {
  Typography,
  Grid,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import defaultProfilePicture from "./Assets/defaultProfilePicture.jpg";

function Profile() {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);

  const initialState = {
    userProfile: {
      agencyName: "",
      phoneNumber: "",
      profilePic: "",
      bio: "",
      sellerId: "",
      sellerListings: [],
    },
    dataIsLoading: true,
  };

  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "catchUserProfileInfo":
        draft.userProfile.agencyName = action.profileInfo.agency_name;
        draft.userProfile.phoneNumber = action.profileInfo.phone_number;
        draft.userProfile.profilePic = action.profileInfo.profile_picture;
        draft.userProfile.bio = action.profileInfo.bio;
        draft.userProfile.sellerListings = action.profileInfo.seller_listings;
        draft.userProfile.sellerId = action.profileInfo.seller;
        break;

      case "loadingDone":
        draft.dataIsLoading = false;
        break;
    }
  }
  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  useEffect(() => {
    async function GetProfileInfo() {
      try {
        const response = await Axios.get(
          `http://localhost:8000/api/profiles/${GlobalState.userId}/`
        );
        dispatch({ type: "catchUserProfileInfo", profileInfo: response.data });
        dispatch({ type: "loadingDone" });
        // console.log("response", response);
      } catch (error) {
        console.log(error.response);
      }
    }
    GetProfileInfo();
  }, []);

  function PropertiesDisplay() {
    if (state.userProfile.sellerListings.length === 0) {
      return (
        <Button variant="contained" size="small" disabled>
          No Property
        </Button>
      );
    } else if (state.userProfile.sellerListings.length === 1) {
      return (
        <Button
          variant="contained"
          size="small"
          onClick={() => navigate(`/agencies/${state.userProfile.sellerId}`)}
        >
          One Property Listed
        </Button>
      );
    } else {
      <Button
        size="small"
        onClick={() => navigate(`/agencies/${state.userProfile.sellerId}`)}
      >
        {state.userProfile.sellerListings.length} Properties
      </Button>;
    }
  }

  function WelcomeDisplay() {
    if (
      state.userProfile.agencyName === null ||
      state.userProfile.agencyName === "" ||
      state.userProfile.phoneNumber === null ||
      state.userProfile.phoneNumber === "" ||
      state.userProfile.phoneNumber === null
    ) {
      return (
        <Typography
          variant="h5"
          style={{ textAlign: "center", marginTop: "1rem" }}
        >
          Welcome{" "}
          <span style={{ fontWeight: "bolder", color: "green" }}>
            {GlobalState.userUsername}
          </span>
          , please submit this form below to update your profile.
        </Typography>
      );
    } else {
      return (
        <Grid
          container
          style={{
            width: "50%",
            marginLeft: "auto",
            marginRight: "auto",
            border: "5px solid black",
            marginTop: "1rem",
            padding: "5px",
          }}
        >
          <Grid item xs={6}>
            <img
              style={{ height: "10rem", width: "15rem" }}
              src={
                state.userProfile.profilePic !== null
                  ? state.userProfile.profilePic
                  : defaultProfilePicture
              }
            />
          </Grid>
          <Grid container direction="column" justifyContent={"center"} xs={6}>
            <Grid item>
              <Typography
                variant="h5"
                style={{ textAlign: "center", marginTop: "1rem" }}
              >
                Welcome{" "}
                <span style={{ fontWeight: "bolder", color: "green" }}>
                  {GlobalState.userUsername}
                </span>
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                variant="h5"
                style={{ textAlign: "center", marginTop: "1rem" }}
              >
                You have {PropertiesDisplay()}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      );
    }
  }

  if (state.dataIsLoading) {
    return (
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        style={{ height: "100vh" }}
      >
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <div style={{ marginTop: "5rem" }}>
      <div>{WelcomeDisplay()}</div>
      <ProfileUpdate userProfile={state.userProfile} />
    </div>
  );
}

export default Profile;
