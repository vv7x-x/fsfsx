import { useState, useEffect } from "react";
import { apiClient } from "../services/api";
import { Post } from "../types";
import { Loading, Card } from "../components/common";

export const ForumPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await apiClient.getPosts();
      if (res.success) {
        setPosts(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="جاري تحميل المنشورات..." />;

  return (
    <div className="forum-page">
      <h1>المنتدى</h1>
      <div className="posts-container">
        {posts.map((post) => (
          <Card key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.content}</p>
            <div className="post-meta">
              <span className="author">📝 {post.username}</span>
              <span className="category">{post.category}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
