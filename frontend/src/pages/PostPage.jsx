import { useParams } from "react-router-dom";
import posts from "../data/posts.json";

export default function PostPage() {

  const { id } = useParams();

  const post = posts.find(p => p.id === Number(id));

  if (!post) {
    return (
      <div className="p-10 text-center">
        Post not found
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">

      {post.image && (
        <img
          src={post.image}
          className="w-full h-64 object-cover rounded-xl"
        />
      )}

      <h1 className="text-2xl font-bold">
        {post.title}
      </h1>

      <p className="text-muted-foreground">
        {post.description}
      </p>

      <div className="text-sm text-muted-foreground">
        Category: {post.category}
      </div>

    </div>
  );
}