import axios from "axios";
const api = axios.create({
  URL: "http://localhost:3001/",
});
export default api;
