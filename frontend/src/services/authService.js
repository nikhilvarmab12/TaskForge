import API from "../api/axios";
import axios from "axios";

const API_URL =
   import.meta.env.VITE_API_URL;

export const forgotPassword = (email) => {

  return axios.post(
    `${API_URL}/forgot-password`,
    { email }
  );
};
export const resetPassword =
  (token, password) => {

  return axios.post(
    `${API_URL}/reset-password`,
    {
      token,
      password,
    }
  );
};
export const signup = async (data) => {

  const response = await API.post(
    "/api/auth/signup",
    data
  );

  return response.data;
};

export const login = async (data) => {

  const response = await API.post(
    "/api/auth/login",
    data
  );

  return response.data;
};