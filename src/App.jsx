import React, { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import axios from "axios";
import AnimatedRoutes from "./components/AnimatedRoutes";

export default function App() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [postsRes, usersRes, commentsRes] = await Promise.all([
        axios.get("https://blog-back-production-f88f.up.railway.app/posts"),
        axios.get("https://blog-back-production-f88f.up.railway.app/users"),
        axios.get("https://blog-back-production-f88f.up.railway.app/comments"),
      ]);
      setPosts(postsRes.data);
      setUsers(usersRes.data);
      setComments(commentsRes.data);
    };
    fetchData();
  }, []);

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  return (
    <>
      <AnimatedRoutes
        user={user}
        posts={posts}
        users={users}
        comments={comments}
      />
    </>
  );
}
