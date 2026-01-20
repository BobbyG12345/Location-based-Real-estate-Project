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
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";
import defaultProfilePicture from "./Assets/defaultProfilePicture.jpg";
function Agencies() {
  const navigate = useNavigate();
  const GlobalState = useContext(StateContext);

  const initialState = {
    dataIsLoading: true,
    AgenciesList: [],
  };

  function ReducerFunction(draft, action) {
    switch (action.type) {
      case "catchAgencies":
        draft.AgenciesList = action.agenciesArray;
        break;
      case "loadingDone":
        draft.dataIsLoading = false;
        break;
    }
  }
  const [state, dispatch] = useImmerReducer(ReducerFunction, initialState);

  useEffect(() => {
    async function GetAgencies() {
      try {
        const response = await Axios.get(`http://localhost:8000/api/profiles/`);
        dispatch({ type: "catchAgencies", agenciesArray: response.data });
        dispatch({ type: "loadingDone" });
        // console.log("response", response);
      } catch (error) {
        console.log(error.response);
      }
    }
    GetAgencies();
  }, []);

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
    <Grid
      container
      justifyContent="flex-start"
      spacing={2}
      style={{ padding: "10px" }}
    >
      {state.AgenciesList.map((agency) => {
        function PropertiesDisplay() {
          if (agency.seller_listings.length === 0) {
            return (
              <Button variant="contained" size="small" disabled>
                No Property
              </Button>
            );
          } else if (agency.seller_listings.length === 1) {
            return (
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate(`/agencies/${agency.seller}`)}
              >
                One Property Listed
              </Button>
            );
          } else {
            <Button
              size="small"
              onClick={() => navigate(`/agencies/${agency.seller}`)}
            >
              {agency.seller_listings.length} Properties
            </Button>;
          }
        }
        if (agency.agency_name && agency.phone_number)
          return (
            <Grid
              key={agency.id}
              item
              style={{ marginTop: "1rem", maxWidth: "20rem" }}
            >
              <Card>
                <CardMedia
                  height="140"
                  image={
                    agency.profile_picture
                      ? agency.profile_picture
                      : defaultProfilePicture
                  }
                  alt="Agency Profile Picture"
                  component="img"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {agency.agency_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {agency.bio.substring(0, 100)}...
                  </Typography>
                </CardContent>
                <CardActions>{PropertiesDisplay()}</CardActions>
              </Card>
            </Grid>
          );
      })}
    </Grid>
  );
}

export default Agencies;
