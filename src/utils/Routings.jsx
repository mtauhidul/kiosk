import React from "react";
import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import ESign from "../views/ESign";
import Main from "../views/Main";
import Preview from "../views/Preview";
import Welcome from "../views/Welcome";
import EncounterVerification from "../views/EncounterVerification";
import Camera from "./Camera";
import { modules } from "./Modules";

const Routings = () => {
  const location = useLocation();

  return (
    <AnimatePresence exitBeforeEnter>
      <Routes key={location.pathname} location={location}>
        <Route path="/" element={<Welcome />} />
        <Route path="/encounter-verification" element={<EncounterVerification />} />
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
    </AnimatePresence>
  );
};

export default Routings;
