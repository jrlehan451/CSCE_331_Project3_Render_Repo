import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from '@auth0/auth0-react';
// import {MagnifierProvider} from './components/MagnifyingScreen/MagnifierComponent';
import "./components/MagnifyingScreen/MagnifierComponent.css";


ReactDOM.render(
  <React.StrictMode>
   <Auth0Provider
      domain="dev-n04g00zdaksyn2f5.us.auth0.com"
      clientId="FOLPn1nwuhSpeLKYBvTdcM0EmVm2vjYx"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
   >
      <BrowserRouter>
          <App />
        </BrowserRouter>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
