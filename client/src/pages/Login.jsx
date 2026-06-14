import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password
      });

      console.log("SUCCESS =>", res.data);

      localStorage.setItem("token", res.data.token);

      alert("Login Successful 🚀");

      navigate("/dashboard");

    } catch (error) {
      console.log("ERROR =>", error);
      console.log("RESPONSE =>", error.response);
      console.log("DATA =>", error?.response?.data);

      alert(
        JSON.stringify(
          error?.response?.data || error.message
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-slate-800 p-8 rounded-xl w-96 shadow-xl">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Splitwise Login
        </h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded bg-slate-700 text-white"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded bg-slate-700 text-white"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-gray-300 mt-4 text-center">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-green-400"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;