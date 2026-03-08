import { useEffect, useState, useRef } from "react";
import Hero from "../components/Hero";
import SearchBox from "../components/SearchBox/SearchBox";
import { PostCard } from "@/components/post";
import { AiOutlineLoading } from "react-icons/ai";

export default function Home() {
  const [filterType, setFilterType] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [searchText, setSearchText] = useState("");

  const [posts, setPosts] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [searchCooldown, setSearchCooldown] = useState(null);

  const loadMoreThreshold = useRef(null);

  const limit = 4;
  let offset = 0;
  let hitBottom = false;

  async function fetchPosts(clear = false) {
    if (hitBottom && !clear) return;

    if (clear) {
      setPosts([]);
      offset = 0;
      hitBottom = false;
    }

    setFetching(true);

    const response = await fetch(`/api/posts?limit=${limit}&offset=${offset}&category=${filterCategory === "All Categories" ? "" : filterCategory}&type=${filterType === "All" ? "" : filterType.toLowerCase()}&searchText=${searchText}`);

    if (!response.ok) {
      console.error("Failed to fetch posts:", response.statusText);
      setFetching(false);
      return;
    }

    const data = await response.json();

    if (clear) {
      setPosts(data.posts);
    } else {
      setPosts((prevPosts) => [...prevPosts, ...data.posts]);
    }

    if (data.posts.length < limit) {
      hitBottom = true;
    }
    offset += limit;
    setFetching(false);
  }

  // Fetch posts on filter or search change with a cooldown
  useEffect(() => {
    console.log("Filters changed, fetching posts...");

    if (searchCooldown) {
      clearTimeout(searchCooldown);
    }

    setSearchCooldown(setTimeout(() => {
      console.log("Fetching posts with filters:", { filterType, filterCategory, searchText });
      hitBottom = false;
      fetchPosts(true);
    }, 500));
  }, [filterCategory, filterType, searchText]);

  // On scroll to bottom, load more posts
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchPosts();
      }
    }, { threshold: 1 });

    if (loadMoreThreshold.current) {
      observer.observe(loadMoreThreshold.current);
    }
  }, []);

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

      {/* Load more threshold */}
      <div ref={loadMoreThreshold} className="text-5xl text-center w-full">
        {fetching && <AiOutlineLoading className="animate-spin mx-auto my-20" />}
      </div>
    </div>
  );
}
