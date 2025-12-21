import axios from "axios";
import { getUserIdFromToken } from "../utils/token";

const API_URL = "http://localhost:5000/api/summary";

function authHeader() {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export const getMonthlySummaryForFarmer = async (farmerId) => {
  const id = farmerId || getUserIdFromToken();

  if (!id) {
    throw new Error("No farmerId found. Please login again.");
  }

  const res = await axios.get(
    `${API_URL}/monthly/${id}`,
    authHeader()
  );

  return res.data;
};