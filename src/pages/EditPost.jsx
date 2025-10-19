import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

export default function EditPost({ currentUser }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [newFile, setNewFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`https://blog-back-production-f88f.up.railway.app/posts/${id}`)
      .then((res) => {
        const data = res.data;
        setTitle(data.title);
        setBody(data.body);
        setImage(data.image);
        setFetchLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching post:", err);
        toast.error("Error loading post");
        setFetchLoading(false);
      });
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewFile(file);
    }
  };

  const uploadNewImage = async () => {
    if (!newFile) return image;

    const fileName = `${Date.now()}_${newFile.name}`;
    const { error } = await supabase.storage
      .from("posts")
      .upload(fileName, newFile);

    if (error) {
      toast.error("Error uploading image");
      return image;
    }

    const { data: publicUrlData } = supabase.storage
      .from("posts")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!currentUser) {
      toast.error("You must be logged in to edit a post");
      setLoading(false);
      return;
    }

    try {
      const finalImageUrl = await uploadNewImage();

      await axios.patch(
        `https://blog-back-production-f88f.up.railway.app/posts/${id}`,
        {
          title,
          body,
          image: finalImageUrl,
          updatedAt: new Date().toISOString(),
        }
      );

      toast.success("Post updated successfully");
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error("❌ Error updating post:", err);
      toast.error("Error updating post");
    }
    setLoading(false);
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg text-base-content/60">Loading post...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-6 overflow-hidden">
      <Toaster />
      
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-block p-4 bg-info/10 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-info">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-info via-primary to-secondary bg-clip-text text-transparent mb-2">
            Edit Your Post
          </h1>
          <p className="text-base-content/60 text-lg">Update your content and make it shine</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          onSubmit={handleUpdate}
          className="card bg-base-100 shadow-2xl rounded-3xl p-8 space-y-6 border border-base-300 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="form-control"
          >
            <label className="label">
              <span className="label-text font-semibold text-base flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                </svg>
                Post Title
              </span>
            </label>
            <input
              type="text"
              placeholder="Enter post title..."
              className="input input-bordered w-full text-lg focus:input-primary transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <label className="label">
              <span className="label-text-alt text-base-content/50">{title.length} characters</span>
            </label>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="form-control"
          >
            <label className="label">
              <span className="label-text font-semibold text-base flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                Post Content
              </span>
            </label>
            <textarea
              placeholder="Write your content..."
              className="textarea textarea-bordered w-full text-lg min-h-40 focus:textarea-primary transition-all"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            ></textarea>
            <label className="label">
              <span className="label-text-alt text-base-content/50">{body.length} characters</span>
            </label>
          </motion.div>

          {image && !newFile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="form-control"
            >
              <label className="label">
                <span className="label-text font-semibold text-base flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-success">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  Current Cover Image
                </span>
              </label>
              <div className="relative overflow-hidden rounded-2xl border-2 border-success/20 shadow-lg group">
                <img
                  src={image}
                  alt="Current"
                  className="w-full h-auto max-h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="form-control"
          >
            <label className="label">
              <span className="label-text font-semibold text-base flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                Change Cover Image (Optional)
              </span>
            </label>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered file-input-primary w-full"
              onChange={handleFileChange}
            />
            <label className="label">
              <span className="label-text-alt text-base-content/50">Upload a new image to replace the current one</span>
            </label>
          </motion.div>

          {newFile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="form-control"
            >
              <label className="label">
                <span className="label-text font-semibold text-base flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-warning">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  New Image Preview
                </span>
                <button
                  type="button"
                  onClick={() => setNewFile(null)}
                  className="btn btn-ghost btn-xs text-error"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                  Remove
                </button>
              </label>
              <div className="relative overflow-hidden rounded-2xl border-2 border-warning/20 shadow-lg group">
                <img
                  src={URL.createObjectURL(newFile)}
                  alt="New Preview"
                  className="w-full h-auto max-h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex gap-4 pt-6 border-t border-base-300"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn btn-info flex-1 text-lg h-14 gap-2 shadow-lg hover:shadow-xl transition-all"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-md"></span>
                  Updating...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  Update Post
                </>
              )}
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <Link
                to="/"
                className="btn btn-outline btn-secondary w-full text-lg h-14 gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                Cancel
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="bg-warning/10 rounded-xl p-4 mt-4"
          >
            <div className="flex gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-warning flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
              <div>
                <h3 className="font-semibold text-warning mb-1">Important Note</h3>
                <p className="text-sm text-base-content/70">
                  Changes will be saved immediately after clicking "Update Post". Make sure all information is correct before submitting.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
}
