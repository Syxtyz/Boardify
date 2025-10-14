import axios from "axios";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/auth/login/", {
        username: email, // django User Model uses username by default. To-do: To be able to use email and username for logging in
        password: password,
      });

      console.log("Login success:", response.data);

      login(response.data.access, response.data.refresh);

    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col gap-4 p-4 w-80 mx-auto mt-10 bg-white rounded-lg shadow"
    >
      <input
        type="text"
        placeholder="Email or Username"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
      >
        Login
      </button>
    </form>
  );
}
