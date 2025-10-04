import React, { useContext } from "react";
import PostCard from "../components/PostCard";
import NavBar from "../components/NavBar";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Home({ posts = [], users = [], comments = [] }) {
  const { user } = useContext(AuthContext);

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="min-h-screen bg-base-100 ">
      <NavBar />

      {}
      {sortedPosts.length === 0 ? (
        <p
          className="text-center text-gray-500
          flex flex-col items-center justify-center mt-20"
        >
          No posts available. Be the first to add one!
        </p>
      ) : (
        sortedPosts.map((post) => {
          const author = users.find((u) => u.id === post.authorId) || {};
          const postComments = (comments || [])
            .filter((c) => c.postId === post.id)
            .map((c) => ({
              ...c,
              user: users.find((u) => u.id === c.userId) || {},
            }));

          return (
            <PostCard
              key={post.id}
              post={post}
              author={author}
              comments={postComments}
              currentUser={user}
            />
          );
        })
      )}
      <Link
        className=" btn btn-primary  fixed bottom-4 right-4  btn-circle w-16 h-16  hover:bg-violet-400 flex justify-center items-center text-center text-3xl font-bold"
        to={user ? "/add-post" : "/login"}
      >
        +
      </Link>
    </div>
  );
}
