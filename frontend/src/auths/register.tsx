import { useState } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

export default function Register() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/register/", {
        username,
        email,
        password,
      });

      console.log("Registration success:", res.data);
      
      const loginRes = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
        username,
        password,
      });

      login(loginRes.data.access, loginRes.data.refresh);

    } catch (err: any) {
      console.error("Registration error:", err.response?.data || err.message);
      setError(
        err.response?.data?.detail ||
          err.response?.data?.error ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="flex flex-col gap-4 p-4 w-80 mx-auto mt-10 bg-white rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold text-center">Register</h2>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <input
        type="text"
        placeholder="Username"
        className="border p-2 rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Confirm Password"
        className="border p-2 rounded"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className={`bg-blue-500 text-white py-2 rounded transition ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
        }`}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
}
