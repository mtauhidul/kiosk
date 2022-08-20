import React from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router } from "react-router-dom";
import Routings from "./utils/Routings";

const App = () => {
  return (
    <Router>
      <Routings />
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          className: "",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },

          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },

          error: {
            duration: 3000,
            theme: {
              primary: "red",
              secondary: "black",
            },
          },
        }}
      />
    </Router>
  );
};

export default App;
