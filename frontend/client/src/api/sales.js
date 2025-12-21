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

export async function createSale(data) {
  const farmerId = data?.farmerId || getUserIdFromToken();

  if (!farmerId) {
    throw new Error("No farmerId found. Please login again.");
  }

  const payload = { ...data, farmerId };
  const res = await axios.post(
    `${BASE}/sales`,
    payload,
    authHeader()
  );

  return res.data;
}

export async function getSalesForFarmer(farmerIdParam) {
  const farmerId = farmerIdParam || getUserIdFromToken();

  if (!farmerId) {
    throw new Error("No farmerId found. Please login again.");
  }

  const res = await axios.get(
    `${BASE}/sales/farmer/${farmerId}`,
    authHeader()
  );

  return res.data;
}

export const getSalesByFarmerId = getSalesForFarmer;

export async function getSales() {
  const res = await axios.get(`${BASE}/sales`, authHeader());
  return res.data;
}

export async function updateSale(id, data) {
  const res = await axios.put(
    `${BASE}/sales/${id}`,
    data,
    authHeader()
  );

  return res.data;
}

export async function deleteSale(id) {
  const res = await axios.delete(
    `${BASE}/sales/${id}`,
    authHeader()
  );

  return res.data;
}