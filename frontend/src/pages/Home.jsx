import Hero from "../components/Hero";
import CreatePostForm from "../components/CreatePostForm/CreatePostForm";
import { PostCard } from "@/components/post";
import { posts } from "@/data/posts";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Create Post */}
      <div className="px-8 mt-10">
        <CreatePostForm />
      </div>

      {/* Posts */}
      <div className="px-8 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
