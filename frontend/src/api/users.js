const getAllUsers = async () => {
  const res = await fetch("/api/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Fetching all users failed");
  }

  return data;
}

export default {
  getAllUsers,
};