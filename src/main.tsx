import React from "react";
import ReactDOM from "react-dom/client";
//@ts-expect-error some import error
import App from "./App.jsx";
import "./index.css";

import Clarity from "@microsoft/clarity";
import { PostHogProvider } from "posthog-js/react";

// Make sure to add your actual project id instead of "yourProjectId".
const options = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
};

Clarity.init(import.meta.env.VITE_CLARITY_PROJECT_ID)

import { setAssetPath } from "@esri/calcite-components/dist/components";
setAssetPath("https://js.arcgis.com/calcite-components/2.6.0/assets");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PostHogProvider
      apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
      options={options}
    >
    <App />
    </PostHogProvider>
  </React.StrictMode>
);
