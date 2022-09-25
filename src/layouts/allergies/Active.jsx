import React from "react";
import AnimatedPage from "../../components/Animation/Pages";
import Bottom from "../../components/Bottom/Bottom";
import Selected from "../../components/history/Selected";
import store from "../../state/store";

const Active = () => {
  const state = store?.getState()?.data?.allergies;

  return (
    <AnimatedPage>
      <div style={{ width: "100%", minHeight: "85vh", position: "relative" }}>
        <Selected headerText="YOUR ACTIVE ALLERGIES :" items={state} />
        <Bottom />
      </div>
    </AnimatedPage>
  );
};

export default Active;
