import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleRegister = async () => {
    try {
      const res = await API.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      console.log("SUCCESS =>", res.data);

      alert("Registration Successful 🚀");

      navigate("/login");

    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
        "Registration Failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-slate-800 p-8 rounded-xl w-96 shadow-xl">

        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Splitwise Register
        </h1>

        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) =>
            setFormData({
              ...formData,
              name: e.target.value
            })
          }
          className="w-full p-3 mb-4 rounded bg-slate-700 text-white"
        />

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({
              ...formData,
              email: e.target.value
            })
          }
          className="w-full p-3 mb-4 rounded bg-slate-700 text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({
              ...formData,
              password: e.target.value
            })
          }
          className="w-full p-3 mb-4 rounded bg-slate-700 text-white"
        />

        <button
          onClick={handleRegister}
          className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded"
        >
          Register
        </button>

        <p className="text-gray-300 mt-4 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-400"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;