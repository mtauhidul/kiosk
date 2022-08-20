import axios from "axios";
const BASE_URL = "https://kiosk-backend-server.herokuapp.com/api";

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
