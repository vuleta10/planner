import axios from "axios";

const API_URL = "http://localhost:8001";

// LOGIN
export const loginUser = async (username, password) => {
  const res = await axios.get(`${API_URL}/login`, {
    params: { username, password },
  });
  return res.data;
};

// REGISTER
export const registerUser = async (username, password) => {
  const res = await axios.post(`${API_URL}/join`, { username, password });
  return res.data;
};

// GET TASK
export const getTask = async (username, datum) => {
  const res = await axios.get(`${API_URL}/task`, {
    params: { username, datum },
  });
  return res.data;
};

// ADD / UPDATE TASK
export const saveTask = async (username, datum, task2do) => {
  const res = await axios.post(`${API_URL}/task`, {
    username,
    datum,
    task2do,
  });
  return res.data;
};