// src/AnimatedRoutes.jsx
import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Register from "../pages/Register";
import Login from "../pages/Login";
import Home from "../pages/Home";
import AddPost from "../pages/AddPost";
import EditPost from "../pages/EditPost";
import { AuthContext } from "../context/AuthContext";

export default function AnimatedRoutes({ user, posts, users, comments }) {
  const location = useLocation();

  const pageTransition = {
    initial: { opacity: 0, x: 100, scale: 0.98 },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      scale: 0.98,
      transition: { duration: 0.4 },
    },
  };

  const PrivateRoute = ({ children }) =>
    user ? children : <Navigate to="/login" />;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div {...pageTransition}>
              <Home posts={posts} users={users} comments={comments} />
            </motion.div>
          }
        />
        <Route
          path="/register"
          element={
            <motion.div {...pageTransition}>
              <Register />
            </motion.div>
          }
        />
        <Route
          path="/login"
          element={
            <motion.div {...pageTransition}>
              <Login />
            </motion.div>
          }
        />

        <Route
          path="/add-post"
          element={
            <PrivateRoute>
              <motion.div {...pageTransition}>
                <AddPost />
              </motion.div>
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-post/:id"
          element={
            <PrivateRoute>
              <motion.div {...pageTransition}>
                <EditPost currentUser={user} />
              </motion.div>
            </PrivateRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
