import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { Eye, EyeOff, Upload } from "lucide-react";
import PasswordFields from "../components/PasswordFields";
import toast from "react-hot-toast";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const uploadToSupabase = async (file) => {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from("avatar")
      .upload(fileName, file);
    if (error) {
      console.error("Upload error:", error);
      return null;
    }
    const { data: publicUrlData } = supabase.storage
      .from("avatar")
      .getPublicUrl(fileName);
    return publicUrlData?.publicUrl || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let avatarUrl = "";

    if (file) {
      avatarUrl = await uploadToSupabase(file);
      if (!avatarUrl) {
        toast.error("Error uploading avatar");
        setLoading(false);
        return;
      }
    }

    try {
      await axios.post(
        "https://blog-back-production-f88f.up.railway.app/users",
        {
          ...formData,
          avatar: avatarUrl,
        }
      );

      toast.success("Registered successfully");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-base-200">
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-500 to-violet-600 items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1508780709619-79562169bc64?w=800"
          alt="Register Illustration"
          className="w-3/4 animate-fade-in"
        />
      </div>

      <div className="flex w-full md:w-1/2 justify-center items-center p-6">
        <form
          onSubmit={handleSubmit}
          className="card w-full max-w-md bg-base-100 shadow-2xl p-8 space-y-4"
        >
          <h2 className="text-3xl font-bold text-center">Create Account</h2>

          {file && (
            <div className="flex justify-center">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover mb-4"
              />
            </div>
          )}

          <input
            type="text"
            name="username"
            placeholder="Username"
            className="input input-bordered w-full"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input input-bordered w-full"
            onChange={handleChange}
            required
          />

          <PasswordFields formData={formData} setFormData={setFormData} />

          <label className="flex items-center gap-2 cursor-pointer bg-base-300 rounded-lg p-2 hover:bg-base-200">
            <Upload size={18} />
            <span>{file ? file.name : "Upload Avatar"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-infinity loading-xl"></span>
            ) : (
              "Register"
            )}
          </button>

          <p className="text-center">
            Already have an account?{" "}
            <Link to="/login" className="underline text-indigo-600">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
