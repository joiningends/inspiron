import React from "react";
import { createRoot } from "react-dom/client"; // Import createRoot from "react-dom/client"
import { Provider } from "react-redux";
import App from "./App";
import store from "./components/redux/Store";

const root = createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);
