import { useEffect, useState, useRef, useCallback } from "react";
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

  const loadMoreThreshold = useRef(null);
  const offsetRef = useRef(0);
  const hitBottomRef = useRef(false);
  const searchCooldownRef = useRef(null);

  const limit = 4;

  // Fetch posts
  const fetchPosts = useCallback(async (clear = false) => {
    if (hitBottomRef.current && !clear) return;

    if (clear) {
      setPosts([]);
      offsetRef.current = 0;
      hitBottomRef.current = false;
    }

    setFetching(true);

    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offsetRef.current.toString(),
      category: filterCategory === "All Categories" ? "" : filterCategory,
      type: filterType === "All" ? "" : filterType.toLowerCase(),
      searchText,
    });

    try {
      const response = await fetch(`/api/posts?${params}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }

      const data = await response.json();

      setPosts((prevPosts) => {
        if (clear) return data.posts;
        const existingIds = new Set(prevPosts.map(p => p._id));
        const newPosts = data.posts.filter(p => !existingIds.has(p._id));
        return [...prevPosts, ...newPosts];
      });

      if (data.posts.length < limit) {
        hitBottomRef.current = true;
      }
      offsetRef.current += limit;
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  }, [filterCategory, filterType, searchText, limit]);

  // Cooldown for post fetching to prevent spam
  useEffect(() => {
    if (searchCooldownRef.current) {
      clearTimeout(searchCooldownRef.current);
    }

    searchCooldownRef.current = setTimeout(() => {
      fetchPosts(true);
    }, 500);

    return () => {
      if (searchCooldownRef.current) {
        clearTimeout(searchCooldownRef.current);
      }
    };
  }, [fetchPosts]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !fetching) {
          fetchPosts();
        }
      },
      { threshold: 1 }
    );

    const currentRef = loadMoreThreshold.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [fetchPosts, fetching]);

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
