import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
console.log(import.meta.env.VITE_API_URL);
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
  { email }
);

      toast.success(res.data.message);
      setEmail("");

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to send reset link"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-5">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        />

        <button
          disabled={loading}
          className="w-full bg-blue-500 text-white p-3 rounded"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;