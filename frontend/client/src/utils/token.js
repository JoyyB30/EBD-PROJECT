export function getToken() {
  return localStorage.getItem("token") || "";
}

export function getUserIdFromToken(tokenOverride) {
  const token = tokenOverride || getToken();
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.id || payload?._id || null;
  } catch (e) {
    return null;
  }
}