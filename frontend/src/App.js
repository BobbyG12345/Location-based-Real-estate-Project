import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Home from "./components/Home";
import CssBaseline from "@mui/material/CssBaseline";
import Header from "./components/Header";
import Listings from "./components/Listings";
import Testing from "./components/Testing";
import Register from "./components/Register";
import AddProperty from "./components/AddProperty";
import { useImmerReducer } from "use-immer";
import DispatchContext from "./Contexts/DispatchContext";
import StateContext from "./Contexts/StateContext";
import React, { useEffect } from "react";
import Profile from "./components/Profile";
import ProfileUpdate from "./components/ProfileUpdate";
import Agencies from "./components/Agencies";
import AgencyDetail from "./components/AgencyDetail";
import ListingDetail from "./components/ListingDetail";

function App() {
  const initialState = {
    userUsername: localStorage.getItem("theUserUsername") || "",
    userEmail: localStorage.getItem("theUserEmail") || "",
    userId: localStorage.getItem("theUserId") || "",
    userToken: localStorage.getItem("theUserToken") || "",
    userIsLogged: localStorage.getItem("theUserToken") ? true : false,
  };

  function ReducerFuction(draft, action) {
    switch (action.type) {
      case "catchToken":
        draft.userToken = action.tokenValue;
        break;
      case "userSignsIn":
        draft.userUsername = action.usernameInfo;
        draft.userEmail = action.emailInfo;
        draft.userId = action.IdInfo;
        draft.userIsLogged = true;
        break;
      case "logout":
        draft.userIsLogged = false;
        break;
    }
  }

  const [state, dispatch] = useImmerReducer(ReducerFuction, initialState);

  useEffect(() => {
    if (state.userIsLogged) {
      localStorage.setItem("theUserUsername", state.userUsername);
      localStorage.setItem("theUserEmail", state.userEmail);
      localStorage.setItem("theUserId", state.userId);
      localStorage.setItem("theUserToken", state.userToken);
    } else {
      localStorage.removeItem("theUserUsername");
      localStorage.removeItem("theUserEmail");
      localStorage.removeItem("theUserId");
      localStorage.removeItem("theUserToken");
    }
  }, [state.userIsLogged]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        <BrowserRouter>
          <CssBaseline />
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "60px", // 你可以改成你需要的高度
              backgroundColor: "#fff", // 背景色，避免透明
              zIndex: 1000, // 保证在图片等元素之上
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)", // 阴影可选
            }}
          >
            <Header />
          </div>
          <div style={{ marginTop: `60px` }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/listings" element={<Listings />} />
              <Route path="/testing" element={<Testing />} />
              <Route path="/register" element={<Register />} />
              <Route path="/addproperty" element={<AddProperty />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/agencies" element={<Agencies />} />
              <Route path="agencies/:id" element={<AgencyDetail />} />
              <Route path="/listings/:id" element={<ListingDetail />} />
            </Routes>
          </div>
        </BrowserRouter>
      </StateContext.Provider>
    </DispatchContext.Provider>
  );
}

export default App;
