import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";

export default function PostCard({
  post,
  author = {},
  comments = [],
  currentUser,
}) {
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [allComments, setAllComments] = useState(comments);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!post) return;

    axios
      .get(
        `https://blog-back-production-f88f.up.railway.app/likes?postId=${post.id}`
      )
      .then((res) => {
        setLikesCount(res.data.length);
        if (currentUser) {
          setLiked(res.data.some((l) => l.userId === currentUser.id));
        }
      })
      .catch((err) => console.error(err));
  }, [post, currentUser]);

  const toggleLike = async () => {
    if (!currentUser) {
      toast.error(" You must be logged in to like");

      return;
    }

    if (liked) {
      const res = await axios.get(
        `https://blog-back-production-f88f.up.railway.app/likes?postId=${post.id}&userId=${currentUser.id}`
      );
      if (res.data.length > 0) {
        const likeId = res.data[0].id;
        await axios.delete(
          `https://blog-back-production-f88f.up.railway.app/likes/${likeId}`
        );
        setLikesCount((c) => c - 1);
        setLiked(false);
      }
    } else {
      await axios.post(
        `https://blog-back-production-f88f.up.railway.app/likes`,
        {
          postId: post.id,
          userId: currentUser.id,
        }
      );
      setLikesCount((c) => c + 1);
      setLiked(true);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    if (!currentUser) {
      toast.error(" You must be logged in to comment");
      return;
    }

    const commentData = {
      postId: post.id,
      userId: currentUser.id,
      body: newComment,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await axios.post(
        "https://blog-back-production-f88f.up.railway.app/comments",
        commentData
      );

      setAllComments((prev) => [...prev, { ...res.data, user: currentUser }]);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeletePost = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(
        `https://blog-back-production-f88f.up.railway.app/posts/${post.id}`
      );

      toast.success("Post deleted successfully");
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Error deleting post");
    }
  };
  const handleEditPost = () => {
    navigate(`/edit-post/${post.id}`);
  };

  return (
    <motion.div
      layout
      className="bg-base-200 shadow-lg rounded-xl p-6 mb-8 max-w-2xl mx-auto border border-base-200"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div>
        <Toaster />
      </div>

      <div className="flex items-center mb-4 justify-between">
        <div className="flex items-center">
          <img
            src={author.avatar || "https://i.pravatar.cc/150?img=1"}
            alt={author.username || "User"}
            className="w-12 h-12 rounded-full mr-3 object-cover"
          />
          <div>
            <h3 className="font-semibold text-lg">
              {author.username || "Unknown"}
            </h3>
            <p className="text-sm text-gray-500">
              {post.createdAt
                ? new Date(post.createdAt).toLocaleDateString()
                : "Unknown date"}
            </p>
          </div>
        </div>

        {currentUser && currentUser.id === author.id && (
          <div className="flex gap-2">
            <button
              onClick={handleEditPost}
              className="btn btn-sm btn-outline btn-info"
            >
              Edit
            </button>
            <button
              onClick={handleDeletePost}
              className="btn btn-sm btn-outline btn-error"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <h2 className="font-bold text-xl mb-3">{post.title}</h2>
      <p className=" mb-4">{post.body}</p>

      {post.image && (
        <motion.img
          src={post.image}
          alt={post.title}
          className="rounded-lg mb-4 w-full object-cover shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
      )}

      <div className="flex justify-between items-center text-gray-600 border-t pt-3">
        <button
          onClick={toggleLike}
          className="flex items-center space-x-1 hover:text-red-500 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={liked ? "red" : "none"}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
          <span>{likesCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="hover:text-blue-500 transition flex items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
            />
          </svg>
          {allComments.length} Comments
        </button>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            className="mt-4 space-y-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {allComments.length > 0 ? (
              allComments.map((c) => (
                <motion.div
                  key={c.id}
                  className="bg-base-100 p-3 rounded-lg flex justify-between shadow-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center">
                    <img
                      src={c.user?.avatar || "https://i.pravatar.cc/150?img=1"}
                      alt={c.user?.username || "User"}
                      className="w-8 h-8 rounded-full mr-2 object-cover"
                    />
                    <div>
                      <span className="font-semibold text-sm block">
                        {c.user?.username || "Unknown"}
                      </span>
                      <p className="text-base-700 font-bold text-sm">
                        {c.body}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs ml-2">
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleDateString()
                        : "Unknown date"}
                    </span>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No comments yet.</p>
            )}

            <div className="flex items-center mt-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="input input-bordered flex-grow mr-2"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleAddComment}
                className="btn btn-primary"
              >
                Add
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
