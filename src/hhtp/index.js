import axios from "axios";

const BASE_URL = "http://192.168.188.132:8080";

const $api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

export default $api;
