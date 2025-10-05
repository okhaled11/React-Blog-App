import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import toast, { Toaster } from "react-hot-toast";

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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-base-200 via-base-300 to-base-200 p-6">
      <div>
        <Toaster />
      </div>

      <form
        onSubmit={handleSubmit}
        className="card w-full max-w-lg bg-base-100 shadow-2xl rounded-2xl p-8 space-y-5 border border-base-300"
      >
        <h2 className="text-3xl font-bold text-center text-primary mb-6">
          Add Post
        </h2>

        <input
          type="text"
          name="title"
          placeholder="Title"
          className="input input-bordered w-full text-lg"
          onChange={handleChange}
          required
        />

        <textarea
          name="body"
          placeholder="Body"
          className="textarea textarea-bordered w-full text-lg min-h-32"
          onChange={handleChange}
          required
        ></textarea>

        <div className="space-y-2">
          <label className="font-semibold text-sm text-gray-600">
            Upload image
          </label>
          <input
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            onChange={handleFileChange}
          />
        </div>

        {file && (
          <div className="mt-4">
            <p className="text-sm mb-2 font-medium text-gray-600">Preview:</p>
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-full rounded-xl border border-base-300 shadow-sm"
            />
          </div>
        )}

        <div className="flex flex gap-3 pt-4">
          <button
            type="submit"
            className="btn btn-primary w-1/2 text-lg"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-infinity loading-lg"></span>
            ) : (
              "Add Post"
            )}
          </button>

          <Link
            to="/"
            className="btn btn-secondary w-1/2 text-lg hover:bg-secondary/80"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
