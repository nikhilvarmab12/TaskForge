import axios from "axios";

const API_URL = "http://localhost:8080/api/tasks";

// TOKEN
const getToken = () => {

  return localStorage.getItem("token");
};

// GET TASKS
export const getTasks = async (
  page = 0,
  size = 10
) => {

  const response = await axios.get(
    `${API_URL}?page=${page}&size=${size}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    }
  );

  return response.data;
};

// CREATE TASK
export const createTask = async (taskData) => {

  const response = await axios.post(
    API_URL,
    taskData,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// DELETE TASK
export const deleteTask = async (id) => {

  const response = await axios.delete(
    `${API_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// UPDATE TASK
export const updateTask = async (id, taskData) => {

  const response = await axios.put(
    `${API_URL}/${id}`,
    taskData,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};