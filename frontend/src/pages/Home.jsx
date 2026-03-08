import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import SearchBox from "../components/SearchBox/SearchBox";
import { PostCard } from "@/components/post";

export default function Home() {
  const [filterType, setFilterType] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  
  const [searchCooldown, setSearchCooldown] = useState(null);

  const limit = 10;
  let offset = 0;

  async function fetchPosts(clear = false) {
    const response = await fetch(`/api/posts?limit=${limit}&offset=${offset}&category=${filterCategory === "All Categories" ? "" : filterCategory}&type=${filterType === "All" ? "" : filterType.toLowerCase()}&searchText=${searchText}`);
    const data = await response.json();
    if (clear) {
      setPosts(data.posts);
    } else {
      setPosts((prevPosts) => [...prevPosts, ...data.posts]);
    }
    offset += limit;
  }

  useEffect(() => {
    if (searchCooldown) {
      clearTimeout(searchCooldown);
    }

    setSearchCooldown(setTimeout(() => {
      offset = 0;
      fetchPosts(true);
    }, 500));
  }, [filterCategory, filterType, searchText]);

  return (
    <div className="px-8">
      {/* Hero Section */}
      <Hero />

      <SearchBox filterCategory={filterCategory} setFilterCategory={setFilterCategory} setFilterType={setFilterType} searchText={searchText} setSearchText={setSearchText} />

      {/* Posts */}
      <div className="w-full max-w-5xl mx-auto py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
