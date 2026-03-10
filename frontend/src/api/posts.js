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

// GET ALL POSTS
const getAllPosts = async () => {
  const res = await fetch("/api/posts", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Getting all posts failed");
  }

  return data.posts;
};

// EDIT POST
const editPost = async (postData, token) => {
  const res = await fetch(`/api/posts/${postData._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Updating post failed");
  }
};

const deletePost = async (postData, token) => {
  const res = await fetch(`/api/posts/${postData._id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    }
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Deleting post failed");
  }
};

export default {
  createPost,
  getAllPosts,
  editPost,
  deletePost
};
