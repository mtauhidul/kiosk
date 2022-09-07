import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "../src/state/store";
import "../src/styles/index.css";
import App from "./App";

import "react-pdf/dist/esm/Page/AnnotationLayer.css";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
