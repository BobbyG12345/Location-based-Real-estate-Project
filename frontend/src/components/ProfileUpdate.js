import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import { useImmerReducer } from "use-immer";
import StateContext from "../Contexts/StateContext";
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

function ProfileUpdate(props) {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);
  console.log(props.userProfile);

  const initialState = {
    agencyNameValue: props.userProfile.agencyName,
    phoneNumberValue: props.userProfile.phoneNumber,
    bioValue: props.userProfile.bio,
    uploadedPicture: [],
    profilePictureValue: props.userProfile.profilePic,
    sendRequest: 0,
    openSnack: false,
    disabledBtn: false,
  };

  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "catchAgencyNameChange":
        draft.agencyNameValue = action.agencyNameChosen;
        console.log("draft.agencyNameValue", draft.agencyNameValue);
        break;

      case "catchPhoneNumberChange":
        draft.phoneNumberValue = action.phoneNumberChosen;
        break;

      case "catchBioChange":
        draft.bioValue = action.bioChosen;
        break;

      case "catchUploadedPicture":
        draft.uploadedPicture = action.pictureChosen;
        break;

      case "catchProfilePictureChange":
        draft.profilePictureValue = action.profilePictureChosen;
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
    }
  }
  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  useEffect(() => {
    if (state.uploadedPicture[0]) {
      dispatch({
        type: "catchProfilePictureChange",
        profilePictureChosen: state.uploadedPicture[0],
      });
    }
  }, [state.uploadedPicture[0]]);

  useEffect(() => {
    if (state.sendRequest) {
      async function UpdateProfile() {
        const formData = new FormData();

        if (
          typeof state.profilePictureValue === "string" ||
          state.profilePictureValue === null
        ) {
          formData.append("agency_name", state.agencyNameValue);
          formData.append("phone_number", state.phoneNumberValue);
          formData.append("bio", state.bioValue);
          formData.append("seller", GlobalState.userId);
        } else {
          formData.append("agency_name", state.agencyNameValue);
          formData.append("phone_number", state.phoneNumberValue);
          formData.append("bio", state.bioValue);
          formData.append("profile_picture", state.profilePictureValue);
          formData.append("seller", GlobalState.userId);
        }

        try {
          const response = await Axios.patch(
            `http://ec2-3-101-103-116.us-west-1.compute.amazonaws.com/api/profiles/${GlobalState.userId}/update/`,
            formData,
          );
          console.log(response.data);

          dispatch({ type: "openTheSnack" });
        } catch (error) {
          console.log(error.response);
          dispatch({ type: "allowTheButton" });
        }
      }
      UpdateProfile();
    }
  }, [state.sendRequest]);

  useEffect(() => {
    if (state.openSnack) {
      setTimeout(() => {
        navigate(0);
      }, 1500);
    }
  }, [state.openSnack]);

  function formSubmit(e) {
    e.preventDefault();
    dispatch({ type: "changeSendRequest" });
    dispatch({ type: "disableTheButton" });
  }

  function ProfilePictureDisplay() {
    if (typeof state.profilePictureValue !== "string") {
      return (
        <ul>
          {state.profilePictureValue ? (
            <li>{state.profilePictureValue.name}</li>
          ) : (
            ""
          )}
        </ul>
      );
    } else if (typeof state.profilePictureValue === "string") {
      return (
        <Grid
          item
          style={{
            marginTop: "0.5rem",
            marginRight: "auto",
            marginLeft: "auto",
          }}
        >
          <img
            src={props.userProfile.profilePic}
            style={{ width: "5rem", height: "5rem" }}
          />
        </Grid>
      );
    }
  }

  return (
    <div style={{ marginTop: "5rem" }}>
      <div
        style={{
          width: "75%",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "90px",
          border: "5px solid black",
          padding: "3rem",
        }}
      >
        <form onSubmit={formSubmit}>
          <Grid item container justifyContent="center">
            <Typography variant="h4">MY PROFILE</Typography>
          </Grid>

          {state.serverError ? (
            <Alert severity="error">Incorrect username or password!</Alert>
          ) : (
            ""
          )}

          <Grid item container style={{ marginTop: "1rem" }}>
            <TextField
              id="agencyName"
              label="Agency Name*"
              variant="outlined"
              fullWidth
              value={state.agencyNameValue}
              onChange={(e) =>
                dispatch({
                  type: "catchAgencyNameChange",
                  agencyNameChosen: e.target.value,
                })
              }
              error={state.serverError ? true : false}
            />
          </Grid>

          <Grid item container style={{ marginTop: "1rem" }}>
            <TextField
              id="phoneNumber"
              label="Phone Number*"
              variant="outlined"
              fullWidth
              value={state.phoneNumberValue}
              onChange={(e) =>
                dispatch({
                  type: "catchPhoneNumberChange",
                  phoneNumberChosen: e.target.value,
                })
              }
              error={state.serverError ? true : false}
            />
          </Grid>

          <Grid item container style={{ marginTop: "1rem" }}>
            <TextField
              id="bil"
              label="Bio"
              variant="outlined"
              fullWidth
              multiline
              rows={6}
              value={state.bioValue}
              onChange={(e) =>
                dispatch({
                  type: "catchBioChange",
                  bioChosen: e.target.value,
                })
              }
              error={state.serverError ? true : false}
            />
          </Grid>

          <Grid item container>
            {ProfilePictureDisplay()}
          </Grid>

          <Grid
            item
            container
            xs={6}
            style={{
              marginTop: "1rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Button
              variant="contained"
              component="label"
              fullWidth
              style={{
                backgroundColor: "blue",
                color: "white",
                fontSize: "1.1rem",
                marginLeft: "1rem",
                top: "10px",
              }}
            >
              PROFILE PICTURE
              <input
                type="file"
                accept="image/png, image/gif, image/jpeg, image/jpg"
                hidden
                onChange={(e) =>
                  dispatch({
                    type: "catchUploadedPicture",
                    pictureChosen: e.target.files,
                  })
                }
              />
            </Button>
          </Grid>

          <Grid
            item
            container
            xs={8}
            style={{
              marginTop: "1rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}
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
        <Snackbar
          open={state.openSnack}
          message="You have successfully updated your profile"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        />
      </div>
    </div>
  );
}

export default ProfileUpdate;
