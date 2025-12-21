import axios from "axios";

const BASE = "http://localhost:5000/api";

function authHeader() {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getAllFarmers() {
  const res = await axios.get(`${BASE}/banks/farmers`, authHeader());
  return res.data;
}

export const getBankFarmers = getAllFarmers;
export const getBankFarmersList = getAllFarmers;
export const getFarmers = getAllFarmers;

export async function getBankLoans() {
  const res = await axios.get(`${BASE}/loans`, authHeader());
  return res.data;
}

export async function updateLoan(id, data) {
  const res = await axios.put(`${BASE}/loans/${id}`, data, authHeader());
  return res.data;
}