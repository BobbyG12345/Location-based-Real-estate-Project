import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useContext,
  use,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  IconButton,
  CardContent,
  CardActions,
  CardMedia,
  Card,
} from "@mui/material";
import defaultProfilePicture from "./Assets/defaultProfilePicture.jpg";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

function AgencyDetail() {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);
  const params = useParams();

  const initialState = {
    userProfile: {
      agencyName: "",
      phoneNumber: "",
      profilePic: "",
      bio: "",
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
          `http://localhost:8000/api/profiles/${params.id}/`
        );
        dispatch({ type: "catchUserProfileInfo", profileInfo: response.data });
        dispatch({ type: "loadingDone" });
        console.log("response", response);
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
          onClick={() =>
            navigate(`/properties/${state.userProfile.sellerListings.id}`)
          }
        >
          One Property Listed
        </Button>
      );
    } else {
      <Button size="small">
        {state.userProfile.sellerListings.length} Properties
      </Button>;
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
    <div>
      {" "}
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
              <span style={{ fontWeight: "bolder", color: "green" }}>
                {state.userProfile.agencyName}
              </span>
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="h5"
              style={{ textAlign: "center", marginTop: "1rem" }}
            >
              <IconButton>
                <LocalPhoneIcon />
                {state.userProfile.phoneNumber}
              </IconButton>
            </Typography>
          </Grid>
        </Grid>
        <Grid item style={{ marginTop: "1rem", padding: "5px" }}>
          {state.userProfile.bio}
        </Grid>
      </Grid>
      <Grid
        container
        justifyContent="flex-start"
        spacing={2}
        style={{ padding: "10px" }}
      >
        {state.userProfile.sellerListings.map((listing) => {
          return (
            <Grid
              key={listing.id}
              item
              style={{ marginTop: "1rem", maxWidth: "20rem" }}
            >
              <Card>
                <CardMedia
                  height="140"
                  image={
                    `http://localhost:8000${listing.picture1}`
                      ? `http://localhost:8000${listing.picture1}`
                      : defaultProfilePicture
                  }
                  alt="Property Picture"
                  component="img"
                  onClick={() => navigate(`/listings/${listing.id}`)}
                  style={{ cursor: "pointer" }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {listing.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {listing.description.substring(0, 100)}...
                  </Typography>
                </CardContent>
                <CardActions>
                  {listing.property_status === "sale"
                    ? `${listing.listing_type}: $${listing.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                    : `${listing.listing_type}: $${listing.price
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/${
                        listing.rental_frequency
                      }`}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

export default AgencyDetail;
