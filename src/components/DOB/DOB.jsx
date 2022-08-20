import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useLocation } from "react-router-dom";
import styles from "../../styles/DOB.module.css";
import { days, months, years } from "../../utils/DateTime";

const DOB = ({ setData, data }) => {
  const locations = useLocation();

  return (
    <div className={styles.dobWrapper}>
      <FormControl sx={{ mr: 2, mt: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-helper-label">Day</InputLabel>
        <Select
          disabled={locations.pathname === "/kiosk/demographics_Information"}
          required
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={data?.day}
          label="Day"
          onChange={(e) => setData({ ...data, day: `${e.target.value}` })}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {days.map((day, index) => {
            return (
              <MenuItem key={index} value={day}>
                {day}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <FormControl sx={{ mr: 2, mt: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-helper-label">Month</InputLabel>
        <Select
          disabled={locations.pathname === "/kiosk/demographics_Information"}
          required
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={data?.month}
          label="Month"
          onChange={(e) => setData({ ...data, month: e.target.value })}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {months.map((month, index) => {
            return (
              <MenuItem key={index} value={month}>
                {month}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <FormControl sx={{ mr: 2, mt: 1, minWidth: 120 }}>
        <InputLabel id="demo-simple-select-helper-label">Year</InputLabel>
        <Select
          disabled={locations.pathname === "/kiosk/demographics_Information"}
          required
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={data?.year}
          label="Year"
          onChange={(e) => setData({ ...data, year: e.target.value })}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {years.map((year, index) => {
            return (
              <MenuItem key={index} value={year}>
                {year}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
};

export default DOB;
