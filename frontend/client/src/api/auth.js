import http from "./http";

export const registerFarmer = async (payload) => {
  const res = await http.post("/authorization/register", payload);
  return res.data;
};

export const loginFarmer = async (payload) => {
  const res = await http.post("/authorization/login", payload);
  return res.data;
};

export const staffLogin = async (payload) => {
  const res = await http.post("/authorization/staff-login", payload);
  return res.data;
};