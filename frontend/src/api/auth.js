const API_URL = "http://localhost:5000";

// LOGIN
const login = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data; // { token }
};

// REGISTER
const register = async (firstName, lastName, email, password, dateOfBirth, location, phone) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ firstName, lastName, email, password, dateOfBirth, location, phone }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registering failed");
  }

  return data; // { token }
};

// ME
const me = async (token) => {
  const res = await fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Fetching user info failed");
  }

  return data; // { user }
};

export default {
  login,
  register,
  me,
};
