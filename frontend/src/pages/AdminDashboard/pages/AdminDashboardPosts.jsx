import postData from "@/data/posts.json";
import AdminDashboardProductItem from "../components/AdminDashboardProductItem";
import { useEffect, useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";

export default function AdminDashboardPosts() {
  const [posts, setPosts] = useState([]);
  const [toggledPosts, setToggledPosts] = useState([]);

  function deletePost(postId) {
    setPosts([...posts.filter(post => post.id !== postId)]);
  }

  function deleteSelected() {
    setPosts([...posts.filter(post => !toggledPosts.find(t => t === post.id))]);
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
      setToggledPosts(posts.map(post => post.id));
    } else {
      setToggledPosts([]);
    }
  }

  useEffect(() => {
    setPosts(postData);
  }, []);

  return (
    <div className="pb-16">
      <h1 className="mb-3">Posts</h1>

      <div className="flex py-3 justify-between items-center">

        <div>
          <input type="checkbox" id="all-checked" name="all-checked" checked={toggledPosts.length === posts.length && posts.length > 0} onChange={onCheckAllChanged} />
          <label for="all-checked" className="select-none -mt-0.5 px-2">Selected ({toggledPosts.length}/{posts.length})</label>
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
          <AdminDashboardProductItem
            key={post.id}
            post={post}
            checked={toggledPosts.find(id => id === post.id) != undefined}
            onDeleteClicked={() => {
              deletePost(post.id);
            }}
            onChange={(checked) => {
              postToggled(post.id, checked);
            }} />
        )) :
          <center>
            No posts yet...
          </center>}
      </div>
    </div>
  );
}
