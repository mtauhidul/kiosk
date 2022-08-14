import React from "react";
import Bottom from "../../components/Bottom/Bottom";
import Selected from "../../components/history/Selected";
import store from "../../state/store";

const Active = () => {
  const state = store?.getState()?.data?.allergies;

  return (
    <div style={{ width: "100%", minHeight: "85vh", position: "relative" }}>
      <Selected headerText="YOUR ACTIVE ALLERGIES :" items={state} />
      <Bottom />
    </div>
  );
};

export default Active;
