// LOGIN
const login = async (email, password) => {
  const res = await fetch(`/api/auth/login`, {
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
  const res = await fetch(`/api/auth/register`, {
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

const saveUserInfo = async (user, token) => {
  const res = await fetch(`/api/auth/edit/${user._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(user)
  });

  if (!res.ok) {
    throw new Error(await res.json().message || "Saving user info failed");
  }
};

const deleteUser = async (user, token) => {
  const res = await fetch(`/api/auth/delete/${user._id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(await res.json().message || "Deleting user failed");
  }
};

// ME
const me = async (token) => {
  const res = await fetch(`/api/auth/userinfo`, {
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
  saveUserInfo,
  deleteUser,
  me,
};
