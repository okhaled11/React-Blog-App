import React, { useContext } from "react";
import PostCard from "../components/PostCard";
import NavBar from "../components/NavBar";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home({ posts = [], users = [], comments = [] }) {
  const { user } = useContext(AuthContext);

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-100">
      <NavBar />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 py-16 px-4 mb-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
          >
            Welcome to Blogy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-lg md:text-xl text-base-content/70 mb-6"
          >
            Discover amazing stories, share your thoughts, and connect with writers
          </motion.p>
          {!user && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link
                to="/login"
                className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl transition-all"
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
                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                  />
                </svg>
                Join Now
              </Link>
            </motion.div>
          )}
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </motion.div>

      {/* Main Content with Sidebars */}
      <div className="max-w-7xl mx-auto px-4 pb-24">
        {/* Mobile Quick Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="md:hidden mb-6 grid grid-cols-3 gap-3"
        >
          <div className="card bg-primary/10 p-4 text-center">
            <div className="text-2xl font-bold text-primary">{posts.length}</div>
            <div className="text-xs text-base-content/60">Posts</div>
          </div>
          <div className="card bg-secondary/10 p-4 text-center">
            <div className="text-2xl font-bold text-secondary">{users.length}</div>
            <div className="text-xs text-base-content/60">Users</div>
          </div>
          <div className="card bg-accent/10 p-4 text-center">
            <div className="text-2xl font-bold text-accent">{comments.length}</div>
            <div className="text-xs text-base-content/60">Comments</div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="md:col-span-2 lg:col-span-3 space-y-6 order-2 md:order-1"
          >
            {/* User Profile Card */}
            {user && (
              <div className="card bg-base-100 shadow-xl border border-base-300 p-6">
                <div className="flex flex-col items-center">
                  <div className="avatar mb-4">
                    <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img src={user.avatar || "https://i.pravatar.cc/150?img=1"} alt={user.username} />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{user.username}</h3>
                  <p className="text-sm text-base-content/60 mb-4">{user.email}</p>
                  <Link to="/add-post" className="btn btn-primary btn-sm w-full gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Create Post
                  </Link>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-xl border border-base-300 p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
                Community Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/70">Total Posts</span>
                  <span className="font-bold text-primary">{posts.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/70">Active Users</span>
                  <span className="font-bold text-secondary">{users.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/70">Comments</span>
                  <span className="font-bold text-accent">{comments.length}</span>
                </div>
              </div>
            </div>

          </motion.aside>

          {/* Center Content - Posts */}
          <div className="md:col-span-2 lg:col-span-6 order-1 md:order-2">
        {sortedPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="bg-base-200 rounded-full p-8 mb-6 shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-24 h-24 text-primary"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-3 text-base-content">No Posts Yet</h2>
            <p className="text-base-content/60 text-lg mb-6">Be the first to share your story!</p>
            {user && (
              <Link
                to="/add-post"
                className="btn btn-primary btn-lg gap-2 shadow-lg"
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
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Create First Post
              </Link>
            )}
          </motion.div>
        ) : (
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-between mb-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-base-content">Latest Posts</h2>
                <p className="text-base-content/60 mt-1">
                  {sortedPosts.length} {sortedPosts.length === 1 ? 'post' : 'posts'} available
                </p>
              </div>
            </motion.div>

            <div className="space-y-6">
              {sortedPosts.map((post, index) => {
                const author = users.find((u) => u.id === post.authorId) || {};
                const postComments = (comments || [])
                  .filter((c) => c.postId === post.id)
                  .map((c) => ({
                    ...c,
                    user: users.find((u) => u.id === c.userId) || {},
                  }));

                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="w-full"
                  >
                    <PostCard
                      post={post}
                      author={author}
                      comments={postComments}
                      currentUser={user}
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
          </div>

          {/* Right Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="md:col-span-2 lg:col-span-3 space-y-6 order-3"
          >
            {/* Top Authors */}
            <div className="card bg-base-100 shadow-xl border border-base-300 p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-warning">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
                </svg>
                Top Authors
              </h3>
              <div className="space-y-3">
                {users.slice(0, 5).map((author, idx) => (
                  <div key={author.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 transition-colors">
                    <div className="avatar">
                      <div className="w-10 rounded-full ring ring-warning ring-offset-base-100 ring-offset-1">
                        <img src={author.avatar || "https://i.pravatar.cc/150?img=1"} alt={author.username} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate" title={author.username}>{author.username}</p>
                      <p className="text-xs text-base-content/60">
                        {posts.filter(p => p.authorId === author.id).length} posts
                      </p>
                    </div>
                    <div className="badge badge-warning badge-sm flex-shrink-0">#{idx + 1}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card bg-gradient-to-br from-accent/10 to-info/10 shadow-xl border border-base-300 p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-accent">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Recent Activity
              </h3>
              <div className="space-y-3">
                {sortedPosts.slice(0, 3).map((post) => {
                  const author = users.find(u => u.id === post.authorId);
                  return (
                    <div key={post.id} className="text-sm">
                      <p className="text-base-content/80">
                        <span className="font-semibold text-accent">{author?.username || 'Unknown'}</span>
                        {' '}posted
                      </p>
                      <p className="text-base-content/60 truncate mt-1">"{post.title}"</p>
                      <p className="text-xs text-base-content/40 mt-1">
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently'}
                      </p>
                      {sortedPosts.indexOf(post) < 2 && <div className="divider my-2"></div>}
                    </div>
                  );
                })}
              </div>
            </div>

          </motion.aside>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
      >
        <Link
          className="btn btn-primary z-10 fixed bottom-8 right-8 btn-circle w-16 h-16 shadow-2xl hover:shadow-primary/50 hover:scale-110 transition-all duration-300 flex justify-center items-center text-4xl font-light"
          to={user ? "/add-post" : "/login"}
          title={user ? "Create new post" : "Login to create post"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </Link>
      </motion.div>
    </div>
  );
}
