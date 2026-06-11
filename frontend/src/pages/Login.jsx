import { useState, useEffect } from "react";
import { login } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
function Login() {

  const navigate = useNavigate();
const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {

    const move = (e) => {

      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", move);

    return () =>
      window.removeEventListener(
        "mousemove",
        move
      );

  }, []);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

  e.preventDefault();

  setLoading(true);

  try {

    const data = await login(formData);

    localStorage.setItem(
      "token",
      data.token
    );
    localStorage.setItem("userEmail", formData.email);

// derive username from email
const name = formData.email.split("@")[0];

localStorage.setItem("userName", name);

    toast.success("Welcome back!");

    navigate("/dashboard");

  } catch {

    toast.error("Invalid credentials");

  } finally {

    setLoading(false);
  }
};

  return (

    <div className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center">

      {/* Mouse Glow */}

      <div
        className="pointer-events-none absolute w-80 h-80 rounded-full bg-pink-500/20 blur-3xl"
        style={{
          left: position.x - 160,
          top: position.y - 160,
        }}
      />

      {/* Animated Blobs */}

      <motion.div
        animate={{
          x: [0, 150, 0],
          y: [0, 80, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
        }}
        className="absolute top-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -150, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
        }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/30 rounded-full blur-3xl"
      />

      <motion.div
        animate={{
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
        }}
        className="absolute w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"
      />

      {/* Card */}

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
          z-10
          w-full
          max-w-md
          p-8
          backdrop-blur-xl
          bg-white/10
          border
          border-white/20
          rounded-3xl
          shadow-2xl
        "
      >

        <h1 className="text-4xl font-bold text-center text-white mb-2">
          TaskForge
        </h1>

        <p className="text-center text-gray-300 mb-8">
          Welcome Back
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            className="
              w-full
              p-4
              rounded-xl
              bg-white/10
              border
              border-white/20
              text-white
              outline-none
            "
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="
              w-full
              p-4
              rounded-xl
              bg-white/10
              border
              border-white/20
              text-white
              outline-none
            "
          />

         <button
  type="submit"
  disabled={loading}
  className="
    w-full
    py-3
    rounded-xl
    font-semibold
    text-white
    bg-gradient-to-r
    from-pink-500
    via-purple-500
    to-indigo-500
    hover:scale-105
    hover:shadow-lg
    hover:shadow-purple-500/30
    transition-all
    duration-300
    disabled:opacity-50
    disabled:cursor-not-allowed
  "
>
  {loading ? (
    <span className="flex items-center justify-center gap-2">
      <div
        className="
          w-5
          h-5
          border-2
          border-white
          border-t-transparent
          rounded-full
          animate-spin
        "
      ></div>
      Signing In...
    </span>
  ) : (
    "Login"
  )}
</button>


        </form>
    
 <div className="text-right mt-2">
          <button type="button" onClick={() => navigate("/forgot-password")} className="text-pink-400 hover:text-pink-300 hover:underline">
            Forgot Password?
          </button>
        </div>

        <p className="text-center text-gray-300 mt-6">

          Don't have an account?

          <Link
            to="/signup"
            className="text-pink-400 ml-2"
          >
            Signup
          </Link>

        </p>

      </motion.div>

    </div>
  );

}

export default Login;