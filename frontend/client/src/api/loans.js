import axios from "axios";
import { getUserIdFromToken } from "../utils/token";

const BASE = "http://localhost:5000/api";

function authHeader() {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function createLoan(data) {
  const farmerId = data?.farmerId || getUserIdFromToken();

  if (!farmerId) {
    throw new Error("No farmerId found. Please login again.");
  }

  const payload = { ...data, farmerId };
  const res = await axios.post(`${BASE}/loans`, payload, authHeader());

  return res.data;
}

export async function getLoansForFarmer(farmerIdParam) {
  const farmerId = farmerIdParam || getUserIdFromToken();

  if (!farmerId) {
    throw new Error("No farmerId found. Please login again.");
  }

  const res = await axios.get(
    `${BASE}/loans/farmer/${farmerId}`,
    authHeader()
  );

  return res.data;
}

export const createLoanRequest = createLoan;
export const getLoansByFarmerId = getLoansForFarmer;

export async function getLoans() {
  const res = await axios.get(`${BASE}/loans`, authHeader());
  return res.data;
}

export async function updateLoan(id, data) {
  const res = await axios.put(`${BASE}/loans/${id}`, data, authHeader());
  return res.data;
}

export async function deleteLoan(id) {
  const res = await axios.delete(`${BASE}/loans/${id}`, authHeader());
  return res.data;
}