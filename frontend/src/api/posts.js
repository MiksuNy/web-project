// CREATE POST
const createPost = async (postData, token) => {
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Creating post failed");
  }
};

export default {
  createPost,
};
