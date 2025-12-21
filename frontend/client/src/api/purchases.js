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

export async function createPurchase(data) {
  const farmerId = data?.farmerId || getUserIdFromToken();

  if (!farmerId) {
    throw new Error("No farmerId found. Please login again.");
  }

  const payload = { ...data, farmerId };
  const res = await axios.post(
    `${BASE}/purchases`,
    payload,
    authHeader()
  );

  return res.data;
}

export async function getPurchasesForFarmer(farmerIdParam) {
  const farmerId = farmerIdParam || getUserIdFromToken();

  if (!farmerId) {
    throw new Error("No farmerId found. Please login again.");
  }

  const res = await axios.get(
    `${BASE}/purchases/farmer/${farmerId}`,
    authHeader()
  );

  return res.data;
}

export const getPurchasesByFarmerId = getPurchasesForFarmer;

export async function updatePurchase(id, data) {
  const res = await axios.put(
    `${BASE}/purchases/${id}`,
    data,
    authHeader()
  );

  return res.data;
}

export async function deletePurchase(id) {
  const res = await axios.delete(
    `${BASE}/purchases/${id}`,
    authHeader()
  );

  return res.data;
}