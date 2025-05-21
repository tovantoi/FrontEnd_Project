import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import ChatbotWidget from "./components/ChatbotWidget";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./index.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { GoogleOAuthProvider } from "@react-oauth/google";

// Thay bằng client ID Google thật của bạn
const clientId =
  "87654122570-uhs0gvn3gsf9muahfr2tnujh376qhupi.apps.googleusercontent.com";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
      <ChatbotWidget />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
