import PostItem from "../components/PostItem";
import { useEffect, useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import EditPostForm from "../components/EditPostForm";
import api from "../../../api/posts";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [toggledPosts, setToggledPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);

  const fetchAllPosts = async () => {
    const data = await api.getAllPosts();
    setPosts(data);
  };

  async function deletePost(postId) {
    const token = localStorage.getItem("token");
    await api.deletePost(postId, token);
    await fetchAllPosts();
  }

  async function deleteSelected() {
    const token = localStorage.getItem("token");
    for (const postIndex in toggledPosts) {
      await deletePost(posts[postIndex]._id, token);
    }
    setToggledPosts([]);
  }

  function postToggled(postId, checked) {
    setToggledPosts(prev =>
      checked ? [...new Set([...prev, postId])] : prev.filter(id => id !== postId)
    );
  }

  function onCheckAllChanged(e) {
    const newValue = e.target.checked;

    if (newValue) {
      setToggledPosts(posts.map(post => post._id));
    } else {
      setToggledPosts([]);
    }
  }

  useEffect(() => {
    fetchAllPosts();
  }, []);

  return (
    <div className="pb-16">
      <h1 className="mb-3">Posts</h1>

      <div className="flex py-3 justify-between items-center">

        <div>
          <input type="checkbox" id="all-checked" name="all-checked" checked={toggledPosts.length === posts.length && posts.length > 0} onChange={onCheckAllChanged} />
          <label htmlFor="all-checked" className="select-none -mt-0.5 px-2">Selected ({toggledPosts.length}/{posts.length})</label>
        </div>

        <div className="flex flex-row justify-center items-center gap-3 p-1">
          <button className="flex flex-row gap-2 justify-center items-center text-red-500" disabled={toggledPosts.length <= 0} onClick={() => deleteSelected()}>
            <FaRegTrashCan />
            <span className="-mt-0.5">Delete</span>
          </button>
        </div>

      </div>

      <div className="flex flex-col gap-3">
        {posts.length > 0 ? posts.map((post) => (
          <PostItem
            key={post._id}
            post={post}
            checked={toggledPosts.find(id => id === post._id) != undefined}
            onEditClicked={() => {
              setEditingPost(post);
            }}
            onDeleteClicked={() => {
              deletePost(post._id);
            }}
            onChange={(checked) => {
              postToggled(post._id, checked);
            }} />
        )) :
          <center>
            No posts yet...
          </center>}
      </div>

      {editingPost && <EditPostForm post={editingPost} onClose={() => setEditingPost(null)} />}
    </div>
  );
}
