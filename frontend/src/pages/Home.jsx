import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import SearchBox from "../components/SearchBox/SearchBox";
import { PostCard } from "@/components/post";

export default function Home() {
  const [posts, setPosts] = useState([]);

  const limit = 10;
  let offset = 0;

  async function fetchPosts() {
    const response = await fetch(`/api/posts?limit=${limit}&offset=${offset}`);
    const data = await response.json();
    setPosts((prevPosts) => [...prevPosts, ...data.posts]);
    offset += limit;
    console.log("Fetched posts:", data.posts);
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="px-8">
      {/* Hero Section */}
      <Hero />

      <SearchBox />

      {/* Posts */}
      <div className="w-full max-w-5xl mx-auto py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
