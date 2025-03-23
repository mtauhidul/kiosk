import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";

// Create arrays for days, months, and years
const generateDays = () => {
  return Array.from({ length: 31 }, (_, i) => (i + 1).toString());
};

const months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear - 100; year <= currentYear; year++) {
    years.push(year.toString());
  }
  return years;
};

const DOB = ({ data, setData }) => {
  const [days] = useState(generateDays());
  const [years] = useState(generateYears());

  // For debugging purposes - log whenever the component receives new data
  useEffect(() => {
    console.log("DOB component received data:", data);
  }, [data]);

  const handleChange = (field, value) => {
    console.log(`Setting ${field} to ${value}`);
    setData({ ...data, [field]: value });
  };

  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
      {/* Day */}
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="day-select-label">Day</InputLabel>
        <Select
          labelId="day-select-label"
          id="day-select"
          value={data.day || ""}
          label="Day"
          onChange={(e) => handleChange("day", e.target.value)}
        >
          {days.map((day) => (
            <MenuItem key={day} value={day}>
              {day}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Month */}
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="month-select-label">Month</InputLabel>
        <Select
          labelId="month-select-label"
          id="month-select"
          value={data.month || ""}
          label="Month"
          onChange={(e) => handleChange("month", e.target.value)}
        >
          {months.map((month, index) => (
            <MenuItem key={month} value={month}>
              {month}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Year */}
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="year-select-label">Year</InputLabel>
        <Select
          labelId="year-select-label"
          id="year-select"
          value={data.year || ""}
          label="Year"
          onChange={(e) => handleChange("year", e.target.value)}
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default DOB;
