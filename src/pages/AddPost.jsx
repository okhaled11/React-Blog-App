import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

export default function AddPost() {
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    image: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const uploadToSupabase = async (file) => {
    const fileName = `${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("posts")
      .upload(fileName, file);

    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      return null;
    }

    const { data: publicUrlData, error: urlError } = supabase.storage
      .from("posts")
      .getPublicUrl(fileName);

    if (urlError) {
      console.error("URL error:", urlError.message);
      return null;
    }

    return publicUrlData?.publicUrl || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = "";

    if (file) {
      imageUrl = await uploadToSupabase(file);
      if (!imageUrl) {
        console.error("❌ Failed to upload image");
        setLoading(false);
        return;
      }
    }

    try {
      await axios.post(
        "https://blog-back-production-f88f.up.railway.app/posts",
        {
          ...formData,
          image: imageUrl,
          authorId: user.id,
          createdAt: new Date().toISOString(),
        }
      );
      toast.success("Post added successfully");

      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error("Error adding post");
    }

    setLoading(false);
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-6 overflow-hidden">
      <Toaster />
      
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
            Create New Post
          </h1>
          <p className="text-base-content/60 text-lg">Share your thoughts with the world</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          onSubmit={handleSubmit}
          className="card bg-base-100 shadow-2xl rounded-3xl p-8 space-y-6 border border-base-300 backdrop-blur-sm"
        >

        {/* Title Input */}
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
            name="title"
            placeholder="Enter an engaging title..."
            className="input input-bordered w-full text-lg focus:input-primary transition-all"
            onChange={handleChange}
            value={formData.title}
            required
          />
          <label className="label">
            <span className="label-text-alt text-base-content/50">{formData.title.length} characters</span>
          </label>
        </motion.div>

        {/* Body Textarea */}
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
            name="body"
            placeholder="Write your story here..."
            className="textarea textarea-bordered w-full text-lg min-h-40 focus:textarea-primary transition-all"
            onChange={handleChange}
            value={formData.body}
            required
          ></textarea>
          <label className="label">
            <span className="label-text-alt text-base-content/50">{formData.body.length} characters</span>
            <span className="label-text-alt text-base-content/50">Minimum 10 characters</span>
          </label>
        </motion.div>

        {/* Image Upload */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="form-control"
        >
          <label className="label">
            <span className="label-text font-semibold text-base flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              Cover Image (Optional)
            </span>
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered file-input-primary w-full"
              onChange={handleFileChange}
            />
          </div>
          <label className="label">
            <span className="label-text-alt text-base-content/50">Supported: JPG, PNG, GIF (Max 5MB)</span>
          </label>
        </motion.div>

        {/* Image Preview */}
        {file && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="form-control"
          >
            <label className="label">
              <span className="label-text font-semibold text-base flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-success">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                Image Preview
              </span>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="btn btn-ghost btn-xs text-error"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                Remove
              </button>
            </label>
            <div className="relative overflow-hidden rounded-2xl border-2 border-primary/20 shadow-lg group">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="w-full h-auto max-h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex gap-4 pt-6 border-t border-base-300"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn btn-primary flex-1 text-lg h-14 gap-2 shadow-lg hover:shadow-xl transition-all"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-md"></span>
                Publishing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
                Publish Post
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

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="bg-info/10 rounded-xl p-4 mt-4"
        >
          <div className="flex gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-info flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
            <div>
              <h3 className="font-semibold text-info mb-2">Writing Tips</h3>
              <ul className="text-sm text-base-content/70 space-y-1">
                <li>• Use a clear and catchy title</li>
                <li>• Add an engaging cover image</li>
                <li>• Write detailed and meaningful content</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.form>
      </motion.div>
    </div>
  );
}
