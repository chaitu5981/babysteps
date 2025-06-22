import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("pregnancyStartDate", res.data.pregnancyStartDate);
      localStorage.setItem("name", res.data.name);
      navigate("/milestones");
    } catch {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h1 className="text-2xl mb-4 font-bold">Login</h1>
      <input
        className="border p-2 mb-2 w-full"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 mb-2 w-full"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 w-full"
        onClick={handleLogin}
      >
        {loading ? <Loader color="white" /> : "Login"}
      </button>
      <p className="mt-2 text-sm">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
