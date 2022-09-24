import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { bindActionCreators } from "redux";
import Box from "@mui/material/Box";
import Bottom from "../../components/Bottom/Bottom";
import SocialCard from "../../components/socialCard/SocialCard";
import * as actionCreators from "../../state/actionCreators/index";
import store from "../../state/store";

const SocialHistory = () => {
  const dispatch = useDispatch();
  const { addSocialHistory } = bindActionCreators(actionCreators, dispatch);
  const location = useLocation();

  const [data, setData] = useState({
    smoke: "",
  });

  useEffect(() => {
    const state = store?.getState()?.data?.socialHistory;
    setData(state);
  }, []);
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: { xs: "100vh", sm: "85vh" },
        position: "relative",
      }}
    >
      <h3 className="header3">SMOKER OR NON-SMOKER?</h3>
      <br />
      <SocialCard data={data} setData={setData} />
      <Bottom
        isEdit={location.state}
        handleSubmit={addSocialHistory}
        data={data}
      />
    </Box>
  );
};

export default SocialHistory;
