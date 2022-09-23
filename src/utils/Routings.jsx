import React from "react";
import { Route, Routes } from "react-router-dom";
import ESign from "../views/ESign";
import Main from "../views/Main";
import Preview from "../views/Preview";
import Welcome from "../views/Welcome";
import Camera from "./Camera";
import { modules } from "./Modules";

const Routings = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      {modules.map((module, index) => {
        return (
          <Route
            key={index}
            path={module.path}
            element={
              module.title !== "" ? (
                <Main title={module.title}>
                  <module.component />
                </Main>
              ) : (
                <ESign>
                  <module.component />
                </ESign>
              )
            }
          />
        );
      })}
      <Route path="/kiosk/camera/:id" element={<Camera />} />
      <Route path="/preview" element={<Preview />} />
    </Routes>
  );
};

export default Routings;
