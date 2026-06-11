import axios from "axios";

const API_URL =
  "http://localhost:8080/api/profile";

const getToken = () =>
  localStorage.getItem("token");

export const getProfile = async () => {

  const response = await axios.get(
    API_URL,
    {
      headers: {
        Authorization:
          `Bearer ${getToken()}`
      }
    }
  );

  return response.data;
};

export const updateProfile = async (
  data
) => {

  const response = await axios.put(
    API_URL,
    data,
    {
      headers: {
        Authorization:
          `Bearer ${getToken()}`
      }
    }
  );

  return response.data;
};

export const uploadAvatar = async (
  file
) => {

  const formData =
    new FormData();

  formData.append(
    "file",
    file
  );

  const response = await axios.post(
    `${API_URL}/avatar`,
    formData,
    {
      headers: {
        Authorization:
          `Bearer ${getToken()}`
      }
    }
  );

  return response.data;
};