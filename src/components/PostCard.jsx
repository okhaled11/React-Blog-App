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
      className="bg-gradient-to-br from-base-100 to-base-200 shadow-xl rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 w-full border border-base-300 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 backdrop-blur-sm"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      <div>
        <Toaster />
      </div>

      <div className="flex items-center mb-5 justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={author.avatar || "https://i.pravatar.cc/150?img=1"}
              alt={author.username || "User"}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20 ring-offset-2 ring-offset-base-100"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-base-100"></div>
          </div>
          <div>
            <h3 className="font-bold text-lg text-base-content hover:text-primary transition-colors cursor-pointer">
              {author.username || "Unknown"}
            </h3>
            <div className="flex items-center gap-2 text-sm text-base-content/60">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span>
                {post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : "Unknown date"}
              </span>
            </div>
          </div>
        </div>

        {currentUser && currentUser.id === author.id && (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEditPost}
              className="btn btn-sm btn-ghost gap-2 hover:bg-info/10 hover:text-info"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDeletePost}
              className="btn btn-sm btn-ghost gap-2 hover:bg-error/10 hover:text-error"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </motion.button>
          </div>
        )}
      </div>

      <div className="my-5">
        <h2 className="font-bold text-2xl mb-3 text-base-content leading-tight">{post.title}</h2>
        <p className="text-base-content/80 leading-relaxed text-base">{post.body}</p>
      </div>

      {post.image && (
        <motion.div
          className="relative overflow-hidden rounded-xl mb-5 group"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-auto max-h-96 object-cover shadow-lg group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </motion.div>
      )}

      <div className="flex justify-around items-center border-t border-base-300 pt-4 mt-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
            liked 
              ? 'bg-error/10 text-error' 
              : 'hover:bg-base-300 text-base-content/70'
          }`}
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            fill={liked ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
            animate={liked ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </motion.svg>
          <span className="font-semibold">{likesCount}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
            showComments
              ? 'bg-primary/10 text-primary'
              : 'hover:bg-base-300 text-base-content/70'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
            />
          </svg>
          <span className="font-semibold">{allComments.length}</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {showComments && (
          <motion.div
            className="mt-6 space-y-4 border-t border-base-300 pt-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {allComments.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {allComments.map((c, index) => (
                  <motion.div
                    key={c.id}
                    className="bg-base-200/50 backdrop-blur-sm p-4 rounded-xl hover:bg-base-200 transition-colors duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="flex gap-3">
                      <img
                        src={c.user?.avatar || "https://i.pravatar.cc/150?img=1"}
                        alt={c.user?.username || "User"}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm text-base-content">
                            {c.user?.username || "Unknown"}
                          </span>
                          <span className="text-xs text-base-content/50">
                            {c.createdAt
                              ? new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                              : "Unknown"}
                          </span>
                        </div>
                        <p className="text-base-content/80 text-sm leading-relaxed">
                          {c.body}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-base-content/30 mb-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                </svg>
                <p className="text-sm text-base-content/50">No comments yet. Be the first to comment!</p>
              </motion.div>
            )}

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-base-300">
              {currentUser && (
                <img
                  src={currentUser.avatar || "https://i.pravatar.cc/150?img=1"}
                  alt="Your avatar"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                />
              )}
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Write a comment..."
                className="input input-bordered flex-grow focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="btn btn-primary gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
                Send
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
