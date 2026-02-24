import Hero from "../components/Hero";
import CreatePostForm from "../components/CreatePostForm/CreatePostForm";
import SearchBox from "../components/SearchBox/SearchBox";
import { PostCard } from "@/components/post";
import { posts } from "@/data/posts";

export default function Home() {
  return (
    <div className="px-8">
      {/* Hero Section */}
      <Hero />

      <SearchBox />

      {/* Posts */}
      <div className="w-full max-w-5xl mx-auto py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
