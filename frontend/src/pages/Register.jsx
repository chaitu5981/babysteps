import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Loader from "../Loader";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [pregnancyStartDate, setPregnancyStartDate] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleRegister = async () => {
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        email,
        name,
        password,
        pregnancyStartDate,
      });
      navigate("/");
    } catch {
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-sm mx-auto">
      <h1 className="text-2xl mb-4 font-bold">Register</h1>
      <input
        className="border p-2 mb-2 w-full"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border p-2 mb-2 w-full"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border p-2 mb-2 w-full"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        className="border p-2 mb-2 w-full"
        type="date"
        placeholder="Pregnancy Start Date"
        value={pregnancyStartDate}
        onChange={(e) => setPregnancyStartDate(e.target.value)}
      />
      <button
        className="bg-green-500 text-white px-4 py-2 w-full"
        onClick={handleRegister}
      >
        {loading ? <Loader color="white" /> : "Register"}
      </button>
      <p className="mt-2 text-sm">
        Already registered?{" "}
        <Link to="/" className="text-blue-600">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
