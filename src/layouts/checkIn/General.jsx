import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import Bottom from "../../components/Bottom/Bottom";
import DOB from "../../components/DOB/DOB";
import * as actionCreators from "../../state/actionCreators/index";
import store from "../../state/store";
import styles from "../../styles/General.module.css";

const General = () => {
  const dispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(true);
  const [user, setUser] = useState({
    fullName: "",
    day: "",
    month: "",
    year: "",
    location: "",
  });

  useEffect(() => {
    const state = store?.getState()?.data?.userInfo;
    setUser({
      fullName: state.fullName || "",
      day: state.day || "",
      month: state.month || "",
      year: state.year || "",
      location: state.location || "",
    });
  }, []);

  useEffect(() => {
    if (
      user.fullName === "" ||
      user.day === "" ||
      user.month === "" ||
      user.year === "" ||
      user.location === ""
    ) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  }, [user]);

  const { addUserInfo } = bindActionCreators(actionCreators, dispatch);

  return (
    <form className={styles.GeneralContainer}>
      <div>
        <div className={styles.form}>
          <h3 className="header3">General Info</h3>
          <FormControl sx={{ mb: 3, mt: 5, minWidth: 120, width: "100%" }}>
            <TextField
              required
              value={user?.fullName}
              onChange={(e) => setUser({ ...user, fullName: e.target.value })}
              id="outlined-required"
              label="Full Name"
            />
          </FormControl>
          <h6 className="header6">Date of Birth</h6>
          <DOB setData={setUser} data={user} />
        </div>
        <div id={styles.locationSelector} className={styles.form}>
          <h6 className="header6">
            Which location is your appointment scheduled?
          </h6>
          <FormControl sx={{ mr: 2, mt: 1, minWidth: 390 }}>
            <InputLabel id="demo-simple-select-helper-label">
              Location
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={user?.location}
              label="Location"
              onChange={(e) => setUser({ ...user, location: e.target.value })}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="B">B</MenuItem>
              <MenuItem value="C">C</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <Bottom isDisabled={isDisabled} handleSubmit={addUserInfo} data={user} />
    </form>
  );
};

export default General;
