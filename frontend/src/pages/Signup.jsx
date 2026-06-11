import { useState } from "react";
import { signup } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

function Signup() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await signup(formData);

      navigate("/login");

    } catch {

      alert("Signup Failed");
    }
  };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative">

      <div className="absolute w-96 h-96 bg-purple-500/30 blur-3xl rounded-full top-0 left-0" />
      <div className="absolute w-96 h-96 bg-pink-500/30 blur-3xl rounded-full bottom-0 right-0" />

      <motion.div
        initial={{
          opacity: 0,
          y: 50,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
          w-full
          max-w-md
          p-8
          bg-white/10
          backdrop-blur-xl
          border
          border-white/20
          rounded-3xl
          shadow-2xl
          z-10
        "
      >

        <h1 className="text-4xl font-bold text-center text-white mb-2">
          Join TaskForge
        </h1>

        <p className="text-center text-gray-300 mb-8">
          Create your account
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white"
          />

          <button
            type="submit"
            className="
              w-full
              py-4
              rounded-xl
              font-bold
              text-white
              bg-gradient-to-r
              from-purple-500
              via-pink-500
              to-orange-500
              hover:scale-105
              transition-all
            "
          >
            Create Account
          </button>

        </form>

        <p className="text-center text-gray-300 mt-6">

          Already have an account?

          <Link
            to="/login"
            className="text-pink-400 ml-2"
          >
            Login
          </Link>

        </p>

      </motion.div>

    </div>
  );
}

export default Signup;